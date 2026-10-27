import React from 'react'

export default function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '24px',
      textAlign: 'center',
      background: 'radial-gradient(circle at 50% 20%, #1e293b 0%, #0b0f19 80%)'
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '36px 28px',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🚛 🚌</div>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '800',
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px'
        }}>
          Truck & Bus Simulator
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
          Mfumo umeunganishwa kikamilifu kwenye <strong>Vercel</strong> na uko tayari kwa ajili ya mchezo wa 3D wa simu.
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(34, 197, 94, 0.15)',
          color: '#4ade80',
          padding: '8px 16px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '28px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            display: 'inline-block',
            boxShadow: '0 0 10px #22c55e'
          }}></span>
          Live Vercel Ready
        </div>

        <div style={{
          padding: '16px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '13px',
          color: '#cbd5e1',
          textAlign: 'left'
        }}>
          <div style={{ fontWeight: '700', marginBottom: '8px', color: '#f8fafc' }}>🎮 Hatua Inayofuata:</div>
          <div>1. Unganisha na Vercel sasa</div>
          <div>2. Anza kuendesha lori na basi la 3D!</div>
        </div>
      </div>
    </div>
  )
}

