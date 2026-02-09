import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

function getBrazilDateKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
}

export async function GET(req: NextRequest) {
  if (req.method === 'HEAD' || req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 })
  }

  const scriptUrl = "https://api.jnkie.com/api/v1/luascripts/public/66b35878a8bf3053747f543e17f7cdd565caa7d0bf5712a768ce5a874eb74c9e/download"
  let scriptToReturn = `loadstring(game:HttpGet("${scriptUrl}"))()`

  try {
    const userId = req.headers.get('x-user-id')
    const placeId = req.headers.get('x-place-id')
    const timestamp = req.headers.get('x-timestamp')
    const signature = req.headers.get('x-signature')
    const secret = process.env.SCRIPT_SECRET

    if (userId && placeId && timestamp && signature && secret) {
      const now = Math.floor(Date.now() / 1000)
      const reqTime = Number(timestamp)

      if (!isNaN(reqTime) && Math.abs(now - reqTime) <= 60) {
        const dataString = `${userId}${placeId}${timestamp}${secret}`
        const expectedSignature = crypto.createHash('sha256').update(dataString).digest('hex')

        if (signature === expectedSignature) {
          const dedupeKey = `dedupe:${signature}`
          
          // Tenta reservar essa execução por 15 segundos
          const isFirstRequest = await redis.set(dedupeKey, '1', { ex: 15, nx: true })

          if (!isFirstRequest) {
            // SE FOR DUPLICADA: Retorna código vazio para não executar 2x
            return new NextResponse('print("Execução duplicada ignorada pelo servidor.")', {
              status: 200,
              headers: { 'Content-Type': 'text/plain' },
            })
          }

          const dateKey = `daily_executions:${getBrazilDateKey()}`
          await Promise.all([
            redis.incr('script_executions'),
            redis.incr(dateKey)
          ])
          redis.expire(dateKey, 172800)
        }
      }
    }
  } catch (error) {
    console.error(error)
  }

  return new NextResponse(scriptToReturn, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  })
}
