import React, { useState, useRef, useEffect } from 'react'

export default function MobileControls({
  onThrottle,
  onBrake,
  onSteer,
  gear,
  setGear,
  cameraMode,
  toggleCamera,
  toggleHeadlights,
  headlightsOn,
  onHorn,
  vehicleType,
  setVehicleType,
  speedKmH
}) {
  const [controlMode, setControlMode] = useState('buttons') // 'buttons' au 'wheel'
  const [steerAngle, setSteerAngle] = useState(0) // Degrees (-90 to +90)
  const [isPressingGas, setIsPressingGas] = useState(false)
  const [isPressingBrake, setIsPressingBrake] = useState(false)
  const [isPressingLeft, setIsPressingLeft] = useState(false)
  const [isPressingRight, setIsPressingRight] = useState(false)

  const wheelRef = useRef(null)
  const isDraggingWheel = useRef(false)
  const wheelCenter = useRef({ x: 0, y: 0 })

  // Button Steering Loop
  useEffect(() => {
    let steerVal = 0
    if (isPressingLeft) steerVal -= 1
    if (isPressingRight) steerVal += 1
    onSteer(steerVal)
  }, [isPressingLeft, isPressingRight, onSteer])

  // Wheel Drag Handlers
  const handleWheelStart = (e) => {
    isDraggingWheel.current = true
    if (wheelRef.current) {
      const rect = wheelRef.current.getBoundingClientRect()
      wheelCenter.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      }
    }
  }

  const handleWheelMove = (e) => {
    if (!isDraggingWheel.current) return
    const touch = e.touches ? e.touches[0] : e
    const dx = touch.clientX - wheelCenter.current.x
    const dy = touch.clientY - wheelCenter.current.y
    let angleRad = Math.atan2(dx, -dy)
    let angleDeg = (angleRad * 180) / Math.PI
    // Clamp to -90 to +90
    angleDeg = Math.max(-90, Math.min(90, angleDeg))
    setSteerAngle(angleDeg)
    onSteer(angleDeg / 90)
  }

  const handleWheelEnd = () => {
    isDraggingWheel.current = false
    setSteerAngle(0)
    onSteer(0)
  }

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '16px',
      zIndex: 10
    }}>
      {/* BAR YA JUU: Status, Kamera, Taa, Gari na Honk */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'auto',
        gap: '8px'
      }}>
        {/* Kushoto: Kubadili Gari (Lori / Basi) */}
        <button
          onClick={() => setVehicleType(vehicleType === 'truck' ? 'bus' : 'truck')}
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            borderRadius: '12px',
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>{vehicleType === 'truck' ? '🚛 Lori' : '🚌 Basi'}</span>
          <span style={{ fontSize: '11px', color: '#38bdf8' }}>(Badili)</span>
        </button>

        {/* Katikati: Speedometer na Gear Display */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '6px 16px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
        }}>
          <div style={{
            fontSize: '28px',
            fontWeight: '900',
            color: '#38bdf8',
            fontFamily: 'monospace',
            letterSpacing: '1px'
          }}>
            {Math.round(Math.abs(speedKmH))}
            <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '4px' }}>KM/H</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '11px', fontWeight: '700' }}>
            <span style={{ color: gear === 'D' ? '#22c55e' : '#64748b' }}>[D] DRIVE</span>
            <span style={{ color: gear === 'N' ? '#eab308' : '#64748b' }}>[N]</span>
            <span style={{ color: gear === 'R' ? '#ef4444' : '#64748b' }}>[R] REV</span>
          </div>
        </div>

        {/* Kulia: Kamera, Taa, Honk */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {/* Camera Button */}
          <button
            onClick={toggleCamera}
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              borderRadius: '12px',
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📷 {cameraMode === 'chase' ? 'Nje' : 'Cockpit'}
          </button>

          {/* Headlights Button */}
          <button
            onClick={toggleHeadlights}
            style={{
              background: headlightsOn ? 'rgba(234, 179, 8, 0.3)' : 'rgba(15, 23, 42, 0.75)',
              border: headlightsOn ? '1px solid #eab308' : '1px solid rgba(255, 255, 255, 0.2)',
              color: headlightsOn ? '#fde047' : '#fff',
              borderRadius: '12px',
              padding: '8px 10px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            💡 Taa
          </button>

          {/* Horn Button */}
          <button
            onPointerDown={onHorn}
            style={{
              background: 'rgba(225, 29, 72, 0.3)',
              border: '1px solid rgba(225, 29, 72, 0.5)',
              color: '#fda4af',
              borderRadius: '12px',
              padding: '8px 10px',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: '700'
            }}
          >
            📯 HONK
          </button>
        </div>
      </div>

      {/* SEHEMU YA CHINI: Vidhibiti vya Simu (Kushoto = Usukani, Kulia = Pedali za Mafuta & Breki) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'auto',
        width: '100%',
        paddingBottom: '8px'
      }}>
        {/* KUSHOTO: USUKANI / MISHALE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          {/* Badili Mode (Wheel vs Buttons) */}
          <button
            onClick={() => setControlMode(controlMode === 'wheel' ? 'buttons' : 'wheel')}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '10px',
              cursor: 'pointer'
            }}
          >
            {controlMode === 'wheel' ? '🎮 Tumia Mishale' : '🎡 Tumia Usukani'}
          </button>

          {controlMode === 'wheel' ? (
            /* Virtual Steering Wheel */
            <div
              ref={wheelRef}
              onPointerDown={handleWheelStart}
              onPointerMove={handleWheelMove}
              onPointerUp={handleWheelEnd}
              onPointerCancel={handleWheelEnd}
              style={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                border: '6px solid #475569',
                background: 'radial-gradient(circle, #1e293b 0%, #0f172a 100%)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6), inset 0 0 10px rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${steerAngle}deg)`,
                touchAction: 'none',
                cursor: 'grab'
              }}
            >
              {/* Wheel Spokes */}
              <div style={{ width: '100%', height: '14px', background: '#334155', position: 'absolute' }}></div>
              <div style={{ width: '14px', height: '100%', background: '#334155', position: 'absolute' }}></div>
              {/* Center Cap */}
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: '#0284c7',
                border: '2px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                zIndex: 2
              }}>
                ETS
              </div>
            </div>
          ) : (
            /* Left / Right Buttons */
            <div style={{ display: 'flex', gap: '14px' }}>
              <button
                onPointerDown={() => setIsPressingLeft(true)}
                onPointerUp={() => setIsPressingLeft(false)}
                onPointerLeave={() => setIsPressingLeft(false)}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '16px',
                  background: isPressingLeft ? '#0284c7' : 'rgba(30, 41, 59, 0.85)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontSize: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  touchAction: 'none',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.4)'
                }}
              >
                ◀
              </button>
              <button
                onPointerDown={() => setIsPressingRight(true)}
                onPointerUp={() => setIsPressingRight(false)}
                onPointerLeave={() => setIsPressingRight(false)}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '16px',
                  background: isPressingRight ? '#0284c7' : 'rgba(30, 41, 59, 0.85)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontSize: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  touchAction: 'none',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.4)'
                }}
              >
                ▶
              </button>
            </div>
          )}
        </div>

        {/* KATIKATI CHINI: GEAR SHIFTER BUTTONS */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '6px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {['D', 'N', 'R'].map((g) => (
            <button
              key={g}
              onClick={() => setGear(g)}
              style={{
                width: '38px',
                height: '32px',
                borderRadius: '8px',
                background: gear === g ? (g === 'D' ? '#22c55e' : g === 'R' ? '#ef4444' : '#eab308') : 'transparent',
                color: gear === g ? '#fff' : '#94a3b8',
                border: 'none',
                fontWeight: '900',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* KULIA: PEDALI YA BREKI & PEDALI YA MAFUTA (GAS) */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end' }}>
          {/* BREKI (Brake Pedal) */}
          <button
            onPointerDown={() => {
              setIsPressingBrake(true)
              onBrake(true)
            }}
            onPointerUp={() => {
              setIsPressingBrake(false)
              onBrake(false)
            }}
            onPointerLeave={() => {
              setIsPressingBrake(false)
              onBrake(false)
            }}
            style={{
              width: '64px',
              height: '84px',
              borderRadius: '14px',
              background: isPressingBrake ? '#dc2626' : 'rgba(220, 38, 38, 0.4)',
              border: '2px solid rgba(239, 68, 68, 0.6)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '900',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: 'pointer',
              touchAction: 'none',
              transform: isPressingBrake ? 'scale(0.95)' : 'none',
              boxShadow: '0 6px 18px rgba(0,0,0,0.5)'
            }}
          >
            <span style={{ fontSize: '18px' }}>🛑</span>
            <span>BREKI</span>
          </button>

          {/* MAFUTA (Gas / Accelerator Pedal) */}
          <button
            onPointerDown={() => {
              setIsPressingGas(true)
              onThrottle(true)
            }}
            onPointerUp={() => {
              setIsPressingGas(false)
              onThrottle(false)
            }}
            onPointerLeave={() => {
              setIsPressingGas(false)
              onThrottle(false)
            }}
            style={{
              width: '64px',
              height: '110px',
              borderRadius: '14px',
              background: isPressingGas ? '#16a34a' : 'rgba(22, 163, 74, 0.4)',
              border: '2px solid rgba(34, 197, 94, 0.6)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '900',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              touchAction: 'none',
              transform: isPressingGas ? 'scale(0.95)' : 'none',
              boxShadow: '0 6px 20px rgba(0,0,0,0.5)'
            }}
          >
            <span style={{ fontSize: '20px' }}>⚡</span>
            <span>MAFUTA</span>
          </button>
        </div>
      </div>
    </div>
  )
}
