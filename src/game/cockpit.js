import * as THREE from 'three'

// Ujenzi wa Muonekano Halisi wa Ndani wa Dereva (BUSSID Style Tanzanian Bus Cockpit)
export class DriverCockpit {
  constructor(scene) {
    this.scene = scene
    this.cockpitGroup = new THREE.Group()

    this.initCanvasTextures()
    this.initMaterials()
    this.buildDashboard()
    this.buildGauges()
    this.buildGPS()
    this.buildSteeringWheel()
    this.buildTanzanianDecals()
    this.buildMirrors()
    this.buildWipers()

    this.scene.add(this.cockpitGroup)
  }

  initCanvasTextures() {
    // 1. Texture ya GPS Navigation Screen
    this.gpsCanvas = document.createElement('canvas')
    this.gpsCanvas.width = 512
    this.gpsCanvas.height = 256
    this.gpsCtx = this.gpsCanvas.getContext('2d')
    this.gpsTex = new THREE.CanvasTexture(this.gpsCanvas)
    this.gpsTex.anisotropy = 8

    // 2. Texture ya Mita za Speedometer na Tachometer
    this.gaugeCanvas = document.createElement('canvas')
    this.gaugeCanvas.width = 512
    this.gaugeCanvas.height = 256
    this.gaugeCtx = this.gaugeCanvas.getContext('2d')
    this.gaugeTex = new THREE.CanvasTexture(this.gaugeCanvas)
    this.gaugeTex.anisotropy = 8
  }

