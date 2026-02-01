import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

export async function GET() {
  const executions = await redis.get('script_executions')
  
  return NextResponse.json(
    { executions: executions || 0 },
    { 
      status: 200,
      headers: { 
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      } 
    }
  )
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || ""
    const userAgent = req.headers.get("user-agent") || ""
    const userId = req.headers.get("user-fingerprint") || ""
    
    // Pega a senha das variáveis de ambiente da Vercel
    const secret = process.env.API_SECRET

    if (!secret || authHeader !== secret) {
      return NextResponse.json({ error: 'Forbidden: Invalid Token' }, { status: 403 })
    }

    if (!userAgent.includes("Roblox")) {
      return NextResponse.json({ error: 'Forbidden: Invalid User-Agent' }, { status: 403 })
    }

    if (!userId || userId.trim() === "" || isNaN(Number(userId))) {
      return NextResponse.json({ error: 'Bad Request: Invalid ID' }, { status: 400 })
    }

    const rateLimitKey = `limit:user:${userId}`
    const success = await redis.set(rateLimitKey, '1', { ex: 30, nx: true })

    if (!success) {
      return NextResponse.json(
        { error: 'Rate Limit Exceeded' }, 
        { status: 429 }
      )
    }

    const newCount = await redis.incr('script_executions')
    
    return NextResponse.json({ success: true, executions: newCount }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}