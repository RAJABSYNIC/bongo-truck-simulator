import * as THREE from 'three'

// --- PROCEDURAL TANZANIAN BUS LIVERY TEXTURES ---

// 1. Texture ya ABOOD BUS (Red with Blue/Navy Aerodynamic Swooshes & "ABOOD" text)
function createAboodSideTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  // Red body
  ctx.fillStyle = '#dc2626'
  ctx.fillRect(0, 0, 1024, 256)

  // Navy & Sky Blue Diagonal Swooshes
  ctx.fillStyle = '#1e3a8a' // Deep Navy
  ctx.beginPath()
  ctx.moveTo(100, 256)
  ctx.lineTo(380, 0)
  ctx.lineTo(440, 0)
  ctx.lineTo(240, 256)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#0284c7' // Sky Blue
  ctx.beginPath()
  ctx.moveTo(240, 256)
  ctx.lineTo(440, 0)
  ctx.lineTo(520, 0)
  ctx.lineTo(380, 256)
  ctx.closePath()
  ctx.fill()

  // Typography "ABOOD"
  ctx.fillStyle = '#1e3a8a'
  ctx.font = '900 84px "Arial Black", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = '#000000'
  ctx.shadowBlur = 6
  ctx.fillText('ABOOD', 620, 135)

  // Gold accent stripe chini
  ctx.fillStyle = '#eab308'
  ctx.fillRect(0, 240, 1024, 16)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 8
  return texture
}

// 2. Texture ya SATCO BUS (White with Orange & Yellow Stripes & "SATCO")
function createSatcoSideTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  // White body
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, 1024, 256)

  // Orange & Yellow Speed Ribbons
  ctx.fillStyle = '#ea580c'
  ctx.beginPath()
  ctx.moveTo(200, 256)
  ctx.lineTo(380, 40)
  ctx.lineTo(430, 40)
  ctx.lineTo(260, 256)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#facc15'
  ctx.beginPath()
  ctx.moveTo(270, 256)
  ctx.lineTo(440, 40)
  ctx.lineTo(490, 40)
  ctx.lineTo(330, 256)
  ctx.closePath()
  ctx.fill()

  // "SATCO" text
  ctx.fillStyle = '#ea580c'
  ctx.font = '900 80px "Arial Black", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('SATCO', 600, 130)

  ctx.fillStyle = '#64748b'
  ctx.font = 'bold 26px sans-serif'
  ctx.fillText('ULTRA HIGH DECK', 600, 185)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 8
  return texture
}

// 3. Texture ya BARAKA CLASSIC (Yellow front/skirt, White body, "BARAKA")
function createBarakaSideTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, 1024, 256)

  // Yellow skirt & front
  ctx.fillStyle = '#eab308'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(240, 0)
  ctx.lineTo(120, 256)
  ctx.lineTo(0, 256)
  ctx.closePath()
  ctx.fill()

  ctx.fillRect(0, 200, 1024, 56)

  // "BARAKA" bold text
  ctx.fillStyle = '#0284c7'
  ctx.font = '900 76px "Arial Black", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('BARAKA', 550, 120)

  ctx.fillStyle = '#dc2626'
  ctx.font = 'bold 28px sans-serif'
  ctx.fillText('CLASSIC LUXURY COACH', 550, 170)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 8
  return texture
}

// 4. Texture ya Sunvisor ya Lori ("KAZI KWANZA / TANZANIA EXPRESS")
function createTruckVisorTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, 512, 128)

  // Bendera ya Tanzania
  ctx.fillStyle = '#16a34a'
  ctx.fillRect(0, 0, 512, 22)
  ctx.fillStyle = '#facc15'
  ctx.fillRect(0, 22, 512, 12)
  ctx.fillStyle = '#0284c7'
  ctx.fillRect(0, 96, 512, 32)

  ctx.fillStyle = '#ffffff'
  ctx.font = '900 42px "Arial Black", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('KAZI KWANZA', 256, 60)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 8
  return texture
}

// 5. Texture ya Mudflap ("HAPA KAZI TU")
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

