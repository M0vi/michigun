import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { discord, email } = body;

    if (!discord || typeof discord !== 'string' || !email || typeof email !== 'string') {
      return NextResponse.json({ error: "Campos inválidos." }, { status: 400 });
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

    // Integração AmploPay
    const response = await fetch('https://app.amplopay.com/api/v1/gateway/pix/receive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-public-key': process.env.AMPLOPAY_PUBLIC_KEY as string,
        'x-secret-key': process.env.AMPLOPAY_SECRET_KEY as string
      },
      body: JSON.stringify({
        identifier: `michigun-premium-${Date.now()}`,
        amount: 19.90,
        client: { name: discord, email }
      })
    });
    const data = await response.json();
    return NextResponse.json({ qrCode: data.pix.base64, copyPaste: data.pix.code });

  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor ao gerar PIX." }, { status: 500 });
  }
}
