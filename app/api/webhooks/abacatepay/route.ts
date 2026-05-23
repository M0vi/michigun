import { NextResponse } from 'next/server'
import { env } from '@/env'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    
    // Header comum em webhooks, verifique na documentação do AbacatePay se o nome é exatamente esse.
    const signature = req.headers.get('x-abacatepay-signature')

    // Verificação de segurança HMAC se o secret estiver configurado
    if (env.ABACATEPAY_WEBHOOK_SECRET && signature) {
      const hash = crypto
        .createHmac('sha256', env.ABACATEPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex')

      if (hash !== signature) {
        console.warn('Webhook AbacatePay: Assinatura inválida')
        return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 })
      }
    }

    const payload = JSON.parse(rawBody)
    const { event, data } = payload

    console.log(`[AbacatePay Webhook] Recebido evento: ${event}`)

    if (event === 'transparent.completed' || event === 'checkout.completed') {
      const metadata = data?.metadata
      const customerEmail = metadata?.customerEmail
      const discordUsername = metadata?.discordUsername || data?.customer?.name || 'Desconhecido'

      console.log(`[AbacatePay Webhook] Pagamento confirmado para: ${customerEmail} (Discord: ${discordUsername})`)
      
      // Enviar notificação para o Discord
      const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1507775647500599439/jn_P_17Xk1jHSAm8UrlpuWAMtbfUTU9XeTFyuGstMiWUeruUcmD8KWa4AXoM6od_CEke'
      
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '🎉 Novo Pagamento Premium Recebido!',
            color: 0x10b981, // Verde
            fields: [
              { name: 'Discord', value: discordUsername, inline: true },
              { name: 'Email', value: customerEmail || 'Não informado', inline: true },
              { name: 'Valor', value: 'R$ 19,90', inline: true }
            ],
            footer: {
              text: 'AbacatePay - michigun.xyz'
            },
            timestamp: new Date().toISOString()
          }]
        })
      }).catch(err => console.error('Erro ao enviar webhook do Discord', err))
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[AbacatePay Webhook Error]', error)
    return NextResponse.json({ error: 'Erro ao processar webhook' }, { status: 500 })
  }
}
