import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

export async function GET() {
  const executions = await redis.get('script_executions')
  return NextResponse.json({ executions: executions || 0 }, { status: 200 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)

    if (!body) {
      return NextResponse.json({ error: 'Body vazio' }, { status: 400 })
    }

    const { userId, secret } = body
    const envKey = process.env.API_KEY

    if (!envKey) {
      console.error("API_KEY não configurada")
      return NextResponse.json({ error: 'Erro de configuração do servidor' }, { status: 500 })
    }

    if (secret !== envKey) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID faltando' }, { status: 400 })
    }

    const rateLimitKey = `limit:user:${userId}`
    const allowed = await redis.set(rateLimitKey, '1', { ex: 30, nx: true })

    if (!allowed) {
      return NextResponse.json({ error: 'Rate limit' }, { status: 429 })
    }

    const newCount = await redis.incr('script_executions')
    return NextResponse.json({ success: true, executions: newCount }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}