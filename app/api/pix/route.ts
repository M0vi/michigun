import { NextResponse } from 'next/server';

const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 3;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown_ip';
    const now = Date.now();
    const userRate = rateLimit.get(ip) || { count: 0, timestamp: now };

    if (now - userRate.timestamp > RATE_LIMIT_WINDOW) {
      userRate.count = 1;
      userRate.timestamp = now;
    } else {
      userRate.count++;
      if (userRate.count > MAX_REQUESTS) {
        return NextResponse.json({ error: "Muitas tentativas. Aguarde 1 minuto." }, { status: 429 });
      }
    }
    rateLimit.set(ip, userRate);

    const origin = request.headers.get('origin');
    if (origin && !origin.includes('michigun.xyz') && !origin.includes('localhost')) {
      return NextResponse.json({ error: "Acesso negado. Origem não autorizada." }, { status: 403 });
    }

    const body = await request.json();
    let { discord, email } = body;

    if (!discord || typeof discord !== 'string' || !email || typeof email !== 'string') {
      return NextResponse.json({ error: "Campos inválidos." }, { status: 400 });
    }
    if (discord.length > 50 || email.length > 100) {
      return NextResponse.json({ error: "Entrada de dados muito longa." }, { status: 400 });
    }

    discord = discord.trim();
    email = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    const discordRegex = /^@?[a-zA-Z0-9_.-]{2,32}$/;
    if (!discordRegex.test(discord)) {
      return NextResponse.json({ error: "Usuário do Discord inválido." }, { status: 400 });
    }

    const generateCPF = () => {
      const rnd = (n: number) => Math.round(Math.random() * n);
      const mod = (dividendo: number, divisor: number) => Math.round(dividendo - (Math.floor(dividendo / divisor) * divisor));
      const n = Array(9).fill(0).map(() => rnd(9));
      
      let d1 = n.reduce((total, number, index) => total + (number * (10 - index)), 0);
      d1 = 11 - mod(d1, 11);
      if (d1 >= 10) d1 = 0;
      
      let d2 = d1 * 2 + n.reduce((total, number, index) => total + (number * (11 - index)), 0);
      d2 = 11 - mod(d2, 11);
      if (d2 >= 10) d2 = 0;
      
      return `${n.join('')}${d1}${d2}`;
    };

    const generatePhone = () => {
      const ddds = [11, 21, 31, 41, 51, 61, 71, 81, 91];
      const ddd = ddds[Math.floor(Math.random() * ddds.length)];
      const random8 = Math.floor(Math.random() * 90000000) + 10000000;
      return `${ddd}9${random8}`;
    };

    const response = await fetch('https://app.amplopay.com/api/v1/gateway/pix/receive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-public-key': process.env.AMPLOPAY_PUBLIC_KEY as string,
        'x-secret-key': process.env.AMPLOPAY_SECRET_KEY as string
      },
      body: JSON.stringify({
        identifier: `michigun-premium-${Date.now()}`,
        amount: 19.97,
        client: { 
          name: discord, 
          email: email,
          phone: generatePhone(), 
          document: generateCPF()
        }
      })
    });
    const data = await response.json();
    
    if (!response.ok) {
      console.error("AmploPay Error:", data);
      const errorMessage = data.message || "Falha na comunicação com a AmploPay.";
      const errorField = data.field ? ` (Campo: ${data.field})` : "";
      return NextResponse.json({ error: errorMessage + errorField }, { status: response.status });
    }

    let qrCodeUrl = data.pix?.base64 || data.pix?.image || "";
    if (qrCodeUrl && !qrCodeUrl.startsWith("http") && !qrCodeUrl.startsWith("data:image")) {
      qrCodeUrl = `data:image/png;base64,${qrCodeUrl}`;
    }

    return NextResponse.json({ 
      qrCode: qrCodeUrl, 
      copyPaste: data.pix?.code || "" 
    });

  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor ao gerar PIX." }, { status: 500 });
  }
}
