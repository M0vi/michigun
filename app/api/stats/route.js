import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

const redis = Redis.fromEnv()

// Configuração do Rate Limit:
// Permite 1 requisição a cada 60 segundos ("60 s")
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(1, "60 s"),
})

export async function GET() {
  // Pega o número atual
  const executions = await redis.get('script_executions') || 0
  
  return NextResponse.json({ 
    executions,
    // Cabeçalho para não fazer cache do número (opcional, mas bom para atualizar rápido)
    headers: { 'Cache-Control': 'no-store' } 
  })
}

export async function POST(req: Request) {
  // 1. Identificar o IP do usuário (Roblox Server ou PC)
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1"
  
  // 2. Verificar se esse IP já atingiu o limite
  const { success } = await ratelimit.limit(ip)
  
  // 3. Se não tiver sucesso (limitado), retorna erro 429 e NÃO conta
  if (!success) {
    return NextResponse.json(
      { error: 'Calma lá! Muitas execuções.' }, 
      { status: 429 }
    )
  }

  // 4. Se passou, incrementa +1
  const executions = await redis.incr('script_executions')
  
  return NextResponse.json({ executions })
}
