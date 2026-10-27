import * as THREE from 'three'

// --- TEXTURE GENERATORS (CANVAS PROCEDURAL TEXTURES) ---

// 1. Texture ya Kibao cha Basi (LED Destination Sign)
function createBusSignTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#050505'
  ctx.fillRect(0, 0, 512, 128)

  // Glowing Orange/Amber LED text
  ctx.fillStyle = '#f59e0b'
  ctx.font = 'bold 36px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = '#f59e0b'
  ctx.shadowBlur = 12
  ctx.fillText('DAR ➔ MOROGORO ➔ ARUSHA', 256, 48)

  ctx.fillStyle = '#fbbf24'
  ctx.font = 'bold 24px sans-serif'
  ctx.fillText('★ KILIMANJARO EXPRESS VIP ★', 256, 92)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 8
  return texture
}

// 2. Texture ya Sunvisor ya Lori ("KAZI KWANZA / TANZANIA EXPRESS")
function createTruckVisorTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, 512, 128)

  // Border ya bendera ya Tanzania
  ctx.fillStyle = '#16a34a' // Kijani
  ctx.fillRect(0, 0, 512, 20)
  ctx.fillStyle = '#facc15' // Njano
  ctx.fillRect(0, 20, 512, 12)
  ctx.fillStyle = '#0284c7' // Bluu
  ctx.fillRect(0, 100, 512, 28)

  // Maandishi ya Kitanzania
  ctx.fillStyle = '#ffffff'
  ctx.font = '900 42px "Arial Black", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = '#000000'
  ctx.shadowBlur = 8
  ctx.fillText('KAZI KWANZA', 256, 62)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 8
  return texture
}

// 3. Texture ya Mudflap ("HAPA KAZI TU")
function createMudflapTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#111827'
  ctx.fillRect(0, 0, 256, 128)

  ctx.strokeStyle = '#eab308'
  ctx.lineWidth = 6
  ctx.strokeRect(6, 6, 244, 116)

  ctx.fillStyle = '#fef08a'
  ctx.font = '900 28px "Arial Black", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('HAPA KAZI TU', 128, 64)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

// 4. Texture ya Kontena la Trela (Shipping Container Ribs)
function createContainerTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(0, 0, 512, 512)

  // Vertical Corrugated Ribs (Mistari ya Kontena)
  for (let x = 0; x < 512; x += 16) {
    ctx.fillStyle = '#334155'
    ctx.fillRect(x, 0, 8, 512)
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(x + 8, 0, 8, 512)
  }

  // Nembo ya Mizigo ya Tanzania
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.font = 'bold 36px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('TANZANIA TRANSIT', 256, 200)

  ctx.fillStyle = 'rgba(250, 204, 21, 0.9)'
  ctx.font = 'bold 24px sans-serif'
  ctx.fillText('40FT HIGH CUBE CONTAINER', 256, 250)

  // Hazard Stripes Chini
  for (let x = 0; x < 512; x += 32) {
    ctx.fillStyle = '#f59e0b'
    ctx.fillRect(x, 480, 16, 32)
    ctx.fillStyle = '#000000'
    ctx.fillRect(x + 16, 480, 16, 32)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 8
  return texture
}

// --- MATERIALS YA HALI YA JUU (HIGH QUALITY PBR) ---
export function createMaterials() {
  const visorTex = createTruckVisorTexture()
  const mudflapTex = createMudflapTexture()
  const containerTex = createContainerTexture()
  const busSignTex = createBusSignTexture()

  return {
    truckCab: new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Metallic Sapphire Blue
      metalness: 0.7,
      roughness: 0.25,
      envMapIntensity: 1.2
    }),
    truckCabAccent: new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber Gold Accents
      metalness: 0.6,
      roughness: 0.3
    }),
    visorMat: new THREE.MeshBasicMaterial({ map: visorTex }),
    mudflapMat: new THREE.MeshBasicMaterial({ map: mudflapTex }),
    containerMat: new THREE.MeshStandardMaterial({
      map: containerTex,
      metalness: 0.3,
      roughness: 0.6
    }),
    busBody: new THREE.MeshStandardMaterial({
      color: 0xd97706, // Safari Sunset Gold-Orange Luxury Bus
      metalness: 0.6,
      roughness: 0.25
    }),
    busSignMat: new THREE.MeshBasicMaterial({ map: busSignTex }),
    chassis: new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.85,
      roughness: 0.4
    }),
    chrome: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.98,
      roughness: 0.08
    }),
    darkGlass: new THREE.MeshPhysicalMaterial({
      color: 0x090d16,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.8
    }),
    headlightGlass: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfffbeb,
      emissiveIntensity: 1.5,
      roughness: 0.1
    }),
    taillightGlass: new THREE.MeshStandardMaterial({
      color: 0xff0022,
      emissive: 0xff0022,
      emissiveIntensity: 1.2
    }),
    tireRubber: new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.88
    }),
    alloyRim: new THREE.MeshStandardMaterial({
      color: 0xe4e4e7,
      metalness: 0.9,
      roughness: 0.18
    }),
    smokeParticle: new THREE.MeshBasicMaterial({
      color: 0x475569,
      transparent: true,
      opacity: 0.35
    })
  }
}

