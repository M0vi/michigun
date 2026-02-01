import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()
const API_SECRET = 'MICHIGUN_SECURE_TOKEN_V9_X2'

export async function GET() {
  const executions = await redis.get('script_executions') || 0
  
  return NextResponse.json(
    { executions },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  )
}

// Note o "export" minúsculo e o "NextRequest"
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  const userAgent = req.headers.get("user-agent")
  const userId = req.headers.get("user-fingerprint")

  // Validação 1: Token secreto
  if (authHeader !== API_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Validação 2: User Agent do Roblox
  if (!userAgent || !userAgent.includes("Roblox")) {
    return NextResponse.json({ error: 'Invalid User Agent' }, { status: 403 })
  }

  // Validação 3: Formato do ID
  if (!userId || isNaN(Number(userId))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  // Validação 4: Bloqueio Atômico (30 segundos)
  const lockKey = `lock:user:${userId}`
  // Tenta salvar a chave. Se ela JÁ existir (nx: true), retorna null (bloqueia).
  // Se não existir, salva e expira em 30s.
  const isAllowed = await redis.set(lockKey, '1', { ex: 30, nx: true })

  if (!isAllowed) {
    return NextResponse.json({ error: 'Rate limit' }, { status: 429 })
  }

  const executions = await redis.incr('script_executions')
  
  return NextResponse.json({ executions })
}
