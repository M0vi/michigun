import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

function getBrazilDateKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    const placeId = req.headers.get('x-place-id')
    const timestamp = req.headers.get('x-timestamp')
    const signature = req.headers.get('x-signature')
    const secret = process.env.SCRIPT_SECRET || ''

    if (!userId || !placeId || !timestamp || !signature || !secret) {
      return new NextResponse('Access Denied', { status: 403 })
    }

    const now = Math.floor(Date.now() / 1000)
    const reqTime = Number(timestamp)

    if (isNaN(reqTime) || Math.abs(now - reqTime) > 60) {
      return new NextResponse('Expired', { status: 403 })
    }

    const dataString = `${userId}${placeId}${timestamp}${secret}`
    const expectedSignature = crypto.createHash('sha256').update(dataString).digest('hex')

    if (signature !== expectedSignature) {
      return new NextResponse('Invalid Signature', { status: 403 })
    }

    const dateKey = `daily_executions:${getBrazilDateKey()}`
    
    await Promise.all([
      redis.incr('script_executions'),
      redis.incr(dateKey)
    ])
    redis.expire(dateKey, 172800)

    const luaCode = `loadstring(game:HttpGet("https://api.jnkie.com/api/v1/luascripts/public/66b35878a8bf3053747f543e17f7cdd565caa7d0bf5712a768ce5a874eb74c9e/download"))()`

    return new NextResponse(luaCode, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })

  } catch (error) {
    return new NextResponse('Server Error', { status: 500 })
  }
}