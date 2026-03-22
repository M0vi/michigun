export default function NotFound() {
  const C = {
    bg: '#060606',
    border: 'rgba(255,255,255,0.07)',
    textD: 'rgba(184,184,184,0.45)',
    textDD: 'rgba(184,184,184,0.2)',
    white: '#efefef',
  }
  const MONO = 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)'

  return (
    <div style={{
      minHeight: '100dvh',
      background: C.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 22px',
      gap: 16,
    }}>
      <p style={{
        fontSize: 9,
        fontFamily: MONO,
        letterSpacing: '.18em',
        textTransform: 'uppercase',
        color: C.textDD,
      }}>
        404
      </p>
      <h1 style={{
        fontSize: 'clamp(28px,6vw,48px)',
        fontWeight: 800,
        letterSpacing: '-.04em',
        color: C.white,
        lineHeight: 1,
        fontFamily: 'var(--font-display, system-ui, sans-serif)',
      }}>
        Página não encontrada
      </h1>
      <p style={{ fontSize: 13, color: C.textD, maxWidth: 280, textAlign: 'center', lineHeight: 1.6 }}>
        O link que você acessou não existe ou foi removido
      </p>
      <a href="/"
        style={{
          marginTop: 8,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          fontWeight: 500,
          color: C.textD,
          textDecoration: 'none',
          padding: '9px 20px',
          border: `1px solid ${C.border}`,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.03)',
          transition: 'all .2s',
        }}>
        ← Voltar ao início
      </a>
    </div>
  )
}