  initMaterials() {
    this.dashMat = new THREE.MeshStandardMaterial({
      color: 0x181c24, // Textured black vinyl/leather dashboard
      roughness: 0.85,
      metalness: 0.15
    })

    this.dashTrimMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Brushed aluminium trim
      metalness: 0.8,
      roughness: 0.25
    })

    this.gpsScreenMat = new THREE.MeshBasicMaterial({ map: this.gpsTex })
    this.gaugeScreenMat = new THREE.MeshBasicMaterial({ map: this.gaugeTex })

    this.wheelRimMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8
    })

    this.wheelSpokeMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.85,
      roughness: 0.2
    })

    this.mirrorGlassMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.05
    })

    this.tasselMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // Golden yellow curtain tassels
      roughness: 0.9
    })

    this.needleMat = new THREE.MeshBasicMaterial({ color: 0xf97316 })
  }

  buildDashboard() {
    // Main Dashboard Base Cowl (Inayofunika mbele ya dereva)
    const cowlGeo = new THREE.BoxGeometry(2.4, 0.75, 1.2)
    const cowl = new THREE.Mesh(cowlGeo, this.dashMat)
    cowl.position.set(0, 1.65, 4.4)
    this.cockpitGroup.add(cowl)

    // Instrument Cluster Hood (Kofia ya mita za speed mbele ya dereva upande wa kulia/kushoto)
    const hoodGeo = new THREE.BoxGeometry(0.85, 0.35, 0.6)
    const hood = new THREE.Mesh(hoodGeo, this.dashMat)
    hood.position.set(-0.4, 1.95, 4.35)
    this.cockpitGroup.add(hood)

    // Center Console (Sehemu ya GPS na Viyoyozi)
    const centerGeo = new THREE.BoxGeometry(0.7, 0.65, 0.45)
    const centerConsole = new THREE.Mesh(centerGeo, this.dashTrimMat)
    centerConsole.position.set(0.35, 1.75, 4.45)
    this.cockpitGroup.add(centerConsole)
  }

  buildGauges() {
    // Skrini ya Mita za Speedometer na Tachometer
    const gaugeScreenGeo = new THREE.PlaneGeometry(0.75, 0.32)
    gaugeScreenGeo.rotateY(Math.PI)
    this.gaugeScreen = new THREE.Mesh(gaugeScreenGeo, this.gaugeScreenMat)
    this.gaugeScreen.position.set(-0.4, 1.88, 4.12)
    this.cockpitGroup.add(this.gaugeScreen)

    this.updateGauges(0, 0, 'D')
  }

  buildGPS() {
    // Skrini ya GPS Navigation (Ramani ya Magufuli ➔ Msamvu)
    const gpsScreenGeo = new THREE.PlaneGeometry(0.6, 0.32)
    gpsScreenGeo.rotateY(Math.PI)
    this.gpsScreen = new THREE.Mesh(gpsScreenGeo, this.gpsScreenMat)
    this.gpsScreen.position.set(0.35, 1.82, 4.22)
    this.cockpitGroup.add(this.gpsScreen)

    this.updateGPS({
      currentKm: 0,
      totalKm: 190,
      remainingKm: 190,
      currentLocation: 'Stendi ya Magufuli',
      nextLocation: 'Kiluvya Stand',
      distanceToNext: 18,
      speedLimit: 50
    }, 0)
  }

  buildSteeringWheel() {
    this.wheelGroup = new THREE.Group()

    // Rim ya Usukani (Torus ring)
    const rimGeo = new THREE.TorusGeometry(0.24, 0.024, 12, 32)
    const rim = new THREE.Mesh(rimGeo, this.wheelRimMat)
    this.wheelGroup.add(rim)

    // Spokes (Mishale ya usukani)
    const spoke1 = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.03, 0.02), this.wheelSpokeMat)
    const spoke2 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.22, 0.02), this.wheelSpokeMat)
    spoke2.position.y = -0.11
    this.wheelGroup.add(spoke1, spoke2)

    // Center Horn Button yenye Nembo
    const hubGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.03, 16)
    hubGeo.rotateX(Math.PI / 2)
    const hub = new THREE.Mesh(hubGeo, this.dashMat)
    this.wheelGroup.add(hub)

    // Weka usukani mbele ya kiti cha dereva (Tilt ya digrii 25 kama basi halisi)
    this.wheelGroup.position.set(-0.4, 1.82, 3.82)
    this.wheelGroup.rotation.x = -Math.PI / 6
    this.cockpitGroup.add(this.wheelGroup)
  }

  buildTanzanianDecals() {
    // 1. Vitambaa vya Pazia vya Njano/Dhahabu Juu ya Kioo (Signature Tanzanian Bus Tassels)
    const tasselGroup = new THREE.Group()
    const numTassels = 18
    for (let i = 0; i < numTassels; i++) {
      const coneGeo = new THREE.ConeGeometry(0.04, 0.12, 6)
      const cone = new THREE.Mesh(coneGeo, this.tasselMat)
      cone.position.set(-1.1 + i * 0.13, 3.12, 5.48)
      tasselGroup.add(cone)
    }
    this.cockpitGroup.add(tasselGroup)

    // 2. Bango la "MUNGU IBARIKI TANZANIA / HAPA KAZI TU"
    const mottoCanvas = document.createElement('canvas')
    mottoCanvas.width = 512
    mottoCanvas.height = 64
    const mCtx = mottoCanvas.getContext('2d')
    mCtx.fillStyle = '#1e293b'
    mCtx.fillRect(0, 0, 512, 64)
    mCtx.fillStyle = '#fef08a'
    mCtx.font = 'bold 24px sans-serif'
    mCtx.textAlign = 'center'
    mCtx.fillText('★ MUNGU IBARIKI TANZANIA - HAPA KAZI TU ★', 256, 40)

    const mottoTex = new THREE.CanvasTexture(mottoCanvas)
    const mottoGeo = new THREE.PlaneGeometry(1.2, 0.15)
    mottoGeo.rotateY(Math.PI)
    const mottoMesh = new THREE.Mesh(mottoGeo, new THREE.MeshBasicMaterial({ map: mottoTex }))
    mottoMesh.position.set(0, 3.02, 5.48)
    this.cockpitGroup.add(mottoMesh)
  }

  buildMirrors() {
    // Vioo vya Ndani na Pembeni (Rearview Side Mirrors)
    // Kioo cha Kushoto
    const leftMirrorGeo = new THREE.BoxGeometry(0.18, 0.42, 0.04)
    leftMirrorGeo.rotateY(Math.PI / 4)
    const leftMirror = new THREE.Mesh(leftMirrorGeo, this.mirrorGlassMat)
    leftMirror.position.set(-1.42, 2.3, 5.1)
    this.cockpitGroup.add(leftMirror)

    // Kioo cha Kulia
    const rightMirrorGeo = new THREE.BoxGeometry(0.18, 0.42, 0.04)
    rightMirrorGeo.rotateY(-Math.PI / 4)
    const rightMirror = new THREE.Mesh(rightMirrorGeo, this.mirrorGlassMat)
    rightMirror.position.set(1.42, 2.3, 5.1)
    this.cockpitGroup.add(rightMirror)
  }

  buildWipers() {
    this.wiperLeft = new THREE.Group()
    this.wiperRight = new THREE.Group()

    const armGeo = new THREE.BoxGeometry(0.02, 0.75, 0.02)
    const armL = new THREE.Mesh(armGeo, this.dashMat)
    armL.position.y = 0.35
    this.wiperLeft.add(armL)

    const armR = new THREE.Mesh(armGeo, this.dashMat)
    armR.position.y = 0.35
    this.wiperRight.add(armR)

    this.wiperLeft.position.set(-0.6, 1.7, 5.58)
    this.wiperRight.position.set(0.6, 1.7, 5.58)
    this.cockpitGroup.add(this.wiperLeft, this.wiperRight)
  }

  // Chora Upya Mita za Speedometer na RPM (Canvas Draw)
  updateGauges(speedKmH, rpmPercent, gear) {
    const ctx = this.gaugeCtx
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, 512, 256)

    // 1. SPEEDOMETER (Kushoto)
    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(130, 130, 95, Math.PI * 0.75, Math.PI * 2.25)
    ctx.stroke()

    // Maandishi ya Namba za Mwendokasi
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 18px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('0', 65, 195)
    ctx.fillText('60', 65, 75)
    ctx.fillText('100', 130, 50)
    ctx.fillText('140', 195, 195)

    // Digital Speed Display katikati
    ctx.font = '900 36px monospace'
    ctx.fillStyle = '#38bdf8'
    ctx.fillText(Math.round(Math.abs(speedKmH)), 130, 140)
    ctx.font = '12px sans-serif'
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('KM/H', 130, 165)

    // 2. TACHOMETER / RPM (Kulia)
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(380, 130, 95, Math.PI * 0.75, Math.PI * 2.25)
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 32px monospace'
    ctx.fillText(gear, 380, 140)
    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#fef08a'
    ctx.fillText('GEAR', 380, 165)

    // Air Pressure Indicator
    ctx.fillStyle = '#22c55e'
    ctx.fillRect(230, 90, 50, 14)
    ctx.fillStyle = '#ffffff'
    ctx.font = '10px sans-serif'
    ctx.fillText('AIR 8.5 BAR', 255, 80)

    this.gaugeTex.needsUpdate = true
  }

  // Chora Upya Skrini ya GPS Navigation (Ramani ya Magufuli ➔ Msamvu)
  updateGPS(routeProgress, speedKmH) {
    const ctx = this.gpsCtx

    // Background
    ctx.fillStyle = '#090d16'
    ctx.fillRect(0, 0, 512, 256)

    // Header ya Njia
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, 512, 42)

    ctx.fillStyle = '#fef08a'
    ctx.font = 'bold 18px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('📍 GPS: DAR (MAGUFULI) ➔ MSAMVU (MORO)', 16, 28)

    // Alama ya Ukomo wa Mwendo (Speed Limit Sign: Red Circle)
    ctx.fillStyle = '#dc2626'
    ctx.beginPath()
    ctx.arc(465, 75, 28, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(465, 75, 22, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#000000'
    ctx.font = '900 20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(routeProgress.speedLimit || 80, 465, 82)

    // Eneo la Sasa (Current Location)
    ctx.fillStyle = '#94a3b8'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Mahali Ulipo Sasa:', 20, 75)

    ctx.fillStyle = '#4ade80'
    ctx.font = 'bold 22px sans-serif'
    ctx.fillText(routeProgress.currentLocation, 20, 105)

    // Kituo Kinachofuata (Next Waypoint)
    ctx.fillStyle = '#94a3b8'
    ctx.font = '14px sans-serif'
    ctx.fillText('Kituo Kinachofuata:', 20, 145)

    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText(`${routeProgress.nextLocation} (${routeProgress.distanceToNext} km)`, 20, 175)

    // Progress Bar ya Safari Nzima (0 hadi 190 KM)
    const progressPercent = Math.min(1, routeProgress.currentKm / routeProgress.totalKm)
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(20, 205, 472, 18)

    ctx.fillStyle = '#22c55e'
    ctx.fillRect(20, 205, 472 * progressPercent, 18)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 13px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`Umbali Uliobaki: ${routeProgress.remainingKm} KM`, 492, 240)

    this.gpsTex.needsUpdate = true
  }

  // Zungusha Usukani wa 3D kulingana na kugeuka
  setSteering(angleRad) {
    if (this.wheelGroup) {
      this.wheelGroup.rotation.z = -angleRad * 2.5
    }
  }

  // Wipers Animation
  updateWipers(timeSec, isRaining = false) {
    if (!isRaining) return
    const angle = Math.sin(timeSec * 4) * 0.45
    if (this.wiperLeft) this.wiperLeft.rotation.z = angle
    if (this.wiperRight) this.wiperRight.rotation.z = angle
  }

  setPosition(pos, heading) {
    this.cockpitGroup.position.copy(pos)
    this.cockpitGroup.rotation.y = heading
  }

  destroy() {
    this.scene.remove(this.cockpitGroup)
  }
}
