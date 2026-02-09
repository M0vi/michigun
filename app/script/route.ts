import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {

  const luaLoader = `loadstring(game:HttpGet("https://api.jnkie.com/api/v1/luascripts/public/66b35878a8bf3053747f543e17f7cdd565caa7d0bf5712a768ce5a874eb74c9e/download"))()`
  
  return new NextResponse(luaLoader, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
