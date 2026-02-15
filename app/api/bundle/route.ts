import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
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
      
      fullBundle += `\n\n-- [[ START OF FILE: ${file} ]] --\n\n`
      fullBundle += content
      fullBundle += `\n\n-- [[ END OF FILE: ${file} ]] --\n\n`
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