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

  const scriptToReturn = `loadstring(game:HttpGet("https://api.jnkie.com/api/v1/luascripts/public/66b35878a8bf3053747f543e17f7cdd565caa7d0bf5712a768ce5a874eb74c9e/download"))()`

  try {
    const userId = req.headers.get('x-user-id')
    const placeId = req.headers.get('x-place-id')
    const timestamp = req.headers.get('x-timestamp')
    const signature = req.headers.get('x-signature')
    const mode = req.headers.get('x-mode')
    const secret = process.env.SCRIPT_SECRET

    if (userId && placeId && timestamp && signature && secret) {
      const now = Math.floor(Date.now() / 1000)
      const reqTime = Number(timestamp)

      if (!isNaN(reqTime) && Math.abs(now - reqTime) <= 60) {
        const dataString = `${userId}${placeId}${timestamp}${secret}`
        const expectedSignature = crypto.createHash('sha256').update(dataString).digest('hex')

        if (signature === expectedSignature) {
          const dedupeKey = `dedupe:${signature}`
          
          const isNewRequest = await redis.set(dedupeKey, '1', { ex: 30, nx: true })

          if (isNewRequest) {
            const dateKey = `daily_executions:${getBrazilDateKey()}`
            await Promise.all([
              redis.incr('script_executions'),
              redis.incr(dateKey)
            ])
            redis.expire(dateKey, 172800)
          }

          if (mode === 'check') {
            return new NextResponse('OK', { status: 200 })
          }
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
