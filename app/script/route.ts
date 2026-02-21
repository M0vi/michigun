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
  <title>Acesso restrito</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      background-color: #000; 
      color: #ededed; 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      min-height: 100vh; 
      background-image: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 50%);
    }
    .container { width: 100%; max-width: 440px; padding: 32px; }
    
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      border-bottom: 1px solid rgba(255,255,255,0.05); 
      padding-bottom: 20px; 
      margin-bottom: 32px; 
    }
    .brand { font-size: 20px; font-weight: 700; letter-spacing: -0.04em; }
    .brand span { color: #52525b; }
    
    .status { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      font-size: 11px; 
      text-transform: uppercase; 
      letter-spacing: 0.1em; 
      color: #71717a; 
      font-weight: 600; 
    }
    .dot { width: 6px; height: 6px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px rgba(16,185,129,0.5); }
    
    .content h1 { font-size: 24px; font-weight: 600; margin-bottom: 12px; letter-spacing: -0.02em; }
    .content p { color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 32px; }
    
    .code-wrapper { margin-bottom: 24px; }
    .code-header { 
      background: #0a0a0a; 
      border: 1px solid rgba(255,255,255,0.05); 
      border-bottom: none; 
      border-radius: 12px 12px 0 0; 
      padding: 12px 16px; 
      display: flex; 
      gap: 6px; 
    }
    .mac-dot { width: 10px; height: 10px; border-radius: 50%; background: #27272a; }
    .code-block { 
      background: #050505; 
      border: 1px solid rgba(255,255,255,0.05); 
      border-radius: 0 0 12px 12px; 
      padding: 20px; 
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; 
      font-size: 13px; 
      line-height: 1.5;
      overflow-wrap: break-word;
    }
    
    /* Syntax Highlighting */
    .kw { color: #ec4899; } /* Pink */
    .fn { color: #60a5fa; } /* Blue */
    .st { color: #4ade80; } /* Green */
    .vr { color: #d4d4d8; } /* Zinc */

    .copy-btn { 
      width: 100%; 
      background: #fff; 
      color: #000; 
      border: none; 
      padding: 14px; 
      border-radius: 12px; 
      font-weight: 600; 
      font-size: 14px; 
      cursor: pointer; 
      transition: all 0.2s; 
      margin-bottom: 16px; 
    }
    .copy-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(255,255,255,0.1); }
    .copy-btn.success { background: #10b981; color: #fff; }
    
    .links { display: flex; gap: 12px; }
    .link-btn { 
      flex: 1; 
      padding: 12px; 
      background: transparent; 
      border: 1px solid rgba(255,255,255,0.05); 
      color: #a1a1aa; 
      border-radius: 12px; 
      text-align: center; 
      font-size: 13px; 
      font-weight: 500;
      text-decoration: none; 
      transition: 0.2s; 
    }
    .link-btn:hover { background: rgba(255,255,255,0.02); color: #fff; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">michigun<span>.xyz</span></div>
      <div class="status"><div class="dot"></div> Loader</div>
    </div>
    
    <div class="content">
      <h1>Restrito</h1>
      <p>Copie o código abaixo e execute.</p>
      
      <div class="code-wrapper">
        <div class="code-header">
          <div class="mac-dot"></div>
          <div class="mac-dot"></div>
          <div class="mac-dot"></div>
        </div>
        <div class="code-block" id="script-code">
          <span class="kw">loadstring</span>(<span class="fn">request</span>({<span class="vr">Url</span>=<span class="st">"https://michigun.xyz/script"</span>,<span class="vr">Method</span>=<span class="st">"GET"</span>}).<span class="fn">Body</span>)()
        </div>
      </div>

      <button class="copy-btn" id="copy-btn" onclick="copyScript()">
        Copiar
      </button>
      
      <div class="links">
        <a href="/" class="link-btn">Voltar</a>
        <a href="https://discord.gg/pWeJUBabvF" target="_blank" class="link-btn">Discord</a>
      </div>
    </div>
  </div>

  <script>
    function copyScript() {
      const text = document.getElementById('script-code').innerText;
      const btn = document.getElementById('copy-btn');
      
      navigator.clipboard.writeText(text).then(() => {
        btn.innerText = 'Copiado!';
        btn.classList.add('success');
        
        setTimeout(() => {
          btn.innerText = 'Copiar';
          btn.classList.remove('success');
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

  const userAgent = req.headers.get('user-agent') || ''
  const acceptHeader = req.headers.get('accept') || ''
  
  const isRobloxExecutor = /roblox|krnl|synapse|fluxus|hydrogen|electron|delta|oxygen|codex|arceus/i.test(userAgent)
  const isBrowser = acceptHeader.includes('text/html') && userAgent.includes('Mozilla') && !isRobloxExecutor

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
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
  
  return new NextResponse(scriptToReturn, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store'
    },
  })
}
