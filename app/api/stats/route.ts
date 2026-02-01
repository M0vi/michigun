import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'

// Força a rota a ser dinâmica para não ter cache estático
export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()
const API_SECRET = 'MICHIGUN_SECURE_TOKEN_V9_X2'

export async function GET() {
  const executions = await redis.get('script_executions')
  
  return NextResponse.json(
    { executions: executions || 0 },
    { 
      status: 200,
      headers: { 
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      } 
    }
  )
}

export async function POST(req: NextRequest) {
  try {
    // 1. Pega os headers com segurança (evitando erro de nulo)
    const authHeader = req.headers.get("authorization") || ""
    const userAgent = req.headers.get("user-agent") || ""
    const userId = req.headers.get("user-fingerprint") || ""

    // 2. Validação de Segurança (Token e User Agent)
    if (authHeader !== API_SECRET) {
      return NextResponse.json({ error: 'Acesso Negado: Token Inválido' }, { status: 403 })
    }

    if (!userAgent.includes("Roblox")) {
      return NextResponse.json({ error: 'Acesso Negado: Apenas Roblox' }, { status: 403 })
    }

    // 3. Validação do ID do Jogador
    // Se o ID estiver vazio ou não for número, bloqueia.
    if (!userId || userId.trim() === "" || isNaN(Number(userId))) {
      return NextResponse.json({ error: 'ID do jogador inválido' }, { status: 400 })
    }

    // 4. RATE LIMIT (O Coração do Anti-Spam)
    // Cria uma chave única para esse usuário
    const rateLimitKey = `limit:user:${userId}`
    
    // Tenta definir a chave APENAS SE ELA NÃO EXISTIR (nx: true)
    // Expira em 30 segundos (ex: 30)
    const success = await redis.set(rateLimitKey, '1', { ex: 30, nx: true })

    // Se o Redis retornar null, significa que a chave JÁ EXISTE (usuário executou há menos de 30s)
    if (!success) {
      return NextResponse.json(
        { error: 'Rate Limit: Aguarde 30 segundos entre execuções.' }, 
        { status: 429 }
      )
    }

    // 5. Se passou por tudo, incrementa o contador global
    const newCount = await redis.incr('script_executions')
    
    return NextResponse.json({ 
      success: true, 
      executions: newCount 
    }, { status: 200 })

  } catch (error) {
    console.error("Erro na API:", error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
