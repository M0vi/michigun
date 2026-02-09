import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

function getBrazilDateKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
}

export async function GET() {
  const dateKey = `daily_executions:${getBrazilDateKey()}`
  
  const [total, daily] = await Promise.all([
    redis.get<number>('script_executions'),
    redis.get<number>(dateKey)
  ])
  
  return NextResponse.json({
    executions: total || 0,
    daily: daily || 0
  }, { status: 200 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    
    if (!body) return NextResponse.json({ error: 'Body vazio' }, { status: 400 })
    
    const envKey = process.env.API_KEY || ''
    const { userId, timestamp, signature } = body
    
    if (!userId || !timestamp || !signature) {
      return NextResponse.json({ error: 'Dados faltando' }, { status: 400 })
    }
    
    const now = Math.floor(Date.now() / 1000)
    const reqTime = Number(timestamp)
    
    if (now - reqTime > 60 || reqTime > now + 5) {
      return NextResponse.json({ error: 'Request expirada' }, { status: 403 })
    }
    
    const dataString = `${userId}${timestamp}${envKey}`
    const expectedSignature = crypto.createHash('sha256').update(dataString).digest('hex')
    
    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Assinatura inválida' }, { status: 403 })
    }
    
    const rateLimitKey = `limit:user:${userId}`
    const allowed = await redis.set(rateLimitKey, '1', { ex: 30, nx: true })
    
    if (!allowed) {
      return NextResponse.json({ error: 'Rate Limit' }, { status: 429 })
    }
    
    const dateKey = `daily_executions:${getBrazilDateKey()}`
    
    const [newTotal, newDaily] = await Promise.all([
      redis.incr('script_executions'),
      redis.incr(dateKey)
    ])
    
    redis.expire(dateKey, 172800)
    
    return NextResponse.json({
      success: true,
      executions: newTotal,
      daily: newDaily
    }, { status: 200 })
    
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}