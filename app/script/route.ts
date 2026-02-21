import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const redis = Redis.fromEnv()

function getBrazilDateKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
}

const loaderHtml = `
<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>michigun - Script Loader</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #09090b; color: #ffffff; }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4 antialiased bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#09090b] to-[#09090b]">
  
  <main class="w-full max-w-[460px] bg-[#121214]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 flex flex-col items-center shadow-2xl shadow-black/50 relative overflow-hidden">
    
    <div class="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent opacity-40 pointer-events-none"></div>

    <div class="flex flex-col items-center gap-5 z-10">
      <div class="w-16 h-16 bg-gradient-to-br from-zinc-800 to-[#121214] rounded-2xl flex items-center justify-center shadow-inner border border-white/10 relative group overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 text-zinc-200 relative z-10">
          <path fill-rule="evenodd" d="M2.25 6a3 3 0 013-3h13.5a3 3 0 013 3v12a3 3 0 01-3 3H5.25a3 3 0 01-3-3V6zm3.97.97a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06zm4.28 4.28a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="text-center flex flex-col gap-1">
        <h1 class="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
          michigun
        </h1>
        <p class="text-zinc-500 font-medium text-sm">Script Loader</p>
      </div>
      <div class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-emerald-400 text-xs font-bold uppercase tracking-wider">Sistema Online</span>
      </div>
    </div>

    <div class="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-8 opacity-60"></div>

    <div class="w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex flex-col gap-3 z-10 relative overflow-hidden">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="absolute -right-4 -bottom-4 w-24 h-24 text-amber-500/10 pointer-events-none transform rotate-12">
        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 01-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
      </svg>
      <div class="flex items-center gap-2 text-amber-500 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
        </svg>
        <h3 class="text-sm">Atenção Necessária</h3>
      </div>
      <p class="text-zinc-400 text-sm leading-relaxed">
        Este script deve ser executado exclusivamente dentro de um <strong>executor do Roblox</strong>. Ele não funcionará diretamente no navegador.
      </p>
    </div>

    <div class="w-full relative group mt-6 z-10">
      <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
      <div class="relative w-full bg-[#0c0c0d] border border-white/10 rounded-xl p-4 pr-14 font-mono text-[13px] text-zinc-300 break-all shadow-sm overflow-hidden">
        <code id="script-code" style="white-space: pre-wrap;">loadstring(request({Url="https://michigun.xyz/script",Method="GET"}).Body)()</code>
        <div class="absolute inset-y-0 right-12 w-8 bg-gradient-to-l from-[#0c0c0d] to-transparent pointer-events-none"></div>
      </div>
      <button onclick="copyScript()" class="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#121214] border border-white/10 hover:bg-[#1c1c1f] text-zinc-400 hover:text-white rounded-lg transition-all duration-200 active:scale-95 group/btn" aria-label="Copiar Script">
        <svg id="copy-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 transition-transform group-hover/btn:scale-110">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
        <svg id="check-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-emerald-400 hidden scale-75 transition-all duration-200">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </button>
    </div>

    <div class="w-full grid grid-cols-2 gap-3 mt-8 z-10">
      <a href="/" class="flex items-center justify-center gap-2.5 p-3 h-12 rounded-xl bg-[#121214] border border-white/10 hover:bg-[#1c1c1f] hover:border-white/20 text-sm text-white font-semibold transition-all duration-200 active:scale-[0.98] group">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors">
          <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clip-rule="evenodd" />
        </svg>
        Voltar ao Site
      </a>
      <a href="https://discord.gg/pWeJUBabvF" target="_blank" class="flex items-center justify-center gap-2.5 p-3 h-12 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-sm text-white font-semibold transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#5865F2]/20 group">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="transition-transform group-hover:scale-110">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2498-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8745-.617-1.2498a.077.077 0 00-.0788-.0371 19.7363 19.7363 0 00-4.8855 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
        </svg>
        Entrar no Discord
      </a>
    </div>

    <div class="mt-8 text-xs text-zinc-600 font-medium z-10 flex items-center gap-2">
      <span>© 2026 michigun.xyz</span>
      <span class="w-0.5 h-0.5 rounded-full bg-zinc-600"></span>
      <span>Todos os direitos reservados.</span>
    </div>
  </main>

  <script>
    function copyScript() {
      const scriptText = document.getElementById('script-code').innerText;
      navigator.clipboard.writeText(scriptText).then(() => {
        const copyIcon = document.getElementById('copy-icon');
        const checkIcon = document.getElementById('check-icon');
        const btn = copyIcon.parentElement;
        
        copyIcon.classList.add('hidden', 'scale-75');
        checkIcon.classList.remove('hidden', 'scale-75');
        checkIcon.classList.add('scale-100');
        btn.classList.add('bg-[#1c1c1f]', 'text-white');

        setTimeout(() => {
          checkIcon.classList.remove('scale-100');
          checkIcon.classList.add('hidden', 'scale-75');
          copyIcon.classList.remove('hidden', 'scale-75');
          copyIcon.classList.add('scale-100');
          btn.classList.remove('bg-[#1c1c1f]', 'text-white');
        }, 2000);
      }).catch(err => {
        console.error('Erro ao copiar:', err);
        alert('Não foi possível copiar automaticamente. Por favor, selecione e copie manualmente.');
      });
    }
  </script>
</body>
</html>
`

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
            return new NextResponse('print("Acesso negado: Assinatura inválida.")', { status: 403 })
        }
      } else {
          return new NextResponse('print("Acesso negado: Requisição expirada.")', { status: 403 })
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