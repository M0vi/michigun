import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

// 1. Limite por Jogador (1 execução a cada 60s)
const limitUser = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(1, "60 s"),
  prefix: "ratelimit_user", // Prefixo diferente para não misturar
})

// 2. Limite por IP (20 execuções a cada 60s)
// Isso impede que um único PC spamme milhares de IDs falsos
const limitIp = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(20, "60 s"),
  prefix: "ratelimit_ip",
})

export async function GET() {
  const executions = await redis.get('script_executions') || 0
  
  return NextResponse.json({ 
    executions,
    headers: { 'Cache-Control': 'no-store, max-age=0' } 
  })
}

export async function POST(req: Request) {
  // Pega o IP real de quem está chamando
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1"
  
  // Pega o ID enviado pelo script
  const userId = req.headers.get("user-fingerprint")

  // --- CAMADA DE SEGURANÇA 1: Validação ---
  // Se não tiver ID ou se o ID não for um número (ex: "abc"), rejeita.
  if (!userId || isNaN(Number(userId))) {
    return NextResponse.json(
      { error: 'Invalid Request. Missing or invalid user-fingerprint.' }, 
      { status: 400 }
    )
  }

  // --- CAMADA DE SEGURANÇA 2: Bloqueio de Spam por IP ---
  // Verifica se esse IP está enviando requisições demais (mesmo com IDs diferentes)
  const ipCheck = await limitIp.limit(ip)
  if (!ipCheck.success) {
    return NextResponse.json(
      { error: 'Too many requests from this IP.' }, 
      { status: 429 }
    )
  }

  // --- CAMADA DE SEGURANÇA 3: Bloqueio por Jogador ---
  // Verifica se esse jogador específico já executou recentemente
  const userCheck = await limitUser.limit(userId)
  if (!userCheck.success) {
    return NextResponse.json(
      { error: 'You have already executed the script recently.' }, 
      { status: 429 }
    )
  }

  // Se passou por todas as barreiras, conta +1
  const executions = await redis.incr('script_executions')
  
  return NextResponse.json({ executions })
}
