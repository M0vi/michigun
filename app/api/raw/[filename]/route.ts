import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ filename: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const headers = request.headers
    const userAgent = headers.get('user-agent') || ''
    const secFetchMode = headers.get('sec-fetch-mode')
    const secFetchDest = headers.get('sec-fetch-dest')
    const acceptLanguage = headers.get('accept-language')

    if (
      userAgent.includes('Mozilla') || 
      userAgent.includes('Chrome') || 
      userAgent.includes('Safari') || 
      userAgent.includes('Edge') ||
      userAgent.includes('Opera') ||
      secFetchMode === 'navigate' ||
      secFetchMode === 'cors' ||
      secFetchDest === 'document' ||
      acceptLanguage?.includes('text/html')
    ) {
      return new NextResponse(null, { status: 404 })
    }

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
