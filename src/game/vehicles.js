import * as THREE from 'three'

// Vifaa vya rangi na maumbo (Materials)
export function createMaterials() {
  return {
    truckBody: new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Sky Blue
      metalness: 0.6,
      roughness: 0.3
    }),
    busBody: new THREE.MeshStandardMaterial({
      color: 0xe11d48, // Crimson Red Luxury Bus
      metalness: 0.5,
      roughness: 0.35
    }),
    trailerBody: new THREE.MeshStandardMaterial({
      color: 0x334155, // Slate Gray Container
      metalness: 0.2,
      roughness: 0.6
    }),
    chassis: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.5
    }),
    chrome: new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.95,
      roughness: 0.1
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.6,
      transparent: true,
      opacity: 0.7
    }),
    rubber: new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.9
    }),
    wheelRim: new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.8,
      roughness: 0.2
    }),
    headlightOn: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    taillightOn: new THREE.MeshBasicMaterial({ color: 0xff0033 }),
    amberLight: new THREE.MeshBasicMaterial({ color: 0xf59e0b })
  }
}

// Gurudumu (Tire + Rim)
function createWheel(materials, radius = 0.55, width = 0.35) {
  const wheelGroup = new THREE.Group()

  // Tire rubber
  const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 18)
  tireGeo.rotateZ(Math.PI / 2)
  const tire = new THREE.Mesh(tireGeo, materials.rubber)
  tire.castShadow = true
  wheelGroup.add(tire)

  // Rim chrome/steel
  const rimGeo = new THREE.CylinderGeometry(radius * 0.62, radius * 0.62, width * 1.02, 12)
  rimGeo.rotateZ(Math.PI / 2)
  const rim = new THREE.Mesh(rimGeo, materials.wheelRim)
  wheelGroup.add(rim)

  // Hub cap center
  const hubGeo = new THREE.CylinderGeometry(radius * 0.25, radius * 0.25, width * 1.05, 8)
  hubGeo.rotateZ(Math.PI / 2)
  const hub = new THREE.Mesh(hubGeo, materials.chrome)
  wheelGroup.add(hub)

  return wheelGroup
}

