import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

function getBrazilDateKey() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
}

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return NextResponse.json(
      {
        executions: 0,
        daily: 0,
      },
      { status: 200 }
    )
  }

  try {
    const redis = new Redis({ url, token })
    const dateKey = `daily_executions:${getBrazilDateKey()}`

    const [total, daily] = await Promise.all([
      redis.get<number>('script_executions'),
      redis.get<number>(dateKey),
    ])

    return NextResponse.json(
      {
        executions: total || 0,
        daily: daily || 0,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Stats Redis error:', error)
    return NextResponse.json(
      {
        executions: 0,
        daily: 0,
      },
      { status: 200 }
    )
  }
}