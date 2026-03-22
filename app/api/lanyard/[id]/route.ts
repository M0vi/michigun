import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 8

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
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