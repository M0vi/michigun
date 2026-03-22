// [CHANGE 2 - Performance] Proxy para api.lanyard.rest
// Centraliza as requisições no servidor, adiciona cache e evita CORS no cliente.
import { NextRequest, NextResponse } from 'next/server'

// Cache de 8 segundos — Lanyard atualiza ~10s, evita hammering
export const revalidate = 8

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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