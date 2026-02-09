import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {

  const luaLoader = `loadstring(request({Url="https://michigun.xyz/script",Method="GET"}).Body)()`
  
  return new NextResponse(luaLoader, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
