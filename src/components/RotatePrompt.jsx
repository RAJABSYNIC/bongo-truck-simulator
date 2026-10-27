import React, { useState, useEffect } from 'react'

export default function RotatePrompt() {
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      // Kama upana ni mdogo kuliko urefu, simu ipo wima (portrait)
      const portrait = window.innerHeight > window.innerWidth
      setIsPortrait(portrait)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  const handleRequestLandscape = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen()
      }
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape').catch(() => {})
      }
    } catch (e) {
      console.log('Fullscreen/Lock error:', e)
    }
  }

  if (!isPortrait) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'radial-gradient(circle at center, #1e293b 0%, #0b0f19 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Animated Phone Rotate Icon */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '24px',
        background: 'rgba(234, 179, 8, 0.15)',
        border: '2px solid #eab308',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
        marginBottom: '20px',
        animation: 'spinPhone 2s infinite ease-in-out',
        boxShadow: '0 0 30px rgba(234, 179, 8, 0.3)'
      }}>
        📱
      </div>

      <style>{`
        @keyframes spinPhone {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(-90deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1); }
        }
      `}</style>

      <h2 style={{
        fontSize: '22px',
        fontWeight: '900',
        marginBottom: '10px',
        background: 'linear-gradient(135deg, #fef08a, #f59e0b)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Geuza Simu Yako Mlalo
      </h2>

      <p style={{
        color: '#94a3b8',
        fontSize: '14px',
        lineHeight: '1.6',
        maxWidth: '320px',
        marginBottom: '24px'
      }}>
        Mchezo wa <strong>Bongo Truck Simulator</strong> unachezwa ukiwa <strong>Horizontal (Mlalo)</strong> kama ETS 2 halisi ili uone barabara nzuri na usukani wa simu vizuri.
      </p>

      <button
        onClick={handleRequestLandscape}
        style={{
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          border: 'none',
          borderRadius: '12px',
          padding: '12px 24px',
          color: '#ffffff',
          fontWeight: '800',
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(34, 197, 94, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>📺</span>
        <span>Washa Skrini Kamili (Fullscreen)</span>
      </button>
    </div>
  )
}