// 6. Texture ya Kontena la Trela (Shipping Container Ribs)
function createContainerTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(0, 0, 512, 512)

  for (let x = 0; x < 512; x += 16) {
    ctx.fillStyle = '#334155'
    ctx.fillRect(x, 0, 8, 512)
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(x + 8, 0, 8, 512)
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.font = 'bold 36px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('TANZANIA TRANSIT', 256, 200)

  ctx.fillStyle = 'rgba(250, 204, 21, 0.9)'
  ctx.font = 'bold 24px sans-serif'
  ctx.fillText('40FT HIGH CUBE CONTAINER', 256, 250)

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

// --- MATERIALS MANAGER ---
export function createMaterials() {
  const visorTex = createTruckVisorTexture()
  const mudflapTex = createMudflapTexture()
  const containerTex = createContainerTexture()

  const aboodTex = createAboodSideTexture()
  const satcoTex = createSatcoSideTexture()
  const barakaTex = createBarakaSideTexture()

  return {
    truckCab: new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.7,
      roughness: 0.25
    }),
    truckCabAccent: new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
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
    // Basi Liveries
    aboodMat: new THREE.MeshStandardMaterial({ map: aboodTex, metalness: 0.4, roughness: 0.3 }),
    satcoMat: new THREE.MeshStandardMaterial({ map: satcoTex, metalness: 0.4, roughness: 0.3 }),
    barakaMat: new THREE.MeshStandardMaterial({ map: barakaTex, metalness: 0.4, roughness: 0.3 }),

    bullbarYellow: new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.7, roughness: 0.3 }),
    bullbarChrome: new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.1 }),

    chassis: new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.85, roughness: 0.4 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.98, roughness: 0.08 }),

    darkGlass: new THREE.MeshPhysicalMaterial({
      color: 0x080d1a,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.65,
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
    tireRubber: new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.88 }),
    alloyRim: new THREE.MeshStandardMaterial({ color: 0xe4e4e7, metalness: 0.9, roughness: 0.18 }),
    smokeParticle: new THREE.MeshBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.35 })
  }
}

// Gurudumu la Kisasa (HD Alloy Wheel)
function createHDWheel(materials, radius = 0.58, width = 0.38) {
  const wheelGroup = new THREE.Group()

  const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 24)
  tireGeo.rotateZ(Math.PI / 2)
  const tire = new THREE.Mesh(tireGeo, materials.tireRubber)
  tire.castShadow = true
  wheelGroup.add(tire)

  const rimGeo = new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, width * 1.02, 16)
  rimGeo.rotateZ(Math.PI / 2)
  const rim = new THREE.Mesh(rimGeo, materials.alloyRim)
  wheelGroup.add(rim)

  const hubGeo = new THREE.CylinderGeometry(radius * 0.28, radius * 0.28, width * 1.08, 10)
  hubGeo.rotateZ(Math.PI / 2)
  const hub = new THREE.Mesh(hubGeo, materials.chrome)
  wheelGroup.add(hub)

  return wheelGroup
}