// Gurudumu la Kisasa (HD Alloy Wheel)
function createHDWheel(materials, radius = 0.58, width = 0.38) {
  const wheelGroup = new THREE.Group()

  // Rubber Tire
  const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 24)
  tireGeo.rotateZ(Math.PI / 2)
  const tire = new THREE.Mesh(tireGeo, materials.tireRubber)
  tire.castShadow = true
  wheelGroup.add(tire)

  // Alloy Rim
  const rimGeo = new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, width * 1.02, 16)
  rimGeo.rotateZ(Math.PI / 2)
  const rim = new THREE.Mesh(rimGeo, materials.alloyRim)
  wheelGroup.add(rim)

  // Chrome Center Hub & Bolts
  const hubGeo = new THREE.CylinderGeometry(radius * 0.28, radius * 0.28, width * 1.08, 10)
  hubGeo.rotateZ(Math.PI / 2)
  const hub = new THREE.Mesh(hubGeo, materials.chrome)
  wheelGroup.add(hub)

  // Brake Disc inside rim
  const discGeo = new THREE.CylinderGeometry(radius * 0.45, radius * 0.45, width * 0.5, 12)
  discGeo.rotateZ(Math.PI / 2)
  const disc = new THREE.Mesh(discGeo, materials.chassis)
  wheelGroup.add(disc)

  return wheelGroup
}

