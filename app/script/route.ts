import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

function getBrazilDateKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
}

// Template HTML idêntico ao da imagem para exibir no navegador
const loaderHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>michigun - Script Loader</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #09090b; color: #ffffff; font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body class="flex items-center justify-center min-h-screen p-4 antialiased">
  <div class="max-w-md w-full bg-[#121214] border border-white/5 rounded-[24px] p-6 md:p-8 flex flex-col items-center gap-6 shadow-2xl">
    
    <div class="w-14 h-14 bg-[#1c1c1f] rounded-2xl flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    </div>

    <div class="text-center flex flex-col gap-1">
      <h1 class="text-2xl font-bold tracking-tight">michigun</h1>
      <p class="text-zinc-500 text-sm">Script Loader</p>
    </div>

    <div class="px-3 py-1 bg-[#091e11] border border-[#103820] rounded-full flex items-center gap-2">
      <div class="w-2 h-2 rounded-full bg-[#10b981]"></div>
      <span class="text-[#10b981] text-xs font-semibold tracking-wide">Online</span>
    </div>

    <div class="w-full bg-[#18181b] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 mt-2">
      <div class="flex items-center gap-2 text-[#fbbf24]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span class="text-sm font-bold">Como Executar</span>
      </div>
      <p class="text-zinc-400 text-sm leading-relaxed">
        Este script só pode ser executado a partir de um executor do Roblox. Copie o código abaixo e cole-o na caixa de script do seu executor.
      </p>
    </div>

    <div class="w-full relative mt-1">
      <div class="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 pr-14 text-[13px] font-mono text-zinc-300 break-all overflow-hidden">
        loadstring(request({Url="https://michigun.xyz/script",Method="GET"}).Body)()
      </div>
      <button onclick="copyScript()" class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors group">
        <svg id="copyIcon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </button>
    </div>

    <div class="w-full flex gap-3 mt-1">
      <a href="/" class="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        Website
      </a>
      <a href="https://discord.gg/pWeJUBabvF" target="_blank" class="flex-1 bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2498-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8745-.617-1.2498a.077.077 0 00-.0788-.0371 19.7363 19.7363 0 00-4.8855 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
        Join Discord
      </a>
    </div>

  </div>

  <script>
    function copyScript() {
      navigator.clipboard.writeText('loadstring(request({Url="https://michigun.xyz/script",Method="GET"}).Body)()');
      const icon = document.getElementById('copyIcon');
      
      // Muda para o ícone de Check (✓)
      icon.innerHTML = '<polyline points="20 6 9 17 4 12" stroke="#10b981"></polyline>';
      
      // Volta ao normal depois de 2 segundos
      setTimeout(() => {
        icon.innerHTML = '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>';
      }, 2000);
    }
  </script>
</body>
</html>
`

export async function GET(req: NextRequest) {
  if (req.method === 'HEAD' || req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 })
  }

  // Verifica se a requisição está pedindo HTML (Ou seja, veio de um Navegador)
  const acceptHeader = req.headers.get('accept') || ''
  const isBrowser = acceptHeader.includes('text/html')

  // Se for o Chrome, Safari, etc, retorna a tela bonita do Loader
  if (isBrowser) {
    return new NextResponse(loaderHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  // Se não for um navegador (for o executor no Roblox), ignora o HTML e roda a lógica original
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
          
          const isNewRequest = await redis.set(dedupeKey, '1', { ex: 30, nx: true })

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

  // Retorna o script como texto simples pro Executor rodar
  return new NextResponse(scriptToReturn, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  })
}