// 1. UJENZI WA LORI LA MIZIGO (TRUCK + TRAILER)
export function buildTruck(materials) {
  const truck = new THREE.Group()
  const wheels = []
  const steerWheels = []

  // --- CABIN (Kichwa cha Lori) ---
  const cabGroup = new THREE.Group()

  // Main cab body
  const cabGeo = new THREE.BoxGeometry(2.4, 2.6, 2.5)
  const cabMesh = new THREE.Mesh(cabGeo, materials.truckBody)
  cabMesh.position.set(0, 2.2, 1.8)
  cabMesh.castShadow = true
  cabGroup.add(cabMesh)

  // Front Windshield
  const windGeo = new THREE.BoxGeometry(2.2, 1.1, 0.1)
  const windshield = new THREE.Mesh(windGeo, materials.glass)
  windshield.position.set(0, 2.7, 3.06)
  cabGroup.add(windshield)

  // Side Windows
  const sideWinGeo = new THREE.BoxGeometry(0.1, 0.9, 1.2)
  const leftWin = new THREE.Mesh(sideWinGeo, materials.glass)
  leftWin.position.set(-1.21, 2.7, 2.1)
  const rightWin = new THREE.Mesh(sideWinGeo, materials.glass)
  rightWin.position.set(1.21, 2.7, 2.1)
  cabGroup.add(leftWin, rightWin)

  // Front Radiator Grille
  const grilleGeo = new THREE.BoxGeometry(1.8, 1.2, 0.15)
  const grille = new THREE.Mesh(grilleGeo, materials.chrome)
  grille.position.set(0, 1.5, 3.06)
  cabGroup.add(grille)

  // Front Bumper
  const bumperGeo = new THREE.BoxGeometry(2.5, 0.45, 0.3)
  const bumper = new THREE.Mesh(bumperGeo, materials.chassis)
  bumper.position.set(0, 0.8, 3.05)
  bumper.castShadow = true
  cabGroup.add(bumper)

  // Headlights
  const lightGeo = new THREE.BoxGeometry(0.4, 0.25, 0.1)
  const leftLight = new THREE.Mesh(lightGeo, materials.headlightOn)
  leftLight.position.set(-0.85, 0.85, 3.2)
  const rightLight = new THREE.Mesh(lightGeo, materials.headlightOn)
  rightLight.position.set(0.85, 0.85, 3.2)
  cabGroup.add(leftLight, rightLight)

  // Spotlight sources
  const leftSpot = new THREE.SpotLight(0xfff5db, 5, 60, Math.PI / 6, 0.4)
  leftSpot.position.set(-0.85, 0.9, 3.2)
  leftSpot.target.position.set(-0.85, 0, 30)
  const rightSpot = new THREE.SpotLight(0xfff5db, 5, 60, Math.PI / 6, 0.4)
  rightSpot.position.set(0.85, 0.9, 3.2)
  rightSpot.target.position.set(0.85, 0, 30)
  cabGroup.add(leftSpot, rightSpot, leftSpot.target, rightSpot.target)

  // Side mirrors
  const mirrorArmGeo = new THREE.BoxGeometry(0.3, 0.05, 0.05)
  const mirrorGeo = new THREE.BoxGeometry(0.08, 0.45, 0.15)

  const leftMirror = new THREE.Mesh(mirrorGeo, materials.chrome)
  leftMirror.position.set(-1.45, 2.6, 2.7)
  const rightMirror = new THREE.Mesh(mirrorGeo, materials.chrome)
  rightMirror.position.set(1.45, 2.6, 2.7)
  cabGroup.add(leftMirror, rightMirror)

  // Dual Exhaust Stacks (Mirija ya moshi)
  const exhaustGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.8, 10)
  const leftExhaust = new THREE.Mesh(exhaustGeo, materials.chrome)
  leftExhaust.position.set(-1.1, 2.8, 0.5)
  const rightExhaust = new THREE.Mesh(exhaustGeo, materials.chrome)
  rightExhaust.position.set(1.1, 2.8, 0.5)
  cabGroup.add(leftExhaust, rightExhaust)

  // Roof Air Deflector (Spoiler)
  const spoilerGeo = new THREE.BoxGeometry(2.3, 0.5, 1.6)
  const spoiler = new THREE.Mesh(spoilerGeo, materials.truckBody)
  spoiler.position.set(0, 3.65, 1.7)
  cabGroup.add(spoiler)

  truck.add(cabGroup)

  // --- CHASSIS (Fremu ya Chini) ---
  const frameGeo = new THREE.BoxGeometry(1.2, 0.3, 8.5)
  const frame = new THREE.Mesh(frameGeo, materials.chassis)
  frame.position.set(0, 0.8, -1.2)
  frame.castShadow = true
  truck.add(frame)

  // Fuel Tanks (Matangi ya mafuta)
  const tankGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.8, 12)
  tankGeo.rotateX(Math.PI / 2)
  const leftTank = new THREE.Mesh(tankGeo, materials.chrome)
  leftTank.position.set(-1.0, 0.75, 0.3)
  const rightTank = new THREE.Mesh(tankGeo, materials.chrome)
  rightTank.position.set(1.0, 0.75, 0.3)
  truck.add(leftTank, rightTank)

  // --- CARGO CONTAINER TRAILER (Trela ya Kontena) ---
  const trailerGroup = new THREE.Group()

  // Container Body
  const containerGeo = new THREE.BoxGeometry(2.4, 2.7, 7.8)
  const container = new THREE.Mesh(containerGeo, materials.trailerBody)
  container.position.set(0, 2.6, -3.2)
  container.castShadow = true
  trailerGroup.add(container)

  // Container details (Roof ribs / Door frame)
  const doorGeo = new THREE.BoxGeometry(2.3, 2.5, 0.1)
  const doors = new THREE.Mesh(doorGeo, materials.chassis)
  doors.position.set(0, 2.6, -7.15)
  trailerGroup.add(doors)

  // Rear bumper & tail lights
  const rBumperGeo = new THREE.BoxGeometry(2.4, 0.3, 0.2)
  const rBumper = new THREE.Mesh(rBumperGeo, materials.chassis)
  rBumper.position.set(0, 0.8, -7.15)
  trailerGroup.add(rBumper)

  const rLightGeo = new THREE.BoxGeometry(0.5, 0.18, 0.05)
  const leftRLight = new THREE.Mesh(rLightGeo, materials.taillightOn)
  leftRLight.position.set(-0.85, 0.85, -7.26)
  const rightRLight = new THREE.Mesh(rLightGeo, materials.taillightOn)
  rightRLight.position.set(0.85, 0.85, -7.26)
  trailerGroup.add(leftRLight, rightRLight)

  truck.add(trailerGroup)

  // --- MAGURUDUMU (WHEELS) ---
  // Front steering wheels (Z = +2.1)
  const frontLeftWheel = createWheel(materials)
  frontLeftWheel.position.set(-1.15, 0.55, 2.1)
  const frontRightWheel = createWheel(materials)
  frontRightWheel.position.set(1.15, 0.55, 2.1)

  const steerLeftGroup = new THREE.Group()
  steerLeftGroup.position.copy(frontLeftWheel.position)
  frontLeftWheel.position.set(0, 0, 0)
  steerLeftGroup.add(frontLeftWheel)

  const steerRightGroup = new THREE.Group()
  steerRightGroup.position.copy(frontRightWheel.position)
  frontRightWheel.position.set(0, 0, 0)
  steerRightGroup.add(frontRightWheel)

  truck.add(steerLeftGroup, steerRightGroup)
  steerWheels.push(steerLeftGroup, steerRightGroup)
  wheels.push(frontLeftWheel, frontRightWheel)

  // Rear Truck Wheels (Z = -0.9)
  const rT1 = createWheel(materials)
  rT1.position.set(-1.15, 0.55, -0.9)
  const rT2 = createWheel(materials)
  rT2.position.set(1.15, 0.55, -0.9)
  truck.add(rT1, rT2)
  wheels.push(rT1, rT2)

  // Trailer Tandem Wheels (Z = -5.0 and -6.2)
  const tr1 = createWheel(materials)
  tr1.position.set(-1.15, 0.55, -5.0)
  const tr2 = createWheel(materials)
  tr2.position.set(1.15, 0.55, -5.0)
  const tr3 = createWheel(materials)
  tr3.position.set(-1.15, 0.55, -6.2)
  const tr4 = createWheel(materials)
  tr4.position.set(1.15, 0.55, -6.2)
  truck.add(tr1, tr2, tr3, tr4)
  wheels.push(tr1, tr2, tr3, tr4)

  return {
    group: truck,
    wheels,
    steerWheels,
    headlights: [leftSpot, rightSpot],
    cabinPos: new THREE.Vector3(0, 2.4, 2.0), // Nafasi ya dereva
    chaseOffset: new THREE.Vector3(0, 5.0, -11.0)
  }
}

