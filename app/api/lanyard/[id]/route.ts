import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 8

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  // Segurança: Garante que o ID do Discord tenha apenas números (evita SSRF e injection)
  if (!/^\d{17,20}$/.test(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${id}`, {
      next: { revalidate: 8 },
    })
    const data = await res.json()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 's-maxage=8, stale-while-revalidate=4' },
    })
  } catch {
    return NextResponse.json({ success: false }, { status: 502 })
  }
}