// =================================================================
// 1. BASI LA TANZANIA (ABOOD / SATCO / BARAKA STYLE)
// =================================================================
export function buildBus(materials, liveryName = 'abood') {
  const bus = new THREE.Group()
  const wheels = []
  const steerWheels = []

  // Chagua livery material (Abood / Satco / Baraka)
  let bodySideMat = materials.aboodMat
  let primaryColor = 0xdc2626 // Abood Red
  let bullbarMat = materials.bullbarYellow

  if (liveryName === 'satco') {
    bodySideMat = materials.satcoMat
    primaryColor = 0xf8fafc // White
    bullbarMat = materials.bullbarChrome
  } else if (liveryName === 'baraka') {
    bodySideMat = materials.barakaMat
    primaryColor = 0xeab308 // Yellow
    bullbarMat = materials.bullbarYellow
  }

  const frontRearRoofMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    metalness: 0.5,
    roughness: 0.3
  })

  // Main High-Deck Body Base
  const bodyGeo = new THREE.BoxGeometry(2.6, 3.2, 11.2)
  const body = new THREE.Mesh(bodyGeo, frontRearRoofMat)
  body.position.set(0, 2.2, 0)
  body.castShadow = true
  bus.add(body)

  // Side Livery Panels (Bango la Abood / Satco / Baraka pande zote)
  const leftSideGeo = new THREE.PlaneGeometry(11.2, 2.4)
  leftSideGeo.rotateY(-Math.PI / 2)
  const leftSide = new THREE.Mesh(leftSideGeo, bodySideMat)
  leftSide.position.set(-1.31, 2.0, 0)
  bus.add(leftSide)

  const rightSideGeo = new THREE.PlaneGeometry(11.2, 2.4)
  rightSideGeo.rotateY(Math.PI / 2)
  const rightSide = new THREE.Mesh(rightSideGeo, bodySideMat)
  rightSide.position.set(1.31, 2.0, 0)
  bus.add(rightSide)

  // Kioo cha Juu cha Abiria na Vioo vya Pembeni (Panoramic Tinted Glazing)
  const sideGlassGeo = new THREE.BoxGeometry(0.08, 1.25, 9.2)
  const leftGlass = new THREE.Mesh(sideGlassGeo, materials.darkGlass)
  leftGlass.position.set(-1.32, 2.7, -0.4)
  const rightGlass = new THREE.Mesh(sideGlassGeo, materials.darkGlass)
  rightGlass.position.set(1.32, 2.7, -0.4)
  bus.add(leftGlass, rightGlass)

  // Kioo Kikubwa cha Mbele (Double Windshield with Sunvisor)
  const windGeo = new THREE.BoxGeometry(2.45, 1.85, 0.12)
  const windshield = new THREE.Mesh(windGeo, materials.darkGlass)
  windshield.position.set(0, 2.3, 5.61)
  bus.add(windshield)

  // Wiper mbili za Kioo cha Mbele
  for (let w = -0.5; w <= 0.5; w += 1.0) {
    const wiperGeo = new THREE.BoxGeometry(0.04, 0.8, 0.04)
    const wiper = new THREE.Mesh(wiperGeo, materials.chassis)
    wiper.position.set(w, 1.8, 5.68)
    wiper.rotation.z = -0.15
    bus.add(wiper)
  }

  // Masikio ya Tembo (Large High Aerodynamic Elephant-Ear Side Mirrors)
  const createMirrorArm = (isLeft) => {
    const armGroup = new THREE.Group()
    const sign = isLeft ? -1 : 1

    // Curved stalk kutoka juu ya dari kuelekea mbele na chini
    const curveGeo = new THREE.BoxGeometry(0.08, 0.9, 0.08)
    const curve = new THREE.Mesh(curveGeo, materials.chrome)
    curve.position.set(sign * 1.5, 2.6, 5.3)
    armGroup.add(curve)

    // Kioo chenyewe kikubwa
    const mirrorGeo = new THREE.BoxGeometry(0.12, 0.55, 0.22)
    const mirror = new THREE.Mesh(mirrorGeo, materials.chrome)
    mirror.position.set(sign * 1.55, 2.4, 5.4)
    armGroup.add(mirror)

    return armGroup
  }

  bus.add(createMirrorArm(true))
  bus.add(createMirrorArm(false))

  // Chuma cha Mbele cha Pua (Tanzanian Heavy Front Bullbar / Crash Guard)
  const bullbarGroup = new THREE.Group()
  const mainBarGeo = new THREE.BoxGeometry(2.55, 0.12, 0.12)
  const mainBar = new THREE.Mesh(mainBarGeo, bullbarMat)
  mainBar.position.set(0, 0.85, 5.82)
  bullbarGroup.add(mainBar)

  const topBarGeo = new THREE.BoxGeometry(2.1, 0.1, 0.1)
  const topBar = new THREE.Mesh(topBarGeo, bullbarMat)
  topBar.position.set(0, 1.25, 5.78)
  bullbarGroup.add(topBar)

  // Vertical upright teeth
  for (let x = -0.7; x <= 0.7; x += 0.7) {
    const toothGeo = new THREE.BoxGeometry(0.1, 0.6, 0.1)
    const tooth = new THREE.Mesh(toothGeo, bullbarMat)
    tooth.position.set(x, 1.0, 5.8)
    bullbarGroup.add(tooth)
  }
  bus.add(bullbarGroup)

  // AC Unit & Rooftop Pods
  const acGeo = new THREE.BoxGeometry(1.8, 0.4, 3.6)
  const acMesh = new THREE.Mesh(acGeo, materials.chrome)
  acMesh.position.set(0, 3.95, 0.2)
  bus.add(acMesh)

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

  // Magurudumu ya Basi
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

