import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function GET() {
  const executions = await redis.get('script_executions') || 0
  return NextResponse.json({ executions })
}

export async function POST() {
  const executions = await redis.incr('script_executions')
  return NextResponse.json({ executions })
}