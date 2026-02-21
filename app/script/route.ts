import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

function getBrazilDateKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
}

const loaderHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>michigun - Script Loader</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #09090b; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #111113; border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 32px 24px; width: 100%; max-width: 400px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
    .logo { width: 56px; height: 56px; background: #1c1c1f; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
    .logo svg { width: 28px; height: 28px; color: #fff; }
    .title-container { text-align: center; }
    .title { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .subtitle { font-size: 14px; color: #a1a1aa; }
    .status { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); color: #10b981; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
    .status-dot { width: 6px; height: 6px; background: #10b981; border-radius: 50%; }
    .warning-box { width: 100%; background: #161618; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
    .warning-title { display: flex; align-items: center; gap: 8px; color: #fbbf24; font-size: 14px; font-weight: 600; }
    .warning-title svg { width: 16px; height: 16px; }
    .warning-text { color: #a1a1aa; font-size: 13px; line-height: 1.5; }
    .code-box { width: 100%; background: #1c1c1f; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 14px 48px 14px 14px; position: relative; font-family: monospace; font-size: 12px; color: #d4d4d8; overflow-wrap: break-word; }
    .copy-btn { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: #27272a; border: 1px solid rgba(255,255,255,0.05); color: #a1a1aa; cursor: pointer; padding: 8px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
    .copy-btn:hover { background: #3f3f46; color: #fff; }
    .copy-btn svg { width: 16px; height: 16px; }
    .actions { display: flex; gap: 12px; width: 100%; margin-top: 4px; }
    .btn { flex: 1; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; border: none; cursor: pointer; }
    .btn-web { background: #1c1c1f; color: #fff; border: 1px solid rgba(255,255,255,0.05); }
    .btn-web:hover { background: #27272a; }
    .btn-discord { background: #5865F2; color: #fff; }
    .btn-discord:hover { background: #4752C4; }
    .btn svg { width: 18px; height: 18px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    </div>
    <div class="title-container">
      <div class="title">michigun</div>
      <div class="subtitle">Script Loader</div>
    </div>
    <div class="status">
      <div class="status-dot"></div>
      Online
    </div>
    
    <div class="warning-box">
      <div class="warning-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Como Executar
      </div>
      <div class="warning-text">
        Este script só pode ser executado através de um executor do Roblox. Copie o código abaixo e cole na caixa de script do seu executor.
      </div>
    </div>

    <div class="code-box">
      <span id="script-code">loadstring(request({Url="https://michigun.xyz/script",Method="GET"}).Body)()</span>
      <button class="copy-btn" onclick="copyScript()" id="copy-btn">
        <svg id="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <svg id="check-icon" style="display:none; color: #10b981;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </button>
    </div>

    <div class="actions">
      <a href="/" class="btn btn-web">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        Website
      </a>
      <a href="https://discord.gg/pWeJUBabvF" target="_blank" class="btn btn-discord">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2498-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8745-.617-1.2498a.077.077 0 00-.0788-.0371 19.7363 19.7363 0 00-4.8855 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
        Join Discord
      </a>
    </div>
  </div>

  <script>
    function copyScript() {
      const text = document.getElementById('script-code').innerText;
      navigator.clipboard.writeText(text).then(() => {
        document.getElementById('copy-icon').style.display = 'none';
        document.getElementById('check-icon').style.display = 'block';
        setTimeout(() => {
          document.getElementById('copy-icon').style.display = 'block';
          document.getElementById('check-icon').style.display = 'none';
        }, 2000);
      });
    }
  </script>
</body>
</html>`

export async function GET(req: NextRequest) {
  if (req.method === 'HEAD' || req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 })
  }
  
  const acceptHeader = req.headers.get('accept') || ''
  const isBrowser = acceptHeader.includes('text/html') && !req.headers.get('user-agent')?.includes('Roblox')
  
  if (isBrowser) {
    return new NextResponse(loaderHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
      },
    })
  }
  
  const scriptToReturn = `loadstring(game:HttpGet("https://api.jnkie.com/api/v1/luascripts/public/66b35878a8bf3053747f543e17f7cdd565caa7d0bf5712a768ce5a874eb74c9e/download"))()`
  
  try {
    const userId = req.headers.get('x-user-id')
    const placeId = req.headers.get('x-place-id')
    const timestamp = req.headers.get('x-timestamp')
    const signature = req.headers.get('x-signature')
    const mode = req.headers.get('x-mode')
    const secret = process.env.SCRIPT_SECRET
    
    if (userId && placeId && timestamp && signature && secret) {
      const now = Math.floor(Date.now() / 1000)
      const reqTime = Number(timestamp)
      
      if (!isNaN(reqTime) && Math.abs(now - reqTime) <= 60) {
        const dataString = `${userId}${placeId}${timestamp}${secret}`
        const expectedSignature = crypto.createHash('sha256').update(dataString).digest('hex')
        
        if (signature === expectedSignature) {
          const dedupeKey = `dedupe:${signature}`
          const isNewRequest = await redis.set(dedupeKey, '1', { ex: 90, nx: true })
          
          if (isNewRequest) {
            const dateKey = `daily_executions:${getBrazilDateKey()}`
            await Promise.all([
              redis.incr('script_executions'),
              redis.incr(dateKey)
            ])
            redis.expire(dateKey, 172800)
          }
          
          if (mode === 'check') {
            return new NextResponse('OK', { status: 200 })
          }
          
        } else {
          return new NextResponse('print("Acesso negado: Assinatura invalida.")', { status: 403 })
        }
      } else {
        return new NextResponse('print("Acesso negado: Requisicao expirada.")', { status: 403 })
      }
    } else {
      return new NextResponse(`loadstring(request({Url="https://michigun.xyz/script",Method="GET"}).Body)()`, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      })
    }
  } catch (error) {
    return new NextResponse('print("Erro interno no servidor.")', { status: 500 })
  }
  
  return new NextResponse(scriptToReturn, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store'
    },
  })
}