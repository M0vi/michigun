import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const scriptContent = 'loadstring(game:HttpGet("https://gitlab.com/sanctuaryangels/michigun.xyz/-/raw/main/michigun.lua"))()'
  
  return new NextResponse(scriptContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache'
    }
  })
}