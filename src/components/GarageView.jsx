import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GarageScene } from '../game/garage.js'
import { createMaterials, buildTruck, buildBus } from '../game/vehicles.js'
import { sounds } from '../game/audio.js'

const PAINT_COLORS = [
  { name: 'Sapphire Blue', color: 0x0284c7, hex: '#0284c7' },
  { name: 'Safari Crimson', color: 0xdc2626, hex: '#dc2626' },
  { name: 'Tanzania Gold', color: 0xd97706, hex: '#d97706' },
  { name: 'Serengeti Green', color: 0x15803d, hex: '#15803d' },
  { name: 'Obsidian Black', color: 0x18181b, hex: '#18181b' },
  { name: 'Arctic White', color: 0xf1f5f9, hex: '#f1f5f9' }
]

export default function GarageView({
  vehicleType,
  setVehicleType,
  busLivery,
  setBusLivery,
  onStartDrive,
  onBackToMenu,
  driver
}) {
  const mountRef = useRef(null)
  const [selectedColor, setSelectedColor] = useState(PAINT_COLORS[0].hex)

  const vehicleObjRef = useRef(null)
  const materialsRef = useRef(null)
  const sceneRef = useRef(null)

  // Camera Orbit Controls State
  const cameraOrbit = useRef({
    radius: 12.0,
    theta: Math.PI / 4, // Horizontal angle
    phi: Math.PI / 3, // Vertical angle
    isDragging: false,
    lastX: 0,
    lastY: 0
  })

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // Jenga Karakana ya Ndani ya 3D (3D Indoor Workshop)
    const garage = new GarageScene(scene)
    const materials = createMaterials()
    materialsRef.current = materials

    // Weka Gari Katikati ya Karakana
    function spawnGarageVehicle(type, livery) {
      if (vehicleObjRef.current) {
        scene.remove(vehicleObjRef.current.group)
      }
      const vehicle = type === 'truck' ? buildTruck(materials) : buildBus(materials, livery || 'abood')
      vehicle.group.position.set(0, 0, 0)
      vehicle.group.rotation.y = Math.PI / 6 // Slight majestic angle
      scene.add(vehicle.group)
      vehicleObjRef.current = vehicle
    }

    spawnGarageVehicle(vehicleType, busLivery)

    // Orbit Camera Update Function
    const updateCameraPos = () => {
      const orb = cameraOrbit.current
      const x = orb.radius * Math.sin(orb.phi) * Math.sin(orb.theta)
      const y = orb.radius * Math.cos(orb.phi)
      const z = orb.radius * Math.sin(orb.phi) * Math.cos(orb.theta)

      camera.position.set(x, y, z)
      camera.lookAt(0, 1.8, 0) // Angalia katikati ya gari
    }

    updateCameraPos()

    // Touch / Mouse Orbit Handlers
    const handlePointerDown = (e) => {
      cameraOrbit.current.isDragging = true
      cameraOrbit.current.lastX = e.clientX || (e.touches && e.touches[0].clientX) || 0
      cameraOrbit.current.lastY = e.clientY || (e.touches && e.touches[0].clientY) || 0
    }

    const handlePointerMove = (e) => {
      if (!cameraOrbit.current.isDragging) return
      const curX = e.clientX || (e.touches && e.touches[0].clientX) || 0
      const curY = e.clientY || (e.touches && e.touches[0].clientY) || 0

      const dx = curX - cameraOrbit.current.lastX
      const dy = curY - cameraOrbit.current.lastY
      cameraOrbit.current.lastX = curX
      cameraOrbit.current.lastY = curY

      // Zungusha angle
      cameraOrbit.current.theta -= dx * 0.007
      cameraOrbit.current.phi = Math.max(0.4, Math.min(Math.PI / 2 - 0.05, cameraOrbit.current.phi - dy * 0.007))

      updateCameraPos()
    }

    const handlePointerUp = () => {
      cameraOrbit.current.isDragging = false
    }

    container.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    // Resize
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      updateCameraPos()
    }
    window.addEventListener('resize', onResize)

    // Slow auto-turntable idle spin when not dragging
    let frameId
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      if (!cameraOrbit.current.isDragging) {
        cameraOrbit.current.theta += 0.0015
        updateCameraPos()
      }
      renderer.render(scene, camera)
    }
    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
      container.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('resize', onResize)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      garage.destroy()
      renderer.dispose()
    }
  }, [vehicleType, busLivery])

  // Change Paint Color
  const handleColorChange = (hexColor, intColor) => {
    setSelectedColor(hexColor)
    if (materialsRef.current) {
      if (vehicleType === 'truck' && materialsRef.current.truckCab) {
        materialsRef.current.truckCab.color.setHex(intColor)
      } else if (vehicleType === 'bus' && materialsRef.current.busBody) {
        materialsRef.current.busBody.color.setHex(intColor)
      }
    }
  }

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#0b0f19',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 3D Canvas Mount (Karakana ya Ndani) */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          touchAction: 'none'
        }}
      />

      {/* TOP HEADER: KARAKANA TITLE & MONEY */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 20
      }}>
        {/* Rudi Nyuma */}
        <button
          onClick={onBackToMenu}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: '#fff',
            padding: '10px 16px',
            fontWeight: '800',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>◀</span>
          <span>RUDI MENU</span>
        </button>

        {/* Title */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '8px 24px',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '900',
            letterSpacing: '1px',
            color: '#fef08a'
          }}>
            🔧 KARAKANA KUU (WORKSHOP)
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            Buruta skrini (Swipe 360°) kutazama gari pande zote
          </div>
        </div>

        {/* Pesa ya Dereva */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1.5px solid #eab308',
          borderRadius: '12px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '900',
          color: '#fef08a'
        }}>
          <span>🪙 TZS</span>
          <span>{(driver.money || 50000).toLocaleString()}</span>
        </div>
      </div>

      {/* BOTTOM CONTROL PANEL: VEHICLE SWITCHER & PAINT CUSTOMIZER */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        zIndex: 20
      }}>
        {/* KUSHOTO: BADILI GARI NA LIVERY YA KAMPUNI */}
        <div style={{
          pointerEvents: 'auto',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '320px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#fef08a', textTransform: 'uppercase' }}>
            🚌 Kampuni / Gari la Tanzania:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button
              onClick={() => {
                setVehicleType('bus')
                setBusLivery('abood')
              }}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                background: vehicleType === 'bus' && busLivery === 'abood' ? '#dc2626' : 'rgba(255, 255, 255, 0.08)',
                border: vehicleType === 'bus' && busLivery === 'abood' ? '2px solid #ef4444' : '1px solid transparent',
                color: '#fff',
                fontWeight: '800',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              🔴 ABOOD BUS
            </button>
            <button
              onClick={() => {
                setVehicleType('bus')
                setBusLivery('satco')
              }}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                background: vehicleType === 'bus' && busLivery === 'satco' ? '#ea580c' : 'rgba(255, 255, 255, 0.08)',
                border: vehicleType === 'bus' && busLivery === 'satco' ? '2px solid #f97316' : '1px solid transparent',
                color: '#fff',
                fontWeight: '800',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              ⚪ SATCO BUS
            </button>
            <button
              onClick={() => {
                setVehicleType('bus')
                setBusLivery('baraka')
              }}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                background: vehicleType === 'bus' && busLivery === 'baraka' ? '#ca8a04' : 'rgba(255, 255, 255, 0.08)',
                border: vehicleType === 'bus' && busLivery === 'baraka' ? '2px solid #eab308' : '1px solid transparent',
                color: '#fff',
                fontWeight: '800',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              🟡 BARAKA COACH
            </button>
            <button
              onClick={() => setVehicleType('truck')}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                background: vehicleType === 'truck' ? '#0284c7' : 'rgba(255, 255, 255, 0.08)',
                border: vehicleType === 'truck' ? '2px solid #38bdf8' : '1px solid transparent',
                color: '#fff',
                fontWeight: '800',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              🚛 SCANIA LORI
            </button>
          </div>
        </div>

        {/* KATIKATI: CHAGUA RANGI (PAINT SHOP) */}
        <div style={{
          pointerEvents: 'auto',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '12px 18px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#fef08a' }}>
            🎨 RANGI YA GARI (PAINT SHOP)
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {PAINT_COLORS.map(p => (
              <button
                key={p.hex}
                onClick={() => handleColorChange(p.hex, p.color)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: p.hex,
                  border: selectedColor === p.hex ? '3px solid #ffffff' : '2px solid rgba(255,255,255,0.2)',
                  boxShadow: selectedColor === p.hex ? '0 0 12px #ffffff' : 'none',
                  cursor: 'pointer',
                  transform: selectedColor === p.hex ? 'scale(1.15)' : 'none',
                  transition: 'transform 0.15s ease'
                }}
                title={p.name}
              />
            ))}
          </div>
        </div>

        {/* KULIA: ANZA SAFARI (START DRIVE TO HIGHWAY) */}
        <div style={{ pointerEvents: 'auto' }}>
          <button
            onClick={() => {
              sounds.startEngine()
              onStartDrive()
            }}
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
              border: '2px solid #4ade80',
              borderRadius: '16px',
              padding: '16px 28px',
              color: '#ffffff',
              fontWeight: '900',
              fontSize: '16px',
              cursor: 'pointer',
              letterSpacing: '1px',
              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span style={{ fontSize: '22px' }}>🚚💨</span>
            <span>ENDA BARABARANI</span>
          </button>
        </div>
      </div>
    </div>
  )
}

