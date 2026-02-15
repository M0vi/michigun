import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ filename: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { filename } = await params

    if (!filename || !filename.endsWith('.lua') || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse(null, { status: 404 })
    }

    const filePath = path.join(process.cwd(), 'scripts', filename)

    if (!fs.existsSync(filePath)) {
      return new NextResponse(null, { status: 404 })
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')

    return new NextResponse(fileContents, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff'
      },
    })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}