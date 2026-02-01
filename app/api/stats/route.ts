import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

// CHAVE FIXA NO CODIGO PARA EVITAR ERRO DE LEITURA
const INTERNAL_KEY = 'MICHIGUN_FORCE_V3_KEY'

export async function GET() {
  const executions = await redis.get('script_executions')
  
  return NextResponse.json(
    { executions: executions || 0 },
    { 
      status: 200,
      headers: { 
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      } 
    }
  )
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || ""
    const userAgent = req.headers.get("user-agent") || ""
    const userId = req.headers.get("user-fingerprint") || ""

    console.log(`[DEBUG] Tentativa de Acesso: Header="${authHeader}" | User="${userId}"`)

    if (authHeader !== INTERNAL_KEY) {
      console.log("[ERRO] Chave de segurança incorreta")
      return NextResponse.json({ error: 'Key Mismatch' }, { status: 403 })
    }

    if (!userAgent.includes("Roblox")) {
      console.log("[ERRO] User Agent não é Roblox")
      return NextResponse.json({ error: 'Invalid Agent' }, { status: 403 })
    }

    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const rateLimitKey = `limit:user:${userId}`
    const success = await redis.set(rateLimitKey, '1', { ex: 30, nx: true })

    if (!success) {
      console.log("[INFO] Rate Limit atingido para", userId)
      return NextResponse.json(
        { error: 'Rate Limit' }, 
        { status: 429 }
      )
    }

    const newCount = await redis.incr('script_executions')
    console.log("[SUCESSO] Nova execução computada. Total:", newCount)
    
    return NextResponse.json({ success: true, executions: newCount }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
