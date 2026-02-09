import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

function getBrazilDateKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
}

export async function GET() {
  // 1. INCREMENTA O CONTADOR (Usando as mesmas chaves do outro arquivo)
  try {
    const dateKey = `daily_executions:${getBrazilDateKey()}`
    
    await Promise.all([
      redis.incr('script_executions'), // Total
      redis.incr(dateKey)              // Diário
    ])
    redis.expire(dateKey, 172800)
  } catch (err) {
    console.error("Erro no Redis:", err)
  }

  // 2. RETORNA O CÓDIGO LUA (Texto Puro)
  // Coloque o link RAW do seu script gigante aqui embaixo
  const luaCode = `loadstring(game:HttpGet("https://api.jnkie.com/api/v1/luascripts/public/66b35878a8bf3053747f543e17f7cdd565caa7d0bf5712a768ce5a874eb74c9e/download"))()`
  
  return new NextResponse(luaCode, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
