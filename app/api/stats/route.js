import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()
const API_SECRET = 'MICHIGUN_SECURE_TOKEN_V9_X2'

export async function GET() {
  const executions = await redis.get('script_executions') || 0
  return NextResponse.json({ 
    executions,
    headers: { 'Cache-Control': 'no-store, max-age=0' } 
  })
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization")
  const userAgent = req.headers.get("user-agent")
  const userId = req.headers.get("user-fingerprint")

  if (authHeader !== API_SECRET) {
    return NextResponse.json({}, { status: 403 })
  }

  if (!userAgent || !userAgent.includes("Roblox")) {
    return NextResponse.json({}, { status: 403 })
  }

  if (!userId || isNaN(Number(userId))) {
    return NextResponse.json({}, { status: 400 })
  }

  const lockKey = `lock:user:${userId}`
  const isAllowed = await redis.set(lockKey, '1', { ex: 30, nx: true })

  if (!isAllowed) {
    return NextResponse.json({}, { status: 429 })
  }

  const executions = await redis.incr('script_executions')
  
  return NextResponse.json({ executions })
}