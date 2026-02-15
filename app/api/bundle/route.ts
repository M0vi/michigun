import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
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

    const scriptsDir = path.join(process.cwd(), 'scripts')

    if (!fs.existsSync(scriptsDir)) {
      return new NextResponse(null, { status: 404 })
    }

    const files = fs.readdirSync(scriptsDir)
    
    const luaFiles = files.filter(file => file.endsWith('.lua'))

    luaFiles.sort()

    let fullBundle = ''

    for (const file of luaFiles) {
      const filePath = path.join(scriptsDir, file)
      const content = fs.readFileSync(filePath, 'utf8')
      
      fullBundle += `\n\n-- [[ Inicio: ${file} ]] --\n\n`
      fullBundle += content
      fullBundle += `\n\n-- [[ Fim: ${file} ]] --\n\n`
    }

    return new NextResponse(fullBundle, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff'
      },
    })
  } catch {
    return new NextResponse(null, { status: 500 })
  }
}
