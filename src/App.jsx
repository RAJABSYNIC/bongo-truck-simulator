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

export default function App() {
  const mountRef = useRef(null)

  // Game Mode State: 'home', 'garage', 'playing'
  const [gameState, setGameState] = useState('home')

  // Vehicle & Driving States
  const [vehicleType, setVehicleType] = useState('truck') // 'truck' au 'bus'
  const [cameraMode, setCameraMode] = useState('chase') // 'chase' au 'cockpit'
  const [gear, setGear] = useState('D') // 'D', 'N', 'R'
  const [headlightsOn, setHeadlightsOn] = useState(true)
  const [speedKmH, setSpeedKmH] = useState(0)
  const [driver, setDriver] = useState(getLocalDriver())

  // Controls Reference (kwa ajili ya requestAnimationFrame)
  const inputRef = useRef({
    throttle: false,
    brake: false,
    steer: 0 // -1 to +1
  })

  // Driving Physics Reference
  const physicsRef = useRef({
    speed: 0, // m/s
    x: 0,
    z: 0,
    heading: 0,
    steerAngle: 0,
    distanceKm: driver.distanceKm || 0
  })

  const vehicleInstanceRef = useRef(null)
  const sceneRef = useRef(null)
  const materialsRef = useRef(null)

  // THREE.JS EFFECT (Inafanya kazi tu wakati gameState === 'playing')
  useEffect(() => {
    if (gameState !== 'playing') return

    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)

    // Dunia ya Barabara yenye Ubora wa Juu (HD Landscape)
    const world = new GameWorld(scene)
    const materials = createMaterials()
    materialsRef.current = materials

    // Jenga Gari la Kwanza (Lori au Basi)
    function spawnVehicle(type) {
      if (vehicleInstanceRef.current) {
        scene.remove(vehicleInstanceRef.current.group)
      }
      const vehicle = type === 'truck' ? buildTruck(materials) : buildBus(materials)
      vehicle.group.position.set(physicsRef.current.x, 0, physicsRef.current.z)
      scene.add(vehicle.group)
      vehicleInstanceRef.current = vehicle
    }

    spawnVehicle(vehicleType)

    // Listeners za Keyboard
    const onKeyDown = (e) => {
      sounds.startEngine()
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') inputRef.current.throttle = true
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') inputRef.current.brake = true
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') inputRef.current.steer = -1
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') inputRef.current.steer = 1
      if (e.key === 'c' || e.key === 'C') setCameraMode(m => m === 'chase' ? 'cockpit' : 'chase')
      if (e.key === 'h' || e.key === 'H') sounds.playHorn()
      if (e.key === 'l' || e.key === 'L') setHeadlightsOn(l => !l)
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

    // SIMULATION LOOP (60 FPS)
    let lastTime = performance.now()
    let frameId
    let brakeAirPlayed = false
    let distanceSaveTimer = 0
    let smokeIndex = 0

    const animate = (time) => {
      frameId = requestAnimationFrame(animate)
      const dt = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time

      const p = physicsRef.current
      const inp = inputRef.current
      const v = vehicleInstanceRef.current

      if (v) {
        const maxForwardSpeed = 32 // ~115 KM/H
        const maxReverseSpeed = -8 // ~28 KM/H
        const accelRate = 8.0
        const brakeRate = 20.0
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

        // Exhaust Smoke Effects Unapokanyaga mafuta
        if (v.smokeParticles && v.smokeParticles.length > 0 && inp.throttle) {
          smokeIndex = (smokeIndex + 1) % v.smokeParticles.length
          const smk = v.smokeParticles[smokeIndex]
          smk.visible = true
          smk.scale.setScalar(1.0 + Math.random() * 0.8)
          smk.position.y += 0.04
          smk.position.z -= 0.08
        }

        const currentKmH = p.speed * 3.6
        sounds.updateEngine(currentKmH, inp.throttle)
        setSpeedKmH(currentKmH)

        world.update(p.z)

        if (cameraMode === 'cockpit') {
          const eyePos = v.cabinPos.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), p.heading)
          eyePos.add(v.group.position)
          camera.position.copy(eyePos)

          const lookTarget = eyePos.clone().add(
            new THREE.Vector3(Math.sin(p.heading), -0.04, Math.cos(p.heading)).multiplyScalar(35)
          )
          camera.lookAt(lookTarget)
        } else {
          const offset = v.chaseOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), p.heading)
          const targetCamPos = v.group.position.clone().add(offset)
          camera.position.lerp(targetCamPos, 0.12)

          const lookTarget = v.group.position.clone().add(new THREE.Vector3(0, 2.2, 7.0))
          camera.lookAt(lookTarget)
        }

        v.headlights.forEach(hl => {
          hl.visible = headlightsOn
        })

        if (p.speed > 0) {
          p.distanceKm += (p.speed * dt) / 1000
          distanceSaveTimer += dt
          if (distanceSaveTimer > 5) {
            distanceSaveTimer = 0
            const updated = { ...driver, distanceKm: Math.round(p.distanceKm * 10) / 10 }
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
      renderer.dispose()
    }
  }, [gameState, vehicleType, cameraMode, gear, headlightsOn])

  // Start Playing
  const handleStartPlay = () => {
    sounds.startEngine()
    setGameState('playing')
  }

  // Horn Click Trigger
  const handleHorn = () => {
    sounds.startEngine()
    sounds.playHorn()
  }

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#0f172a'
    }}>
      {/* KIKUMBUSHO CHA SKRINI YA MLALO (LANDSCAPE ORIENTATION LOCK & PROMPT) */}
      <RotatePrompt />

      {/* 1. HOME SCREEN (Menu ya kuanzia) */}
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

      {/* 2. 3D INDOOR GARAGE (Karakana Halisi ya Ndani ya 3D) */}
      {gameState === 'garage' && (
        <GarageView
          vehicleType={vehicleType}
          setVehicleType={setVehicleType}
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
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
            speedKmH={speedKmH}
            onOpenMenu={() => setGameState('home')}
          />
        </>
      )}
    </div>
  )
}
