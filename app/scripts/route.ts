import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

function getBrazilDateKey() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
}

const browserMessage = `--[[

// propriedade do michigun.xyz
// https://discord.gg/pWeJUBabvF
// https://michigun.xyz/


                  ███           █████       ███                                                                     
                 ▒▒▒           ▒▒███       ▒▒▒                                                                      
 █████████████   ████   ██████  ▒███████   ████   ███████ █████ ████ ████████      █████ █████ █████ ████  █████████
▒▒███▒▒███▒▒███ ▒▒███  ███▒▒███ ▒███▒▒███ ▒▒███  ███▒▒███▒▒███ ▒███ ▒▒███▒▒███    ▒▒███ ▒▒███ ▒▒███ ▒███  ▒█▒▒▒▒███ 
 ▒███ ▒███ ▒███  ▒███ ▒███ ▒▒▒  ▒███ ▒███  ▒███ ▒███ ▒███ ▒███ ▒███  ▒███ ▒███     ▒▒▒█████▒   ▒███ ▒███  ▒   ███▒  
 ▒███ ▒███ ▒███  ▒███ ▒███  ███ ▒███ ▒███  ▒███ ▒███ ▒███ ▒███ ▒███  ▒███ ▒███      ███▒▒▒███  ▒███ ▒███    ███▒   █
 █████▒███ █████ █████▒▒██████  ████ █████ █████▒▒███████ ▒▒████████ ████ █████ ██ █████ █████ ▒▒███████   █████████
▒▒▒▒▒ ▒▒▒ ▒▒▒▒▒ ▒▒▒▒▒  ▒▒▒▒▒▒  ▒▒▒▒ ▒▒▒▒▒ ▒▒▒▒▒  ▒▒▒▒▒███  ▒▒▒▒▒▒▒▒ ▒▒▒▒ ▒▒▒▒▒ ▒▒ ▒▒▒▒▒ ▒▒▒▒▒   ▒▒▒▒▒███  ▒▒▒▒▒▒▒▒▒ 
                                                 ███ ▒███                                       ███ ▒███            
                                                ▒▒██████                                       ▒▒██████             
                                                 ▒▒▒▒▒▒                                         ▒▒▒▒▒▒              

// O que é michigun?
// michigun.xyz é um script feito para jogos de Exército Brasileiro.                                  

// Por que você está vendo isso?
// Isso deve ser executado por meio de um executor.                                                                                   

--]]`

interface RouteParams {
  params: Promise<{ filename: string }>
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  if (req.method === 'HEAD' || req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 })
  }

  try {
    const { filename } = await params

    if (
      !filename ||
      !filename.endsWith('.lua') ||
      filename.includes('..') ||
      filename.includes('/') ||
      filename.includes('\\')
    ) {
      return new NextResponse(null, { status: 404 })
    }

    const userAgent = req.headers.get('user-agent') || ''
    const acceptHeader = req.headers.get('accept') || ''
    const isBrowser = userAgent.includes('Mozilla') && acceptHeader.includes('text/html')

    if (isBrowser) {
      return new NextResponse(browserMessage, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store, max-age=0',
        },
      })
    }

    if (filename === 'main.lua') {
      try {
        const userId    = req.headers.get('x-user-id')
        const placeId   = req.headers.get('x-place-id')
        const timestamp = req.headers.get('x-timestamp')
        const signature = req.headers.get('x-signature')
        const mode      = req.headers.get('x-mode')
        const secret    = process.env.SCRIPT_SECRET

        if (userId && placeId && timestamp && signature && secret) {
          const now     = Math.floor(Date.now() / 1000)
          const reqTime = Number(timestamp)

          if (!isNaN(reqTime) && Math.abs(now - reqTime) <= 60) {
            const dataString        = `${userId}${placeId}${timestamp}${secret}`
            const expectedSignature = crypto.createHash('sha256').update(dataString).digest('hex')

            if (signature === expectedSignature) {
              const dedupeKey   = `dedupe:${signature}`
              const isNewRequest = await redis.set(dedupeKey, '1', { ex: 90, nx: true })

              if (isNewRequest) {
                const dateKey = `daily_executions:${getBrazilDateKey()}`
                await Promise.all([
                  redis.incr('script_executions'),
                  redis.incr(dateKey),
                ])
                redis.expire(dateKey, 172800)
              }

              if (mode === 'check') {
                return new NextResponse('OK', { status: 200 })
              }
            }
          }
        }
      } catch {}
    }

    const filePath = path.join(process.cwd(), 'scripts', filename)

    if (!fs.existsSync(filePath)) {
      return new NextResponse(null, { status: 404 })
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')

    return new NextResponse(fileContents, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}