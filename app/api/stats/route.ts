import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

function getBrazilDateKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
}

export async function GET() {
  const dateKey = `daily_executions:${getBrazilDateKey()}`
  
  const [total, daily] = await Promise.all([
    redis.get<number>('script_executions'),
    redis.get<number>(dateKey)
  ])
  
  return NextResponse.json({
    executions: total || 0,
    daily: daily || 0
  }, { status: 200 })
}
