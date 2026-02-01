import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()
const INTERNAL_KEY = 'MICHIGUN_FORCE_V3_KEY'

export async function GET() {
  const executions = await redis.get('script_executions')
  return NextResponse.json({ executions: executions || 0 }, { status: 200 })
}

export async function POST(req: NextRequest) {
  try {
    // Tenta ler os dados do CORPO da requisição (JSON) em vez dos Headers
    const body = await req.json().catch(() => null)

    if (!body) {
      return NextResponse.json({ error: 'Body vazio ou inválido' }, { status: 400 })
    }

    const { userId, secret } = body

    // 1. Validação da Senha
    if (secret !== INTERNAL_KEY) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 403 })
    }

    // 2. Validação do ID
    if (!userId) {
      return NextResponse.json({ error: 'User ID faltando' }, { status: 400 })
    }

    // 3. Rate Limit (Anti-Spam)
    const rateLimitKey = `limit:user:${userId}`
    const allowed = await redis.set(rateLimitKey, '1', { ex: 30, nx: true })

    if (!allowed) {
      return NextResponse.json({ error: 'Espere 30s' }, { status: 429 })
    }

    // 4. Sucesso
    const newCount = await redis.incr('script_executions')
    return NextResponse.json({ success: true, executions: newCount }, { status: 200 })

  } catch (error) {
    console.error("Erro no servidor:", error)
    return NextResponse.json({ error: 'Erro interno no Redis/Server' }, { status: 500 })
  }
}