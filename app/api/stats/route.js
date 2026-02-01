import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(1, "60 s"),
})

export async function GET() {
  const executions = await redis.get('script_executions') || 0
  
  return NextResponse.json({ 
    executions,
    headers: { 'Cache-Control': 'no-store, max-age=0' } 
  })
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1"
  
  // Tenta pegar o ID do jogador enviado pelo script. Se não tiver, usa o IP.
  const identifier = req.headers.get("user-fingerprint") ?? ip
  
  const { success } = await ratelimit.limit(identifier)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' }, 
      { status: 429 }
    )
  }

  const executions = await redis.incr('script_executions')
  
  return NextResponse.json({ executions })
}
