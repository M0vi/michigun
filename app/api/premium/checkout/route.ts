import { NextResponse } from 'next/server'
import { env } from '@/env'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { discord, email } = body

    if (!discord || !email) {
      return NextResponse.json({ error: 'Faltando dados obrigatórios' }, { status: 400 })
    }

    if (!env.ABACATEPAY_API_KEY) {
      return NextResponse.json({ error: 'Chave de API do AbacatePay não configurada no servidor' }, { status: 500 })
    }

    const res = await fetch('https://api.abacatepay.com/v2/transparents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.ABACATEPAY_API_KEY}`
      },
      body: JSON.stringify({
        data: {
          amount: 1990, // R$ 19,90 em centavos
          description: "Michigun Premium - Acesso Exclusivo",
          customer: {
            name: discord,
            email
          },
          metadata: {
            // Pode ser usado no Webhook para saber qual usuário foi
            customerEmail: email,
            discordUsername: discord
          }
        }
      })
    })

    const data = await res.json()

    if (!data.success) {
      return NextResponse.json({ error: data.error || 'Erro ao gerar PIX no AbacatePay' }, { status: 400 })
    }

    return NextResponse.json({ data: data.data, success: true })
  } catch (error: any) {
    console.error('AbacatePay Error:', error)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}