// 2. UJENZI WA BASI LA ABIRIA (LUXURY COACH BUS)
export function buildBus(materials) {
  const bus = new THREE.Group()
  const wheels = []
  const steerWheels = []

  // Main Bus Body
  const bodyGeo = new THREE.BoxGeometry(2.5, 3.1, 10.5)
  const bodyMesh = new THREE.Mesh(bodyGeo, materials.busBody)
  bodyMesh.position.set(0, 2.1, 0)
  bodyMesh.castShadow = true
  bus.add(bodyMesh)

  // Front Windshield (Panoramic)
  const windGeo = new THREE.BoxGeometry(2.35, 1.8, 0.1)
  const windshield = new THREE.Mesh(windGeo, materials.glass)
  windshield.position.set(0, 2.3, 5.26)
  bus.add(windshield)

  // Destination Board (Kibao cha safari juu ya kioo)
  const destGeo = new THREE.BoxGeometry(1.9, 0.4, 0.12)
  const destBoard = new THREE.Mesh(destGeo, materials.headlightOn)
  destBoard.position.set(0, 3.3, 5.27)
  bus.add(destBoard)

  // Side Passenger Windows (Mabati ya vioo pande zote mbili)
  const sideWindowGeo = new THREE.BoxGeometry(0.1, 1.1, 8.2)
  const leftWindows = new THREE.Mesh(sideWindowGeo, materials.glass)
  leftWindows.position.set(-1.26, 2.5, -0.4)
  const rightWindows = new THREE.Mesh(sideWindowGeo, materials.glass)
  rightWindows.position.set(1.26, 2.5, -0.4)
  bus.add(leftWindows, rightWindows)

  // AC Unit on Roof
  const acGeo = new THREE.BoxGeometry(1.6, 0.35, 3.2)
  const acUnit = new THREE.Mesh(acGeo, materials.chrome)
  acUnit.position.set(0, 3.8, 0)
  bus.add(acUnit)

  // Front Bumper & Headlights
  const bumperGeo = new THREE.BoxGeometry(2.5, 0.5, 0.2)
  const bumper = new THREE.Mesh(bumperGeo, materials.chassis)
  bumper.position.set(0, 0.8, 5.26)
  bus.add(bumper)

  const lightGeo = new THREE.BoxGeometry(0.4, 0.25, 0.1)
  const leftLight = new THREE.Mesh(lightGeo, materials.headlightOn)
  leftLight.position.set(-0.85, 0.85, 5.37)
  const rightLight = new THREE.Mesh(lightGeo, materials.headlightOn)
  rightLight.position.set(0.85, 0.85, 5.37)
  bus.add(leftLight, rightLight)

  // Spotlights
  const leftSpot = new THREE.SpotLight(0xfff5db, 5, 60, Math.PI / 6, 0.4)
  leftSpot.position.set(-0.85, 0.9, 5.37)
  leftSpot.target.position.set(-0.85, 0, 35)
  const rightSpot = new THREE.SpotLight(0xfff5db, 5, 60, Math.PI / 6, 0.4)
  rightSpot.position.set(0.85, 0.9, 5.37)
  rightSpot.target.position.set(0.85, 0, 35)
  bus.add(leftSpot, rightSpot, leftSpot.target, rightSpot.target)

  // Rear Engine Grille and Taillights
  const rGrilleGeo = new THREE.BoxGeometry(1.8, 0.9, 0.1)
  const rGrille = new THREE.Mesh(rGrilleGeo, materials.chassis)
  rGrille.position.set(0, 1.2, -5.26)
  bus.add(rGrille)

  const rLightGeo = new THREE.BoxGeometry(0.2, 0.7, 0.1)
  const leftRLight = new THREE.Mesh(rLightGeo, materials.taillightOn)
  leftRLight.position.set(-1.0, 1.8, -5.26)
  const rightRLight = new THREE.Mesh(rLightGeo, materials.taillightOn)
  rightRLight.position.set(1.0, 1.8, -5.26)
  bus.add(leftRLight, rightRLight)

  // Magurudumu ya Basi
  // Front Steering
  const fL = createWheel(materials)
  const fR = createWheel(materials)
  const steerL = new THREE.Group()
  steerL.position.set(-1.18, 0.55, 3.8)
  steerL.add(fL)
  const steerR = new THREE.Group()
  steerR.position.set(1.18, 0.55, 3.8)
  steerR.add(fR)

  bus.add(steerL, steerR)
  steerWheels.push(steerL, steerR)
  wheels.push(fL, fR)

  // Rear Axles
  const r1L = createWheel(materials)
  r1L.position.set(-1.18, 0.55, -2.6)
  const r1R = createWheel(materials)
  r1R.position.set(1.18, 0.55, -2.6)

  const r2L = createWheel(materials)
  r2L.position.set(-1.18, 0.55, -3.8)
  const r2R = createWheel(materials)
  r2R.position.set(1.18, 0.55, -3.8)

  bus.add(r1L, r1R, r2L, r2R)
  wheels.push(r1L, r1R, r2L, r2R)

  return {
    group: bus,
    wheels,
    steerWheels,
    headlights: [leftSpot, rightSpot],
    cabinPos: new THREE.Vector3(0, 2.3, 4.4), // Nafasi ya dereva wa basi
    chaseOffset: new THREE.Vector3(0, 5.5, -12.0)
  }
}