// =================================================================
// 1. UJENZI WA LORI LA TANZANIA (SCANIA V8 + CONTENA LA TRELA)
// =================================================================
export function buildTruck(materials) {
  const truck = new THREE.Group()
  const wheels = []
  const steerWheels = []
  const smokeParticles = []

  // --- CABIN YA SCANIA ---
  const cabGroup = new THREE.Group()

  // Main Cab Body
  const cabGeo = new THREE.BoxGeometry(2.5, 2.7, 2.6)
  const cabMesh = new THREE.Mesh(cabGeo, materials.truckCab)
  cabMesh.position.set(0, 2.3, 1.8)
  cabMesh.castShadow = true
  cabGroup.add(cabMesh)

  // Front Windshield
  const windGeo = new THREE.BoxGeometry(2.35, 1.25, 0.1)
  const windshield = new THREE.Mesh(windGeo, materials.darkGlass)
  windshield.position.set(0, 2.75, 3.12)
  cabGroup.add(windshield)

  // Kioo cha Juu cha "KAZI KWANZA" (Sunvisor Decal)
  const visorGeo = new THREE.BoxGeometry(2.4, 0.35, 0.15)
  const visor = new THREE.Mesh(visorGeo, materials.visorMat)
  visor.position.set(0, 3.55, 3.16)
  cabGroup.add(visor)

  // Side Windows (Vioo vya pembeni)
  const sideWinGeo = new THREE.BoxGeometry(0.08, 1.0, 1.3)
  const leftWin = new THREE.Mesh(sideWinGeo, materials.darkGlass)
  leftWin.position.set(-1.27, 2.75, 2.1)
  const rightWin = new THREE.Mesh(sideWinGeo, materials.darkGlass)
  rightWin.position.set(1.27, 2.75, 2.1)
  cabGroup.add(leftWin, rightWin)

  // Front Chrome Grille (Scania Grille)
  const grilleGeo = new THREE.BoxGeometry(1.9, 1.35, 0.18)
  const grille = new THREE.Mesh(grilleGeo, materials.chassis)
  grille.position.set(0, 1.55, 3.12)
  cabGroup.add(grille)

  // Chrome Grille Horizontal Bars
  for (let i = 0; i < 4; i++) {
    const barGeo = new THREE.BoxGeometry(1.8, 0.08, 0.22)
    const bar = new THREE.Mesh(barGeo, materials.chrome)
    bar.position.set(0, 1.25 + i * 0.24, 3.13)
    cabGroup.add(bar)
  }

  // Front Heavy Duty Bumper
  const bumperGeo = new THREE.BoxGeometry(2.6, 0.55, 0.35)
  const bumper = new THREE.Mesh(bumperGeo, materials.chassis)
  bumper.position.set(0, 0.8, 3.15)
  bumper.castShadow = true
  cabGroup.add(bumper)

  // Headlights na Spotlights
  const lightBezelGeo = new THREE.BoxGeometry(0.5, 0.28, 0.1)
  const leftBezel = new THREE.Mesh(lightBezelGeo, materials.headlightGlass)
  leftBezel.position.set(-0.9, 0.85, 3.32)
  const rightBezel = new THREE.Mesh(lightBezelGeo, materials.headlightGlass)
  rightBezel.position.set(0.9, 0.85, 3.32)
  cabGroup.add(leftBezel, rightBezel)

  // Powerful Spotlights (Kwenye barabara ya 3D)
  const leftSpot = new THREE.SpotLight(0xfff8db, 7.5, 80, Math.PI / 5, 0.35)
  leftSpot.position.set(-0.9, 0.9, 3.35)
  leftSpot.target.position.set(-0.9, 0, 45)
  const rightSpot = new THREE.SpotLight(0xfff8db, 7.5, 80, Math.PI / 5, 0.35)
  rightSpot.position.set(0.9, 0.9, 3.35)
  rightSpot.target.position.set(0.9, 0, 45)
  cabGroup.add(leftSpot, rightSpot, leftSpot.target, rightSpot.target)

  // Side Mirrors (Vioo vya kuangalia nyuma)
  const mirrorGeo = new THREE.BoxGeometry(0.1, 0.55, 0.2)
  const leftMirror = new THREE.Mesh(mirrorGeo, materials.chrome)
  leftMirror.position.set(-1.48, 2.7, 2.8)
  const rightMirror = new THREE.Mesh(mirrorGeo, materials.chrome)
  rightMirror.position.set(1.48, 2.7, 2.8)
  cabGroup.add(leftMirror, rightMirror)

  // Twin Chrome Air Horns Juu ya Dari
  const hornGeo = new THREE.CylinderGeometry(0.06, 0.03, 0.9, 8)
  hornGeo.rotateX(Math.PI / 2)
  const leftHorn = new THREE.Mesh(hornGeo, materials.chrome)
  leftHorn.position.set(-0.6, 3.82, 2.0)
  const rightHorn = new THREE.Mesh(hornGeo, materials.chrome)
  rightHorn.position.set(0.6, 3.82, 2.0)
  cabGroup.add(leftHorn, rightHorn)

  // Twin Vertical Chrome Exhaust Stacks (Mirija ya Moshi)
  const pipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.2, 12)
  const leftPipe = new THREE.Mesh(pipeGeo, materials.chrome)
  leftPipe.position.set(-1.18, 3.0, 0.4)
  const rightPipe = new THREE.Mesh(pipeGeo, materials.chrome)
  rightPipe.position.set(1.18, 3.0, 0.4)
  cabGroup.add(leftPipe, rightPipe)

  // Roof Wind Deflector (Aerodynamic Spoiler)
  const spoilerGeo = new THREE.BoxGeometry(2.4, 0.55, 1.8)
  const spoiler = new THREE.Mesh(spoilerGeo, materials.truckCab)
  spoiler.position.set(0, 3.8, 1.6)
  cabGroup.add(spoiler)

  truck.add(cabGroup)

  // --- CHASSIS & DIESEL TANKS ---
  const frameGeo = new THREE.BoxGeometry(1.2, 0.35, 9.2)
  const frame = new THREE.Mesh(frameGeo, materials.chassis)
  frame.position.set(0, 0.85, -1.4)
  frame.castShadow = true
  truck.add(frame)

  // Matangi Mawili ya Mafuta ya Chuma (Aluminium Tanks)
  const tankGeo = new THREE.CylinderGeometry(0.38, 0.38, 2.2, 16)
  tankGeo.rotateX(Math.PI / 2)
  const leftTank = new THREE.Mesh(tankGeo, materials.chrome)
  leftTank.position.set(-1.08, 0.8, 0.2)
  const rightTank = new THREE.Mesh(tankGeo, materials.chrome)
  rightTank.position.set(1.08, 0.8, 0.2)
  truck.add(leftTank, rightTank)

  // --- TRELA YA KONTENA (40FT SHIPPING CONTAINER) ---
  const trailerGroup = new THREE.Group()

  // Container Body yenye textures za ribbing na chata za Tanzania
  const containerGeo = new THREE.BoxGeometry(2.5, 2.8, 8.4)
  const container = new THREE.Mesh(containerGeo, materials.containerMat)
  container.position.set(0, 2.7, -3.5)
  container.castShadow = true
  trailerGroup.add(container)

  // Rear Heavy Bumper & Mudflap ("HAPA KAZI TU")
  const rBumperGeo = new THREE.BoxGeometry(2.5, 0.35, 0.25)
  const rBumper = new THREE.Mesh(rBumperGeo, materials.chassis)
  rBumper.position.set(0, 0.85, -7.72)
  trailerGroup.add(rBumper)

  const flapGeo = new THREE.BoxGeometry(2.2, 0.45, 0.05)
  const flap = new THREE.Mesh(flapGeo, materials.mudflapMat)
  flap.position.set(0, 0.45, -7.74)
  trailerGroup.add(flap)

  // LED Taillights
  const tailGeo = new THREE.BoxGeometry(0.5, 0.2, 0.08)
  const leftTail = new THREE.Mesh(tailGeo, materials.taillightGlass)
  leftTail.position.set(-0.9, 0.9, -7.86)
  const rightTail = new THREE.Mesh(tailGeo, materials.taillightGlass)
  rightTail.position.set(0.9, 0.9, -7.86)
  trailerGroup.add(leftTail, rightTail)

  truck.add(trailerGroup)

  // --- MAGURUDUMU YA HD (WHEELS SETUP) ---
  // Magurudumu ya mbele yanayogeuka (Steerable front axle)
  const fL = createHDWheel(materials)
  const fR = createHDWheel(materials)

  const steerL = new THREE.Group()
  steerL.position.set(-1.22, 0.58, 2.1)
  steerL.add(fL)

  const steerR = new THREE.Group()
  steerR.position.set(1.22, 0.58, 2.1)
  steerR.add(fR)

  truck.add(steerL, steerR)
  steerWheels.push(steerL, steerR)
  wheels.push(fL, fR)

  // Magurudumu ya Lori ya Nyuma (Tandem drive)
  const r1L = createHDWheel(materials)
  r1L.position.set(-1.22, 0.58, -0.7)
  const r1R = createHDWheel(materials)
  r1R.position.set(1.22, 0.58, -0.7)
  truck.add(r1L, r1R)
  wheels.push(r1L, r1R)

  // Magurudumu ya Trela (Triple Axle Heavy Trailer)
  const trPositions = [-4.6, -5.8, -7.0]
  trPositions.forEach(zPos => {
    const wL = createHDWheel(materials)
    wL.position.set(-1.22, 0.58, zPos)
    const wR = createHDWheel(materials)
    wR.position.set(1.22, 0.58, zPos)
    truck.add(wL, wR)
    wheels.push(wL, wR)
  })

  // Moshi wa Exhaust (Smoke Particle Nodes)
  for (let i = 0; i < 8; i++) {
    const puffGeo = new THREE.SphereGeometry(0.12, 6, 6)
    const puff = new THREE.Mesh(puffGeo, materials.smokeParticle)
    puff.position.set(-1.18, 4.6, 0.4)
    puff.visible = false
    truck.add(puff)
    smokeParticles.push(puff)
  }

  return {
    group: truck,
    wheels,
    steerWheels,
    smokeParticles,
    headlights: [leftSpot, rightSpot],
    cabinPos: new THREE.Vector3(-0.4, 2.5, 2.2),
    chaseOffset: new THREE.Vector3(0, 5.2, -12.5)
  }
}

