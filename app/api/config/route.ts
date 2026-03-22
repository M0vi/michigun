import { NextResponse } from 'next/server'
import { env } from '@/env'

let ratelimit: any = null

async function getRatelimit() {
  if (ratelimit) return ratelimit
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return null
  try {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis } = await import('@upstash/redis')
    ratelimit = new Ratelimit({
      redis: new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      }),

      limiter: Ratelimit.slidingWindow(20, '60 s'),
      analytics: false,
    })
  } catch {
  }
  return ratelimit
}

export async function GET(req: Request) {
  // rate limit
  const rl = await getRatelimit()
  if (rl) {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
    const { success } = await rl.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }
  }

  return NextResponse.json(
    { script: env.LOADER_SCRIPT },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}