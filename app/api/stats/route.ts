import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import crypto from 'crypto'

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

    const { userId, timestamp, signature } = body
    const envKey = process.env.API_KEY

    if (!userId || !timestamp || !signature) {
      return NextResponse.json({ error: 'Dados faltando' }, { status: 400 })
    }

    const now = Math.floor(Date.now() / 1000)
    const reqTime = Number(timestamp)

    if (now - reqTime > 60 || reqTime > now + 5) {
      return NextResponse.json({ error: 'Request expirada (Time mismatch)' }, { status: 403 })
    }

    const dataString = `${userId}${timestamp}${envKey}`
    const expectedSignature = crypto.createHash('sha256').update(dataString).digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Assinatura Inválida (Senha ou dados incorretos)' }, { status: 403 })
    }

    const rateLimitKey = `limit:user:${userId}`
    const allowed = await redis.set(rateLimitKey, '1', { ex: 30, nx: true })

    if (!allowed) {
      return NextResponse.json({ error: 'Rate Limit' }, { status: 429 })
    }

    const newCount = await redis.incr('script_executions')
    return NextResponse.json({ success: true, executions: newCount }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}