import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { createMaterials, buildTruck, buildBus } from './game/vehicles.js'
import { GameWorld } from './game/world.js'
import { sounds } from './game/audio.js'
import { getLocalDriver, syncDriverWithSupabase } from './lib/supabase.js'
import MobileControls from './components/MobileControls.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import RotatePrompt from './components/RotatePrompt.jsx'
import GarageView from './components/GarageView.jsx'
import { TrafficSystem } from './game/traffic.js'
import { DriverCockpit } from './game/cockpit.js'
import { RouteTracker } from './game/route.js'

export default function App() {
  const mountRef = useRef(null)

  // Game Mode State: 'home', 'garage', 'playing'
  const [gameState, setGameState] = useState('home')

  // Vehicle & Driving States (Default: Bus in Cockpit View kama BUSSID)
  const [vehicleType, setVehicleType] = useState('bus')
  const [busLivery, setBusLivery] = useState('abood') // 'abood', 'satco', 'baraka'
  const [cameraMode, setCameraMode] = useState('cockpit') // 'cockpit' (BUSSID Interior) au 'chase'
  const [gear, setGear] = useState('D') // 'D', 'N', 'R'
  const [headlightsOn, setHeadlightsOn] = useState(true)
  const [wipersOn, setWipersOn] = useState(false)
  const [speedKmH, setSpeedKmH] = useState(0)
  const [driver, setDriver] = useState(getLocalDriver())
  const [routeProgress, setRouteProgress] = useState(null)
  const [arrivalModal, setArrivalModal] = useState(false)

  // Controls Reference
  const inputRef = useRef({
    throttle: false,
    brake: false,
    steer: 0
  })

  // Driving Physics Reference
  const physicsRef = useRef({
    speed: 0,
    x: 2.6, // Anzia upande wa kulia wa njia ya Tanzania
    z: 0,
    heading: 0,
    steerAngle: 0,
    distanceKm: 0
  })

  const vehicleInstanceRef = useRef(null)
  const cockpitRef = useRef(null)
  const sceneRef = useRef(null)
  const materialsRef = useRef(null)
  const routeTrackerRef = useRef(new RouteTracker(0))

  useEffect(() => {
    if (gameState !== 'playing') return

    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.18
    container.appendChild(renderer.domElement)

    // Dunia ya Barabara ya Tanzania (Magufuli ➔ Msamvu)
    const world = new GameWorld(scene)
    const materials = createMaterials()
    materialsRef.current = materials

    // Magari ya Kupishana (Traffic)
    const traffic = new TrafficSystem(scene, materials)

    // Cockpit ya Ndani ya 3D (BUSSID Style Interior)
    const cockpit = new DriverCockpit(scene)
    cockpitRef.current = cockpit

    // Jenga Gari la Mchezaji
    function spawnVehicle(type, livery) {
      if (vehicleInstanceRef.current) {
        scene.remove(vehicleInstanceRef.current.group)
      }
      const vehicle = type === 'truck' ? buildTruck(materials) : buildBus(materials, livery || 'abood')
      vehicle.group.position.set(physicsRef.current.x, 0, physicsRef.current.z)
      scene.add(vehicle.group)
      vehicleInstanceRef.current = vehicle
    }

    spawnVehicle(vehicleType, busLivery)

    // Listeners za Keyboard
    const onKeyDown = (e) => {
      sounds.startEngine()
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') inputRef.current.throttle = true
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') inputRef.current.brake = true
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') inputRef.current.steer = -1
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') inputRef.current.steer = 1
      if (e.key === 'c' || e.key === 'C') setCameraMode(m => m === 'chase' ? 'cockpit' : 'chase')
      if (e.key === 'h' || e.key === 'H') sounds.playBusHorn()
      if (e.key === 'l' || e.key === 'L') setHeadlightsOn(l => !l)
      if (e.key === 'p' || e.key === 'P') sounds.playDoorSound()
      if (e.key === 'Escape') setGameState('home')
    }

    const onKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') inputRef.current.throttle = false
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') inputRef.current.brake = false
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd') {
        inputRef.current.steer = 0
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // SIMULATION LOOP
    let lastTime = performance.now()
    let frameId
    let brakeAirPlayed = false
    let distanceSaveTimer = 0

    const animate = (time) => {
      frameId = requestAnimationFrame(animate)
      const dt = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time

      const p = physicsRef.current
      const inp = inputRef.current
      const v = vehicleInstanceRef.current

      if (v) {
        const maxForwardSpeed = 33 // ~120 KM/H
        const maxReverseSpeed = -8
        const accelRate = 8.5
        const brakeRate = 22.0
        const dragRate = 2.0

        if (gear === 'D') {
          if (inp.throttle) {
            p.speed = Math.min(maxForwardSpeed, p.speed + accelRate * dt)
          }
          if (inp.brake) {
            if (p.speed > 0.5) {
              p.speed = Math.max(0, p.speed - brakeRate * dt)
              if (!brakeAirPlayed && p.speed < 4) {
                sounds.playAirBrake()
                brakeAirPlayed = true
              }
            } else {
              p.speed = 0
            }
          } else {
            brakeAirPlayed = false
          }
        } else if (gear === 'R') {
          if (inp.throttle) {
            p.speed = Math.max(maxReverseSpeed, p.speed - (accelRate * 0.7) * dt)
          }
          if (inp.brake) {
            p.speed = Math.min(0, p.speed + brakeRate * dt)
          }
        }

        if (!inp.throttle && !inp.brake) {
          if (p.speed > 0) {
            p.speed = Math.max(0, p.speed - dragRate * dt)
          } else if (p.speed < 0) {
            p.speed = Math.min(0, p.speed + dragRate * dt)
          }
        }

        const targetSteerAngle = inp.steer * 0.52
        p.steerAngle += (targetSteerAngle - p.steerAngle) * Math.min(dt * 7.5, 1)

        v.steerWheels.forEach(sw => {
          sw.rotation.y = -p.steerAngle
        })

        if (Math.abs(p.speed) > 0.1) {
          const turnMultiplier = 0.52
          p.heading += p.steerAngle * (p.speed / 10) * turnMultiplier * dt
          p.heading = Math.max(-0.22, Math.min(0.22, p.heading))
        }

        const forwardVel = p.speed * Math.cos(p.heading)
        const lateralVel = p.speed * Math.sin(p.heading)

        p.z += forwardVel * dt
        p.x = Math.max(-5.2, Math.min(5.2, p.x + lateralVel * dt))

        v.group.position.set(p.x, 0, p.z)
        v.group.rotation.y = p.heading

        const wheelRotSpeed = p.speed / 0.58
        v.wheels.forEach(w => {
          w.rotation.x += wheelRotSpeed * dt
        })

        const currentKmH = p.speed * 3.6
        sounds.updateEngine(currentKmH, inp.throttle)
        setSpeedKmH(currentKmH)

        world.update(p.z)
        traffic.update(dt, p.z, p.speed)

        // COCKPIT 3D POSITIONING NA INSTRUMENT UPDATE (BUSSID STYLE)
        if (cockpit) {
          cockpit.setPosition(v.group.position, p.heading)
          cockpit.setSteering(p.steerAngle)
          cockpit.updateGauges(currentKmH, Math.abs(p.speed) / maxForwardSpeed, gear)
          cockpit.updateWipers(time / 1000, wipersOn)

          if (routeTrackerRef.current) {
            const prog = routeTrackerRef.current.update((p.speed * dt) / 1000)
            cockpit.updateGPS(prog, currentKmH)
            setRouteProgress(prog)

            if (prog.isCompleted && !arrivalModal) {
              setArrivalModal(true)
              p.speed = 0
              sounds.playAirBrake()
            }
          }
        }

        // CAMERA MODES
        if (cameraMode === 'cockpit') {
          // Kiti cha Dereva ndani ya Basi (BUSSID Driver Eye Level)
          const driverHeadPos = new THREE.Vector3(-0.4, 2.38, 3.82)
          driverHeadPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), p.heading)
          driverHeadPos.add(v.group.position)

          camera.position.copy(driverHeadPos)

          // Mtazamo mbele kupitia kioo kuelekea barabarani
          const lookAhead = driverHeadPos.clone().add(
            new THREE.Vector3(Math.sin(p.heading), -0.02, Math.cos(p.heading)).multiplyScalar(40)
          )
          camera.lookAt(lookAhead)
        } else {
          // Chase camera
          const offset = v.chaseOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), p.heading)
          const targetCamPos = v.group.position.clone().add(offset)
          camera.position.lerp(targetCamPos, 0.12)

          const lookTarget = v.group.position.clone().add(new THREE.Vector3(0, 2.2, 7.0))
          camera.lookAt(lookTarget)
        }

        v.headlights.forEach(hl => {
          hl.visible = headlightsOn
        })

        // Hifadhi data za dereva mara kwa mara
        if (p.speed > 0) {
          distanceSaveTimer += dt
          if (distanceSaveTimer > 6) {
            distanceSaveTimer = 0
            const updated = {
              ...driver,
              distanceKm: Math.round((driver.distanceKm + (p.speed * dt) / 1000) * 10) / 10
            }
            setDriver(updated)
            syncDriverWithSupabase(updated)
          }
        }
      }

      renderer.render(scene, camera)
    }

    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', onResize)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      cockpit.destroy()
      renderer.dispose()
    }
  }, [gameState, vehicleType, busLivery, cameraMode, gear, headlightsOn, wipersOn])

  const handleStartPlay = () => {
    sounds.startEngine()
    setGameState('playing')
  }

  const handleHorn = () => {
    sounds.startEngine()
    sounds.playBusHorn()
  }

  const handleDoor = () => {
    sounds.playDoorSound()
  }

  const handleCompleteJourney = () => {
    // Malipo ya safari ya Magufuli ➔ Msamvu: TSh 650,000!
    const updated = {
      ...driver,
      money: (driver.money || 50000) + 650000,
      xp: (driver.xp || 100) + 500
    }
    setDriver(updated)
    syncDriverWithSupabase(updated)
    setArrivalModal(false)
    routeTrackerRef.current = new RouteTracker(0)
    setGameState('home')
  }

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#0f172a'
    }}>
      <RotatePrompt />

      {/* 1. HOME SCREEN */}
      {gameState === 'home' && (
        <HomeScreen
          onPlay={handleStartPlay}
          onOpenGarage={() => setGameState('garage')}
          driver={driver}
          setDriver={setDriver}
          vehicleType={vehicleType}
          setVehicleType={setVehicleType}
        />
      )}

      {/* 2. 3D INDOOR GARAGE */}
      {gameState === 'garage' && (
        <GarageView
          vehicleType={vehicleType}
          setVehicleType={setVehicleType}
          busLivery={busLivery}
          setBusLivery={setBusLivery}
          onStartDrive={() => {
            sounds.startEngine()
            setGameState('playing')
          }}
          onBackToMenu={() => setGameState('home')}
          driver={driver}
        />
      )}

      {/* 3. PLAYING 3D SIMULATOR */}
      {gameState === 'playing' && (
        <>
          <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

          <MobileControls
            onThrottle={(val) => {
              sounds.startEngine()
              inputRef.current.throttle = val
            }}
            onBrake={(val) => {
              sounds.startEngine()
              inputRef.current.brake = val
            }}
            onSteer={(val) => {
              sounds.startEngine()
              inputRef.current.steer = val
            }}
            gear={gear}
            setGear={setGear}
            cameraMode={cameraMode}
            toggleCamera={() => setCameraMode(m => m === 'chase' ? 'cockpit' : 'chase')}
            toggleHeadlights={() => setHeadlightsOn(h => !h)}
            headlightsOn={headlightsOn}
            onHorn={handleHorn}
            onDoor={handleDoor}
            onWipers={() => setWipersOn(w => !w)}
            wipersOn={wipersOn}
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
            speedKmH={speedKmH}
            onOpenMenu={() => setGameState('home')}
            routeProgress={routeProgress}
          />

          {/* MODAL YA KUWASILI MSAMVU MOROGORO */}
          {arrivalModal && (
            <div style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <div style={{
                background: '#111827',
                border: '2px solid #22c55e',
                borderRadius: '24px',
                maxWidth: '460px',
                width: '100%',
                padding: '30px',
                textAlign: 'center',
                color: '#fff',
                boxShadow: '0 25px 50px rgba(34, 197, 94, 0.3)'
              }}>
                <div style={{ fontSize: '50px', marginBottom: '12px' }}>🎉 🚌</div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  color: '#fef08a',
                  marginBottom: '8px'
                }}>
                  HONGERA DEREVA!
                </h2>
                <div style={{
                  fontSize: '16px',
                  color: '#4ade80',
                  fontWeight: '800',
                  marginBottom: '16px'
                }}>
                  Umewasili Stendi ya Msamvu (Morogoro) Salama!
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
                  Umekamilisha safari ya <strong>KM 190</strong> kutoka Stendi Kuu ya Magufuli (Mbezi Luis, Dar) ukipita Vigwaza na Chalinze bila ajali.
                </p>

                <div style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid #22c55e',
                  borderRadius: '16px',
                  padding: '14px',
                  marginBottom: '22px'
                }}>
                  <div style={{ fontSize: '12px', color: '#86efac' }}>Malipo ya Safari:</div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: '#22c55e' }}>
                    + TSh 650,000
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>+ 500 Dereva XP</div>
                </div>

                <button
                  onClick={handleCompleteJourney}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '14px',
                    color: '#fff',
                    fontWeight: '900',
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)'
                  }}
                >
                  Pokea Pesa & Rudi Karakana
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
