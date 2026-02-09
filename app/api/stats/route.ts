import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

// Helper para pegar a data atual em Brasília (YYYY-MM-DD)
function getBrazilDateKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
}

export async function GET() {
  // Coloque o código do seu script Lua dentro desta string (usando crase ` `)
  const luaScript = `
    loadstring(request({Url="https://michigun.xyz/script",Method="GET"}).Body)()
  `
  
  return new NextResponse(luaScript, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    
    if (!body) {
      return NextResponse.json({ error: 'Body vazio' }, { status: 400 })
    }
    
    const { userId, timestamp, signature } = body
    const envKey = process.env.API_KEY
    
    // 1. Validação de Dados
    if (!userId || !timestamp || !signature) {
      return NextResponse.json({ error: 'Dados faltando' }, { status: 400 })
    }
    
    // 2. Validação de Tempo
    const now = Math.floor(Date.now() / 1000)
    const reqTime = Number(timestamp)
    
    if (now - reqTime > 60 || reqTime > now + 5) {
      return NextResponse.json({ error: 'Request expirada' }, { status: 403 })
    }
    
    // 3. Validação de Integridade (HMAC)
    const dataString = `${userId}${timestamp}${envKey}`
    const expectedSignature = crypto.createHash('sha256').update(dataString).digest('hex')
    
    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Assinatura inválida' }, { status: 403 })
    }
    
    // 4. Rate Limit
    const rateLimitKey = `limit:user:${userId}`
    const allowed = await redis.set(rateLimitKey, '1', { ex: 30, nx: true })
    
    if (!allowed) {
      return NextResponse.json({ error: 'Rate Limit' }, { status: 429 })
    }
    
    // 5. Incremento (Total e Diário)
    const dateKey = `daily_executions:${getBrazilDateKey()}`
    
    const [newTotal, newDaily] = await Promise.all([
      redis.incr('script_executions'), // Incrementa Total
      redis.incr(dateKey) // Incrementa Diário
    ])
    
    // Expira a chave diária em 48h para limpar o banco
    redis.expire(dateKey, 172800)
    
    return NextResponse.json({
      success: true,
      executions: newTotal,
      daily: newDaily
    }, { status: 200 })
    
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
