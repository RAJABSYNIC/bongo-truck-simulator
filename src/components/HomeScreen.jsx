import React, { useState } from 'react'

export default function HomeScreen({
  onPlay,
  driver,
  setDriver,
  vehicleType,
  setVehicleType
}) {
  const [activeModal, setActiveModal] = useState(null) // 'karakana', 'soko', 'ramani', 'dereva', 'misingi', 'kuhusu', 'rewards'
  const [customName, setCustomName] = useState(driver.name || 'Dereva Rajab')

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.5) 100%), url('/images/home-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '16px 24px',
      boxSizing: 'border-box',
      userSelect: 'none'
    }}>
      {/* ================= BAR YA JUU ================= */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        zIndex: 10
      }}>
        {/* KUSHOTO: TITLE YA BONGO TRUCK SIMULATOR */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '3px',
            color: '#f8fafc',
            textTransform: 'uppercase',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}>
            KARIBU SANA!
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: '900',
            lineHeight: '1.05',
            margin: '4px 0 2px 0',
            textTransform: 'uppercase',
            fontFamily: '"Impact", "Arial Black", sans-serif',
            background: 'linear-gradient(180deg, #ffea79 0%, #ff9800 50%, #e65100 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(2px 2px 0 #000) drop-shadow(-2px -2px 0 #000) drop-shadow(2px -2px 0 #000) drop-shadow(-2px 2px 0 #000) drop-shadow(0 6px 12px rgba(0,0,0,0.8))',
            letterSpacing: '1px'
          }}>
            BONGO TRUCK<br />SIMULATOR
          </h1>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#f1f5f9',
            fontStyle: 'italic',
            textShadow: '0 2px 6px rgba(0,0,0,0.9)',
            letterSpacing: '0.5px'
          }}>
            Safari za Kitanzania
          </div>
        </div>

        {/* KULIA JUU: SETTINGS, PROFILE, MONEY, SHOP */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {/* Mipangilio */}
          <button
            onClick={() => setActiveModal('misingi')}
            style={topIconBtnStyle}
            title="Misingi"
          >
            ⚙️
          </button>

          {/* Profile */}
          <button
            onClick={() => setActiveModal('dereva')}
            style={topIconBtnStyle}
            title="Dereva"
          >
            👤
          </button>

          {/* Pesa (TZS Pill) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1.5px solid rgba(234, 179, 8, 0.4)',
            borderRadius: '10px',
            padding: '6px 14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #facc15, #ca8a04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: '900',
              color: '#422006',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
            }}>
              TZS
            </div>
            <div style={{
              color: '#fef08a',
              fontWeight: '900',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}>
              {(driver.money || 50000).toLocaleString()}
            </div>
          </div>

          {/* Cart / Duka */}
          <button
            onClick={() => setActiveModal('soko')}
            style={topIconBtnStyle}
            title="Soko la Lori"
          >
            🛒
          </button>
        </div>
      </div>

      {/* ================= MENU YA KUSHOTO ================= */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        maxWidth: '220px',
        width: '100%',
        margin: 'auto 0',
        zIndex: 10
      }}>
        {/* CHEZA BUTTON (Green Neon Border) */}
        <button
          onClick={onPlay}
          style={{
            ...menuBtnStyle,
            border: '2px solid #22c55e',
            background: 'rgba(20, 20, 20, 0.88)',
            boxShadow: '0 0 16px rgba(34, 197, 94, 0.45)',
            color: '#fef08a'
          }}
        >
          <span style={{ fontSize: '20px' }}>🚚</span>
          <span style={{ fontWeight: '900', fontSize: '16px', letterSpacing: '1px' }}>CHEZA</span>
        </button>

        {/* KARAKANA */}
        <button
          onClick={() => setActiveModal('karakana')}
          style={menuBtnStyle}
        >
          <span style={{ fontSize: '18px' }}>🔧</span>
          <span>KARAKANA</span>
        </button>

        {/* SOKO LA LORI */}
        <button
          onClick={() => setActiveModal('soko')}
          style={menuBtnStyle}
        >
          <span style={{ fontSize: '18px' }}>🏪</span>
          <span>SOKO LA LORI</span>
        </button>

        {/* RAMANI */}
        <button
          onClick={() => setActiveModal('ramani')}
          style={menuBtnStyle}
        >
          <span style={{ fontSize: '18px' }}>🗺️</span>
          <span>RAMANI</span>
        </button>

        {/* CHAGUA DEREVA */}
        <button
          onClick={() => setActiveModal('dereva')}
          style={{ ...menuBtnStyle, color: '#fef08a' }}
        >
          <span style={{ fontSize: '18px' }}>👤</span>
          <span>CHAGUA DEREVA</span>
        </button>

        {/* MISINGI */}
        <button
          onClick={() => setActiveModal('misingi')}
          style={menuBtnStyle}
        >
          <span style={{ fontSize: '18px' }}>⚙️</span>
          <span>MISINGI</span>
        </button>

        {/* KUHUSU */}
        <button
          onClick={() => setActiveModal('kuhusu')}
          style={menuBtnStyle}
        >
          <span style={{ fontSize: '18px' }}>ℹ️</span>
          <span>KUHUSU</span>
        </button>

        {/* ONDOKA */}
        <button
          onClick={() => {
            if (confirm('Je, una uhakika unataka kuondoka?')) {
              window.close()
            }
          }}
          style={{
            ...menuBtnStyle,
            color: '#ef4444'
          }}
        >
          <span style={{ fontSize: '18px' }}>⏻</span>
          <span>ONDOKA</span>
        </button>
      </div>

      {/* ================= BAR YA CHINI ================= */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
        zIndex: 10
      }}>
        {/* CHINI KUSHOTO: DAILY REWARDS & COMMUNITY */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={() => setActiveModal('rewards')}
            style={bottomSubBtnStyle}
          >
            <span style={{ fontSize: '18px' }}>📅</span>
            <span>Daily Rewards</span>
          </button>
          <button
            onClick={() => window.open('https://github.com/RAJABSYNIC/bongo-truck-simulator', '_blank')}
            style={bottomSubBtnStyle}
          >
            <span style={{ fontSize: '18px' }}>👥</span>
            <span>Community</span>
          </button>
        </div>

        {/* CHINI KULIA: SOCIAL BADGES */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          opacity: 0.85
        }}>
          <span style={socialBadgeStyle}>📸 IG</span>
          <span style={socialBadgeStyle}>📘 FB</span>
          <span style={engineBadgeStyle}>⚡ WebGL</span>
          <span style={engineBadgeStyle}>🚚 3D</span>
        </div>
      </div>

      {/* ================= MODAL POPUPS ================= */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: '#111827',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            color: '#fff',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#94a3b8',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>

            {/* MODAL: KARAKANA */}
            {activeModal === 'karakana' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', color: '#fef08a' }}>
                  🔧 KARAKANA (GARAGE)
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>
                  Chagua gari unalotaka kuliendesha kwenye safari yako:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div
                    onClick={() => { setVehicleType('truck'); setActiveModal(null); }}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      border: vehicleType === 'truck' ? '2px solid #22c55e' : '1px solid #374151',
                      background: vehicleType === 'truck' ? 'rgba(34, 197, 94, 0.15)' : '#1f2937',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <span style={{ fontSize: '28px' }}>🚛</span>
                    <div>
                      <div style={{ fontWeight: '800', color: '#fff' }}>Scania R500 V8 Heavy Haul</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>Trela ya Kontena, Taa za LED, Horn ya Upepo</div>
                    </div>
                  </div>

                  <div
                    onClick={() => { setVehicleType('bus'); setActiveModal(null); }}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      border: vehicleType === 'bus' ? '2px solid #22c55e' : '1px solid #374151',
                      background: vehicleType === 'bus' ? 'rgba(34, 197, 94, 0.15)' : '#1f2937',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <span style={{ fontSize: '28px' }}>🚌</span>
                    <div>
                      <div style={{ fontWeight: '800', color: '#fff' }}>Marcopolo Luxury Coach Bus</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>Basi la Abiria Dar ➔ Arusha, AC, Viti vya Kisasa</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL: SOKO LA LORI */}
            {activeModal === 'soko' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', color: '#fef08a' }}>
                  🏪 SOKO LA MAGARI (MARKETPLACE)
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                  <div style={marketItemStyle}>
                    <div>
                      <div style={{ fontWeight: '700' }}>🚛 Scania Streamline 6x4</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Nguvu: 580 HP | Uwezo: Tani 45</div>
                    </div>
                    <span style={{ color: '#4ade80', fontWeight: '800', fontSize: '13px' }}>TSh 85,000,000</span>
                  </div>

                  <div style={marketItemStyle}>
                    <div>
                      <div style={{ fontWeight: '700' }}>🚌 Scania Touring VIP Bus</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Abiria: 54 | Wi-Fi & AC</div>
                    </div>
                    <span style={{ color: '#4ade80', fontWeight: '800', fontSize: '13px' }}>TSh 120,000,000</span>
                  </div>

                  <div style={marketItemStyle}>
                    <div>
                      <div style={{ fontWeight: '700' }}>🚛 Mercedes-Benz Actros 3340</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Tipper / Mizigo Mizito</div>
                    </div>
                    <span style={{ color: '#4ade80', fontWeight: '800', fontSize: '13px' }}>TSh 95,000,000</span>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL: RAMANI */}
            {activeModal === 'ramani' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '14px', color: '#fef08a' }}>
                  🗺️ RAMANI ZA SAFARI
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ ...marketItemStyle, border: '1.5px solid #22c55e' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#4ade80' }}>📍 Dar es Salaam ➔ Morogoro</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Umbali: 195 KM | Malipo: TSh 450,000</div>
                    </div>
                    <span style={{ background: '#22c55e', color: '#000', padding: '4px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '11px' }}>INACHEZEKA</span>
                  </div>
                  <div style={marketItemStyle}>
                    <div>
                      <div style={{ fontWeight: '700' }}>📍 Chalinze ➔ Tanga / Moshi</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Umbali: 340 KM | Malipo: TSh 780,000</div>
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '11px' }}>Inafunguka Lvl 2</span>
                  </div>
                  <div style={marketItemStyle}>
                    <div>
                      <div style={{ fontWeight: '700' }}>📍 Morogoro ➔ Dodoma (Mji Mkuu)</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Umbali: 260 KM | Malipo: TSh 620,000</div>
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '11px' }}>Inafunguka Lvl 3</span>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL: CHAGUA DEREVA */}
            {activeModal === 'dereva' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '14px', color: '#fef08a' }}>
                  👤 WASIFU WA DEREVA
                </h2>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Jina la Dereva:
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#1f2937',
                      border: '1px solid #4b5563',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#fff',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ background: '#1f2937', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Leseni:</div>
                    <div style={{ fontWeight: '700', color: '#38bdf8' }}>Daraja E (Heavy Duty)</div>
                  </div>
                  <div style={{ background: '#1f2937', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Umbali Jumla:</div>
                    <div style={{ fontWeight: '700', color: '#4ade80' }}>{(driver.distanceKm || 0)} KM</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const updated = { ...driver, name: customName }
                    setDriver(updated)
                    setActiveModal(null)
                  }}
                  style={{
                    width: '100%',
                    background: '#22c55e',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px',
                    color: '#000',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Hifadhi Dereva
                </button>
              </div>
            )}

            {/* MODAL: MISINGI (SETTINGS) */}
            {activeModal === 'misingi' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '14px', color: '#fef08a' }}>
                  ⚙️ MISINGI YA MCHEZO (SETTINGS)
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Sauti ya Injini & Upepo:</span>
                    <span style={{ color: '#22c55e', fontWeight: '700' }}>Imewashwa 🔊</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Ubora wa Picha (Graphics):</span>
                    <span style={{ color: '#38bdf8', fontWeight: '700' }}>High (HD 60fps)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Backend ya Supabase:</span>
                    <span style={{ color: '#4ade80', fontWeight: '700' }}>Imeunganishwa ✅</span>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL: KUHUSU */}
            {activeModal === 'kuhusu' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', color: '#fef08a' }}>
                  ℹ️ KUHUSU MCHEZO
                </h2>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1', marginBottom: '12px' }}>
                  <strong>Bongo Truck Simulator</strong> ni mchezo wa kwanza wa 3D wa uendeshaji wa malori na mabasi kwa barabara za Afrika Mashariki na Tanzania, unaoendeshwa moja kwa moja kwenye simu kupitia WebGL na React.
                </p>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Toleo: 1.0.0 (Live Vercel Edition)<br />
                  Imeundwa na: <strong>Rajabsynic</strong>
                </div>
              </div>
            )}

            {/* MODAL: DAILY REWARDS */}
            {activeModal === 'rewards' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', color: '#fef08a' }}>
                  🎁 ZAWADI YA SIKU (DAILY REWARD)
                </h2>
                <p style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '16px' }}>
                  Hongera Dereva! Umepokea posho ya mafuta kwa kuanza safari leo:
                </p>
                <div style={{
                  background: 'rgba(234, 179, 8, 0.2)',
                  border: '1.5px solid #eab308',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '6px' }}>💰</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: '#fef08a' }}>+ TSh 25,000</div>
                  <div style={{ fontSize: '11px', color: '#e2e8f0' }}>Imeongezwa kwenye pochi yako ya safari</div>
                </div>
                <button
                  onClick={() => {
                    setDriver(d => ({ ...d, money: (d.money || 50000) + 25000 }))
                    setActiveModal(null)
                  }}
                  style={{
                    width: '100%',
                    background: '#eab308',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px',
                    color: '#000',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Chukua Zawadi
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// STYLES
const topIconBtnStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '10px',
  background: 'rgba(15, 23, 42, 0.85)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: '#fff',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
  backdropFilter: 'blur(8px)'
}

const menuBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '9px 16px',
  borderRadius: '10px',
  background: 'rgba(15, 23, 42, 0.82)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  color: '#f8fafc',
  fontSize: '13px',
  fontWeight: '800',
  letterSpacing: '0.5px',
  cursor: 'pointer',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
  transition: 'transform 0.1s ease, background 0.15s ease',
  textAlign: 'left'
}

const bottomSubBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: 'transparent',
  border: 'none',
  color: '#cbd5e1',
  fontSize: '12px',
  fontWeight: '700',
  cursor: 'pointer',
  textShadow: '0 2px 4px rgba(0,0,0,0.8)'
}

const socialBadgeStyle = {
  background: 'rgba(15, 23, 42, 0.75)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '10px',
  fontWeight: '800'
}

const engineBadgeStyle = {
  background: 'rgba(255, 255, 255, 0.12)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '10px',
  fontWeight: '800'
}

const marketItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 14px',
  borderRadius: '10px',
  background: '#1f2937',
  border: '1px solid #374151'
}