// =================================================================
// 2. LORI LA TANZANIA (SCANIA V8 + TRELA LA KONTENA)
// =================================================================
export function buildTruck(materials) {
  const truck = new THREE.Group()
  const wheels = []
  const steerWheels = []
  const smokeParticles = []

  const cabGroup = new THREE.Group()

  const cabGeo = new THREE.BoxGeometry(2.5, 2.7, 2.6)
  const cabMesh = new THREE.Mesh(cabGeo, materials.truckCab)
  cabMesh.position.set(0, 2.3, 1.8)
  cabMesh.castShadow = true
  cabGroup.add(cabMesh)

  const windGeo = new THREE.BoxGeometry(2.35, 1.25, 0.1)
  const windshield = new THREE.Mesh(windGeo, materials.darkGlass)
  windshield.position.set(0, 2.75, 3.12)
  cabGroup.add(windshield)

  const visorGeo = new THREE.BoxGeometry(2.4, 0.35, 0.15)
  const visor = new THREE.Mesh(visorGeo, materials.visorMat)
  visor.position.set(0, 3.55, 3.16)
  cabGroup.add(visor)

  const sideWinGeo = new THREE.BoxGeometry(0.08, 1.0, 1.3)
  const leftWin = new THREE.Mesh(sideWinGeo, materials.darkGlass)
  leftWin.position.set(-1.27, 2.75, 2.1)
  const rightWin = new THREE.Mesh(sideWinGeo, materials.darkGlass)
  rightWin.position.set(1.27, 2.75, 2.1)
  cabGroup.add(leftWin, rightWin)

  const grilleGeo = new THREE.BoxGeometry(1.9, 1.35, 0.18)
  const grille = new THREE.Mesh(grilleGeo, materials.chassis)
  grille.position.set(0, 1.55, 3.12)
  cabGroup.add(grille)

  for (let i = 0; i < 4; i++) {
    const barGeo = new THREE.BoxGeometry(1.8, 0.08, 0.22)
    const bar = new THREE.Mesh(barGeo, materials.chrome)
    bar.position.set(0, 1.25 + i * 0.24, 3.13)
    cabGroup.add(bar)
  }

  const bumperGeo = new THREE.BoxGeometry(2.6, 0.55, 0.35)
  const bumper = new THREE.Mesh(bumperGeo, materials.chassis)
  bumper.position.set(0, 0.8, 3.15)
  bumper.castShadow = true
  cabGroup.add(bumper)

  const lightBezelGeo = new THREE.BoxGeometry(0.5, 0.28, 0.1)
  const leftBezel = new THREE.Mesh(lightBezelGeo, materials.headlightGlass)
  leftBezel.position.set(-0.9, 0.85, 3.32)
  const rightBezel = new THREE.Mesh(lightBezelGeo, materials.headlightGlass)
  rightBezel.position.set(0.9, 0.85, 3.32)
  cabGroup.add(leftBezel, rightBezel)

  const leftSpot = new THREE.SpotLight(0xfff8db, 7.5, 80, Math.PI / 5, 0.35)
  leftSpot.position.set(-0.9, 0.9, 3.35)
  leftSpot.target.position.set(-0.9, 0, 45)
  const rightSpot = new THREE.SpotLight(0xfff8db, 7.5, 80, Math.PI / 5, 0.35)
  rightSpot.position.set(0.9, 0.9, 3.35)
  rightSpot.target.position.set(0.9, 0, 45)
  cabGroup.add(leftSpot, rightSpot, leftSpot.target, rightSpot.target)

  const mirrorGeo = new THREE.BoxGeometry(0.1, 0.55, 0.2)
  const leftMirror = new THREE.Mesh(mirrorGeo, materials.chrome)
  leftMirror.position.set(-1.48, 2.7, 2.8)
  const rightMirror = new THREE.Mesh(mirrorGeo, materials.chrome)
  rightMirror.position.set(1.48, 2.7, 2.8)
  cabGroup.add(leftMirror, rightMirror)

  const hornGeo = new THREE.CylinderGeometry(0.06, 0.03, 0.9, 8)
  hornGeo.rotateX(Math.PI / 2)
  const leftHorn = new THREE.Mesh(hornGeo, materials.chrome)
  leftHorn.position.set(-0.6, 3.82, 2.0)
  const rightHorn = new THREE.Mesh(hornGeo, materials.chrome)
  rightHorn.position.set(0.6, 3.82, 2.0)
  cabGroup.add(leftHorn, rightHorn)

  const pipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.2, 12)
  const leftPipe = new THREE.Mesh(pipeGeo, materials.chrome)
  leftPipe.position.set(-1.18, 3.0, 0.4)
  const rightPipe = new THREE.Mesh(pipeGeo, materials.chrome)
  rightPipe.position.set(1.18, 3.0, 0.4)
  cabGroup.add(leftPipe, rightPipe)

  const spoilerGeo = new THREE.BoxGeometry(2.4, 0.55, 1.8)
  const spoiler = new THREE.Mesh(spoilerGeo, materials.truckCab)
  spoiler.position.set(0, 3.8, 1.6)
  cabGroup.add(spoiler)

  truck.add(cabGroup)

  const frameGeo = new THREE.BoxGeometry(1.2, 0.35, 9.2)
  const frame = new THREE.Mesh(frameGeo, materials.chassis)
  frame.position.set(0, 0.85, -1.4)
  frame.castShadow = true
  truck.add(frame)

  const tankGeo = new THREE.CylinderGeometry(0.38, 0.38, 2.2, 16)
  tankGeo.rotateX(Math.PI / 2)
  const leftTank = new THREE.Mesh(tankGeo, materials.chrome)
  leftTank.position.set(-1.08, 0.8, 0.2)
  const rightTank = new THREE.Mesh(tankGeo, materials.chrome)
  rightTank.position.set(1.08, 0.8, 0.2)
  truck.add(leftTank, rightTank)

  const trailerGroup = new THREE.Group()

  const containerGeo = new THREE.BoxGeometry(2.5, 2.8, 8.4)
  const container = new THREE.Mesh(containerGeo, materials.containerMat)
  container.position.set(0, 2.7, -3.5)
  container.castShadow = true
  trailerGroup.add(container)

  const rBumperGeo = new THREE.BoxGeometry(2.5, 0.35, 0.25)
  const rBumper = new THREE.Mesh(rBumperGeo, materials.chassis)
  rBumper.position.set(0, 0.85, -7.72)
  trailerGroup.add(rBumper)

  const flapGeo = new THREE.BoxGeometry(2.2, 0.45, 0.05)
  const flap = new THREE.Mesh(flapGeo, materials.mudflapMat)
  flap.position.set(0, 0.45, -7.74)
  trailerGroup.add(flap)

  const tailGeo = new THREE.BoxGeometry(0.5, 0.2, 0.08)
  const leftTail = new THREE.Mesh(tailGeo, materials.taillightGlass)
  leftTail.position.set(-0.9, 0.9, -7.86)
  const rightTail = new THREE.Mesh(tailGeo, materials.taillightGlass)
  rightTail.position.set(0.9, 0.9, -7.86)
  trailerGroup.add(leftTail, rightTail)

  truck.add(trailerGroup)

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

  const r1L = createHDWheel(materials)
  r1L.position.set(-1.22, 0.58, -0.7)
  const r1R = createHDWheel(materials)
  r1R.position.set(1.22, 0.58, -0.7)
  truck.add(r1L, r1R)
  wheels.push(r1L, r1R)

  const trPositions = [-4.6, -5.8, -7.0]
  trPositions.forEach(zPos => {
    const wL = createHDWheel(materials)
    wL.position.set(-1.22, 0.58, zPos)
    const wR = createHDWheel(materials)
    wR.position.set(1.22, 0.58, zPos)
    truck.add(wL, wR)
    wheels.push(wL, wR)
  })

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