// =================================================================
// 2. UJENZI WA BASI LA KISASA LA ABIRIA (MARCOPOLO VIP COACH)
// =================================================================
export function buildBus(materials) {
  const bus = new THREE.Group()
  const wheels = []
  const steerWheels = []

  // Main Bus High-Deck Aerodynamic Body
  const bodyGeo = new THREE.BoxGeometry(2.6, 3.2, 11.2)
  const bodyMesh = new THREE.Mesh(bodyGeo, materials.busBody)
  bodyMesh.position.set(0, 2.2, 0)
  bodyMesh.castShadow = true
  bus.add(bodyMesh)

  // Kibao Kikubwa cha Njia chenye Mwanga wa LED ("DAR ➔ ARUSHA")
  const signGeo = new THREE.BoxGeometry(2.3, 0.45, 0.12)
  const signMesh = new THREE.Mesh(signGeo, materials.busSignMat)
  signMesh.position.set(0, 3.42, 5.61)
  bus.add(signMesh)

  // Kioo Kikubwa cha Mbele (Panoramic Windshield)
  const windGeo = new THREE.BoxGeometry(2.45, 1.9, 0.12)
  const windshield = new THREE.Mesh(windGeo, materials.darkGlass)
  windshield.position.set(0, 2.3, 5.6)
  bus.add(windshield)

  // Vioo vya Abiria vya Pembeni (Panoramic Tinted Side Glazing)
  const sideGlassGeo = new THREE.BoxGeometry(0.1, 1.25, 9.2)
  const leftGlass = new THREE.Mesh(sideGlassGeo, materials.darkGlass)
  leftGlass.position.set(-1.31, 2.65, -0.4)
  const rightGlass = new THREE.Mesh(sideGlassGeo, materials.darkGlass)
  rightGlass.position.set(1.31, 2.65, -0.4)
  bus.add(leftGlass, rightGlass)

  // AC Unit & Rooftop Aerodynamics
  const acGeo = new THREE.BoxGeometry(1.8, 0.4, 3.6)
  const acMesh = new THREE.Mesh(acGeo, materials.chrome)
  acMesh.position.set(0, 3.95, 0.2)
  bus.add(acMesh)

  // Front Heavy Bumper & Fog Lights
  const bumperGeo = new THREE.BoxGeometry(2.65, 0.6, 0.25)
  const bumper = new THREE.Mesh(bumperGeo, materials.chassis)
  bumper.position.set(0, 0.85, 5.62)
  bus.add(bumper)

  // LED Projector Headlights
  const lightGeo = new THREE.BoxGeometry(0.45, 0.28, 0.1)
  const leftLight = new THREE.Mesh(lightGeo, materials.headlightGlass)
  leftLight.position.set(-0.95, 0.95, 5.75)
  const rightLight = new THREE.Mesh(lightGeo, materials.headlightGlass)
  rightLight.position.set(0.95, 0.95, 5.75)
  bus.add(leftLight, rightLight)

  // Powerful Spotlights
  const leftSpot = new THREE.SpotLight(0xfff8db, 7.5, 80, Math.PI / 5, 0.35)
  leftSpot.position.set(-0.95, 0.95, 5.76)
  leftSpot.target.position.set(-0.95, 0, 45)
  const rightSpot = new THREE.SpotLight(0xfff8db, 7.5, 80, Math.PI / 5, 0.35)
  rightSpot.position.set(0.95, 0.95, 5.76)
  rightSpot.target.position.set(0.95, 0, 45)
  bus.add(leftSpot, rightSpot, leftSpot.target, rightSpot.target)

  // Rear Engine Grille and Vertical LED Taillights
  const rGrilleGeo = new THREE.BoxGeometry(2.0, 1.1, 0.1)
  const rGrille = new THREE.Mesh(rGrilleGeo, materials.chassis)
  rGrille.position.set(0, 1.3, -5.61)
  bus.add(rGrille)

  const rTailGeo = new THREE.BoxGeometry(0.2, 0.85, 0.1)
  const leftTail = new THREE.Mesh(rTailGeo, materials.taillightGlass)
  leftTail.position.set(-1.1, 2.0, -5.61)
  const rightTail = new THREE.Mesh(rTailGeo, materials.taillightGlass)
  rightTail.position.set(1.1, 2.0, -5.61)
  bus.add(leftTail, rightTail)

  // Magurudumu ya Basi (Front Steerable + Rear Double Axle)
  const fL = createHDWheel(materials)
  const fR = createHDWheel(materials)

  const steerL = new THREE.Group()
  steerL.position.set(-1.24, 0.58, 4.2)
  steerL.add(fL)

  const steerR = new THREE.Group()
  steerR.position.set(1.24, 0.58, 4.2)
  steerR.add(fR)

  bus.add(steerL, steerR)
  steerWheels.push(steerL, steerR)
  wheels.push(fL, fR)

  // Dual Rear Axles (Axle 1 na Axle 2)
  const rearZ = [-2.8, -4.1]
  rearZ.forEach(zPos => {
    const rL = createHDWheel(materials)
    rL.position.set(-1.24, 0.58, zPos)
    const rR = createHDWheel(materials)
    rR.position.set(1.24, 0.58, zPos)
    bus.add(rL, rR)
    wheels.push(rL, rR)
  })

  return {
    group: bus,
    wheels,
    steerWheels,
    smokeParticles: [],
    headlights: [leftSpot, rightSpot],
    cabinPos: new THREE.Vector3(-0.4, 2.4, 4.8),
    chaseOffset: new THREE.Vector3(0, 5.5, -13.5)
  }
}
