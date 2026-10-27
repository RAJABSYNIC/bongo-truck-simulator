import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { createMaterials, buildTruck, buildBus } from './game/vehicles.js'
import { GameWorld } from './game/world.js'
import { sounds } from './game/audio.js'
import { getLocalDriver, syncDriverWithSupabase } from './lib/supabase.js'
import MobileControls from './components/MobileControls.jsx'

export default function App() {
  const mountRef = useRef(null)

  // Game States
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
    x: 0, // lateral position on road
    z: 0, // longitudinal position (mbele)
    heading: 0, // angle of vehicle
    steerAngle: 0, // current wheel angle
    distanceKm: driver.distanceKm || 0
  })

  // Switch Vehicle Function
  const vehicleInstanceRef = useRef(null)
  const sceneRef = useRef(null)
  const materialsRef = useRef(null)

  useEffect(() => {
    // 1. ANZA SCENE YA THREE.JS
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 800)
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    container.appendChild(renderer.domElement)

    // 2. TENGENEZA DUNIA YA BARABARA (WORLD)
    const world = new GameWorld(scene)
    const materials = createMaterials()
    materialsRef.current = materials

    // 3. Jenga Gari la Kwanza (Lori au Basi)
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

    // 4. LISTENERS ZA KEYBOARD (KWA AJILI YA KOMPYUTA)
    const onKeyDown = (e) => {
      sounds.startEngine()
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') inputRef.current.throttle = true
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') inputRef.current.brake = true
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') inputRef.current.steer = -1
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') inputRef.current.steer = 1
      if (e.key === 'c' || e.key === 'C') setCameraMode(m => m === 'chase' ? 'cockpit' : 'chase')
      if (e.key === 'h' || e.key === 'H') sounds.playHorn()
      if (e.key === 'l' || e.key === 'L') setHeadlightsOn(l => !l)
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

    // Window Resize Handler
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // 5. DRIVING SIMULATION LOOP (60 FPS)
    let lastTime = performance.now()
    let frameId
    let brakeAirPlayed = false
    let distanceSaveTimer = 0

    const animate = (time) => {
      frameId = requestAnimationFrame(animate)
      const dt = Math.min((time - lastTime) / 1000, 0.1) // Max delta 0.1s
      lastTime = time

      const p = physicsRef.current
      const inp = inputRef.current
      const v = vehicleInstanceRef.current

      if (v) {
        // --- DRIVING PHYSICS ---
        const maxForwardSpeed = 31 // ~110 KM/H
        const maxReverseSpeed = -7 // ~25 KM/H
        const accelRate = 7.5 // Heavy vehicle acceleration
        const brakeRate = 18.0 // Air brakes
        const dragRate = 2.2 // Natural friction / wind drag

        // Acceleration / Braking
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

        // Natural Drag (injini ikiachwa bila mafuta)
        if (!inp.throttle && !inp.brake) {
          if (p.speed > 0) {
            p.speed = Math.max(0, p.speed - dragRate * dt)
          } else if (p.speed < 0) {
            p.speed = Math.min(0, p.speed + dragRate * dt)
          }
        }

        // Steering Physics & Smooth Centering
        const targetSteerAngle = inp.steer * 0.52 // Max 30 degrees
        p.steerAngle += (targetSteerAngle - p.steerAngle) * Math.min(dt * 7, 1)

        // Turn wheels mesh
        v.steerWheels.forEach(sw => {
          sw.rotation.y = -p.steerAngle
        })

        // Vehicle Heading & Position
        if (Math.abs(p.speed) > 0.1) {
          const turnMultiplier = 0.55
          p.heading += p.steerAngle * (p.speed / 10) * turnMultiplier * dt
          p.heading = Math.max(-0.25, Math.min(0.25, p.heading)) // Weka gari lisiende mrama kupita kiasi
        }

        // Sogeza gari mbele na pembeni kulingana na usukani
        const forwardVel = p.speed * Math.cos(p.heading)
        const lateralVel = p.speed * Math.sin(p.heading)

        p.z += forwardVel * dt
        p.x = Math.max(-5.0, Math.min(5.0, p.x + lateralVel * dt)) // Road boundaries

        // Update 3D Model
        v.group.position.set(p.x, 0, p.z)
        v.group.rotation.y = p.heading

        // Wheel Rotation (Mzunguko wa matairi)
        const wheelRotSpeed = p.speed / 0.55 // v = w * r
        v.wheels.forEach(w => {
          w.rotation.x += wheelRotSpeed * dt
        })

        // Sauti ya Injini
        const currentKmH = p.speed * 3.6
        sounds.updateEngine(currentKmH, inp.throttle)
        setSpeedKmH(currentKmH)

        // World Road Chunks Update
        world.update(p.z)

        // Camera Positioning
        if (cameraMode === 'cockpit') {
          // Driver's eye view inside cabin
          const eyePos = v.cabinPos.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), p.heading)
          eyePos.add(v.group.position)
          camera.position.copy(eyePos)

          const lookTarget = eyePos.clone().add(
            new THREE.Vector3(Math.sin(p.heading), -0.05, Math.cos(p.heading)).multiplyScalar(30)
          )
          camera.lookAt(lookTarget)
        } else {
          // Chase camera (Behind the vehicle)
          const offset = v.chaseOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), p.heading)
          const targetCamPos = v.group.position.clone().add(offset)
          camera.position.lerp(targetCamPos, 0.1)

          const lookTarget = v.group.position.clone().add(new THREE.Vector3(0, 2.0, 6.0))
          camera.lookAt(lookTarget)
        }

        // Headlights toggling
        v.headlights.forEach(hl => {
          hl.visible = headlightsOn
        })

        // Umbali uliotembelewa (Distance calculation & saving)
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

    // Cleanup
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
  }, [vehicleType, cameraMode, gear, headlightsOn])

  // Horn Click Trigger
  const handleHorn = () => {
    sounds.startEngine()
    sounds.playHorn()
  }

  // First Touch Audio Activation
  const handleStartAudio = () => {
    sounds.startEngine()
  }

  return (
    <div
      onClick={handleStartAudio}
      onTouchStart={handleStartAudio}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#0f172a'
      }}
    >
      {/* Three.js Canvas Container */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Mobile Touch & HUD Controls */}
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
      />
    </div>
  )
}
