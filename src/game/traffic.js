import * as THREE from 'three'

// Uundaji wa Magari ya Kupishana Barabarani (AI Traffic Cars, Buses & Trucks)
export class TrafficSystem {
  constructor(scene, materials) {
    this.scene = scene
    this.materials = materials
    this.vehicles = []
    this.poolSize = 8

    this.initTrafficPool()
  }

  // Tengeneza gari dogo la abiria (Car / Sedan)
  createCarMesh() {
    const car = new THREE.Group()

    const bodyMat = new THREE.MeshStandardMaterial({
      color: [0xffffff, 0x1e293b, 0x94a3b8, 0x0284c7, 0xdc2626][Math.floor(Math.random() * 5)],
      metalness: 0.6,
      roughness: 0.3
    })

    // Chini
    const lowerGeo = new THREE.BoxGeometry(1.8, 0.7, 4.2)
    const lower = new THREE.Mesh(lowerGeo, bodyMat)
    lower.position.y = 0.55
    lower.castShadow = true
    car.add(lower)

    // Cabin / Vioo vya gari
    const cabGeo = new THREE.BoxGeometry(1.6, 0.65, 2.2)
    const cab = new THREE.Mesh(cabGeo, this.materials.darkGlass)
    cab.position.set(0, 1.15, -0.2)
    cab.castShadow = true
    car.add(cab)

    // Taa za mbele
    const fLightGeo = new THREE.BoxGeometry(0.35, 0.15, 0.05)
    const fLightL = new THREE.Mesh(fLightGeo, this.materials.headlightGlass)
    fLightL.position.set(-0.65, 0.6, 2.12)
    const fLightR = new THREE.Mesh(fLightGeo, this.materials.headlightGlass)
    fLightR.position.set(0.65, 0.6, 2.12)
    car.add(fLightL, fLightR)

    // Taa za nyuma
    const rLightL = new THREE.Mesh(fLightGeo, this.materials.taillightGlass)
    rLightL.position.set(-0.65, 0.6, -2.12)
    const rLightR = new THREE.Mesh(fLightGeo, this.materials.taillightGlass)
    rLightR.position.set(0.65, 0.6, -2.12)
    car.add(rLightL, rLightR)

    // Matairi 4
    const wheelPositions = [
      { x: -0.9, z: 1.2 },
      { x: 0.9, z: 1.2 },
      { x: -0.9, z: -1.2 },
      { x: 0.9, z: -1.2 }
    ]
    wheelPositions.forEach(wp => {
      const wGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 12)
      wGeo.rotateZ(Math.PI / 2)
      const w = new THREE.Mesh(wGeo, this.materials.tireRubber)
      w.position.set(wp.x, 0.32, wp.z)
      car.add(w)
    })

    return car
  }

  // Tengeneza basi lingine la Kitanzania la kupishana (Oncoming / Traffic Bus)
  createBusMesh(livery = 'abood') {
    const bus = new THREE.Group()

    // Rangi ya kampuni kulingana na picha za mtumiaji
    let bodyColor = 0xdc2626 // Abood Red
    if (livery === 'satco') bodyColor = 0xffffff // Satco White
    if (livery === 'baraka') bodyColor = 0xeab308 // Baraka Yellow
    if (livery === 'qose') bodyColor = 0x0284c7 // Qose Blue

    const bodyMat = new THREE.MeshStandardMaterial({
      color: bodyColor,
      metalness: 0.5,
      roughness: 0.3
    })

    // Basi Body
    const bodyGeo = new THREE.BoxGeometry(2.5, 3.0, 10.5)
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.position.y = 2.1
    body.castShadow = true
    bus.add(body)

    // Kioo cha mbele
    const windGeo = new THREE.BoxGeometry(2.35, 1.7, 0.1)
    const wind = new THREE.Mesh(windGeo, this.materials.darkGlass)
    wind.position.set(0, 2.3, 5.26)
    bus.add(wind)

    // Vioo vya pembeni
    const sWinGeo = new THREE.BoxGeometry(0.08, 1.1, 8.5)
    const sWinL = new THREE.Mesh(sWinGeo, this.materials.darkGlass)
    sWinL.position.set(-1.26, 2.6, -0.4)
    const sWinR = new THREE.Mesh(sWinGeo, this.materials.darkGlass)
    sWinR.position.set(1.26, 2.6, -0.4)
    bus.add(sWinL, sWinR)

    // Bullbar ya mbele (Crash Guard)
    const barGeo = new THREE.BoxGeometry(2.4, 0.6, 0.2)
    const barMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8, roughness: 0.3 })
    const bullbar = new THREE.Mesh(barGeo, barMat)
    bullbar.position.set(0, 0.8, 5.38)
    bus.add(bullbar)

    // Taa za mbele
    const fLightGeo = new THREE.BoxGeometry(0.4, 0.25, 0.08)
    const fL = new THREE.Mesh(fLightGeo, this.materials.headlightGlass)
    fL.position.set(-0.85, 0.9, 5.3)
    const fR = new THREE.Mesh(fLightGeo, this.materials.headlightGlass)
    fR.position.set(0.85, 0.9, 5.3)
    bus.add(fL, fR)

    // Matairi ya basi
    const wheelZ = [3.6, -2.6, -3.8]
    wheelZ.forEach(z => {
      const wGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.35, 14)
      wGeo.rotateZ(Math.PI / 2)
      const wL = new THREE.Mesh(wGeo, this.materials.tireRubber)
      wL.position.set(-1.2, 0.55, z)
      const wR = new THREE.Mesh(wGeo, this.materials.tireRubber)
      wR.position.set(1.2, 0.55, z)
      bus.add(wL, wR)
    })

    return bus
  }

  initTrafficPool() {
    const liveries = ['abood', 'satco', 'baraka', 'qose']

    for (let i = 0; i < this.poolSize; i++) {
      const isBus = i % 2 === 0
      const mesh = isBus
        ? this.createBusMesh(liveries[i % liveries.length])
        : this.createCarMesh()

      // Lane:
      // Lane ya Kulia (x = +2.6): Magari yanayokwenda mbele (+Z) taratibu
      // Lane ya Kushoto (x = -2.6): Magari yanayokuja uelekeo wa pili (-Z Oncoming)
      const isOncoming = i % 2 === 1
      const laneX = isOncoming ? -2.6 : 2.6
      const speed = isOncoming ? -18 : 12 // m/s (~65 KM/H na ~45 KM/H)

      if (isOncoming) {
        mesh.rotation.y = Math.PI // Geuza gari litazamane na wewe
      }

      const zPos = 80 + i * 45
      mesh.position.set(laneX, 0, zPos)
      this.scene.add(mesh)

      this.vehicles.push({
        mesh,
        isBus,
        isOncoming,
        speed,
        laneX,
        z: zPos
      })
    }
  }

  update(dt, playerZ, playerSpeed) {
    this.vehicles.forEach(v => {
      // Sogeza gari kulingana na speed yake
      v.z += v.speed * dt
      v.mesh.position.z = v.z
      v.mesh.position.x = v.laneX

      // Ikiwa gari limepitwa sana nyuma au limeenda mbali sana mbele, lireset mbele ya dereva
      if (v.isOncoming) {
        // Oncoming inakuja kuelekea nyuma
        if (v.z < playerZ - 60) {
          v.z = playerZ + 220 + Math.random() * 60
        }
      } else {
        // Gari la mbele likipitwa sana nyuma
        if (v.z < playerZ - 80) {
          v.z = playerZ + 180 + Math.random() * 80
        }
      }
    })
  }
}
