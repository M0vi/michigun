export default function Loading() {
  const C = {
    bg: '#060606',
    card: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.07)',
    textDD: 'rgba(184,184,184,0.2)',
  }

  const Skeleton = ({ w, h }: { w: string; h: number }) => (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 6,
        background: C.card,
        border: `1px solid ${C.border}`,
        animation: 'pulse 1.8s ease-in-out infinite',
      }}
    />
  )

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: C.bg,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <main
        style={{
          flex: 1,
          padding: '56px 22px 0',
          maxWidth: 780,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <Skeleton w="36px" h={36} />
          <Skeleton w="110px" h={14} />
          <div style={{ marginLeft: 'auto' }}>
            <Skeleton w="90px" h={32} />
          </div>
        </div>

        {}
        <Skeleton w="70%" h={64} />
        <Skeleton w="50%" h={14} />
        <Skeleton w="40%" h={14} />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Skeleton w="130px" h={40} />
          <Skeleton w="100px" h={40} />
        </div>

        {}
        <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton w="60px" h={10} />
          <Skeleton w="260px" h={36} />
          <Skeleton w="100%" h={52} />
          <div style={{ display: 'flex', gap: 6 }}>
            <Skeleton w="100%" h={40} />
            <Skeleton w="44px" h={40} />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '18px 16px', background: 'rgba(255,255,255,0.015)' }}>
              <Skeleton w="80px" h={10} />
              <div style={{ marginTop: 12 }}>
                <Skeleton w="60px" h={28} />
              </div>
            </div>
            <div style={{ padding: '18px 16px' }}>
              <Skeleton w="80px" h={10} />
              <div style={{ marginTop: 12 }}>
                <Skeleton w="60px" h={28} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}