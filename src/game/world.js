import * as THREE from 'three'

// Uundaji wa Mandhari ya Hali ya Juu (High-Quality Tanzania Highway World)
export class GameWorld {
  constructor(scene) {
    this.scene = scene
    this.roadChunks = []
    this.chunkLength = 140
    this.numChunks = 6
    this.sceneryObjects = []

    this.initMaterials()
    this.initLighting()
    this.initMountains()
    this.initRoads()
  }

  initMaterials() {
    // Lami ya kisasa yenye rangi nzuri ya asphalt
    this.roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x22262d,
      roughness: 0.85,
      metalness: 0.12
    })

    // Udongo wa pembeni ya barabara (Red African Earth / Murram)
    this.shoulderMaterial = new THREE.MeshStandardMaterial({
      color: 0x9a5023,
      roughness: 0.95
    })

    // Nyasi za kijani na pori la Afrika Mashariki
    this.grassMaterial = new THREE.MeshStandardMaterial({
      color: 0x2e4726,
      roughness: 0.92
    })

    // Mistari ya barabarani (Reflective white & yellow)
    this.whiteMarkingMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    this.yellowMarkingMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 })

    // Vyuma vya kando ya barabara (Guardrails)
    this.guardrailMat = new THREE.MeshStandardMaterial({
      color: 0xcfd4dc,
      metalness: 0.85,
      roughness: 0.25
    })

    this.reflectorRedMat = new THREE.MeshBasicMaterial({ color: 0xef4444 })
    this.reflectorWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff })

    // Miti na Nguzo za Umeme
    this.woodPoleMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.9 })
    this.cableMat = new THREE.MeshBasicMaterial({ color: 0x111827 })
    this.trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3222, roughness: 0.9 })
    this.foliageMat = new THREE.MeshStandardMaterial({ color: 0x204523, roughness: 0.8 })
    this.mountainMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.95 })
  }

  initLighting() {
    // 1. Hemisphere Light (Mwangaza wa anga ya juu ya bluu + mwangaza wa udongo wa chini)
    this.hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x452b14, 0.75)
    this.scene.add(this.hemiLight)

    // 2. Jua kali la mchana (Sunlight yenye vivuli laini)
    this.sunLight = new THREE.DirectionalLight(0xfffae8, 1.6)
    this.sunLight.position.set(50, 70, 50)
    this.sunLight.castShadow = true
    this.sunLight.shadow.mapSize.width = 2048
    this.sunLight.shadow.mapSize.height = 2048
    this.sunLight.shadow.camera.near = 10
    this.sunLight.shadow.camera.far = 240
    this.sunLight.shadow.camera.left = -40
    this.sunLight.shadow.camera.right = 40
    this.sunLight.shadow.camera.top = 40
    this.sunLight.shadow.camera.bottom = -40
    this.sunLight.shadow.bias = -0.0005
    this.scene.add(this.sunLight)

    // Anga na Ukungu (Sky & Distance Atmospheric Haze)
    this.scene.background = new THREE.Color(0x38bdf8) // Blue African Sky
    this.scene.fog = new THREE.FogExp2(0x93c5fd, 0.004)
  }

  // Milima ya mbali (Distant Horizon Mountains)
  initMountains() {
    this.mountainGroup = new THREE.Group()

    for (let i = 0; i < 16; i++) {
      const radius = 60 + Math.random() * 40
      const height = 35 + Math.random() * 30
      const coneGeo = new THREE.ConeGeometry(radius, height, 7)
      const mountain = new THREE.Mesh(coneGeo, this.mountainMat)

      const side = i % 2 === 0 ? -1 : 1
      const x = side * (120 + Math.random() * 60)
      const z = (i - 4) * 80
      mountain.position.set(x, height / 2 - 5, z)
      this.mountainGroup.add(mountain)
    }

    this.scene.add(this.mountainGroup)
  }

  // Mti wa Mwavuli wa Afrika (Acacia Tortilis)
  createAcaciaTree(x, z) {
    const tree = new THREE.Group()
    const height = 4.2 + Math.random() * 2.8

    // Shina lililopinda kiasili
    const trunkGeo = new THREE.CylinderGeometry(0.25, 0.45, height, 8)
    const trunk = new THREE.Mesh(trunkGeo, this.trunkMat)
    trunk.position.y = height / 2
    trunk.rotation.z = (Math.random() - 0.5) * 0.15
    trunk.castShadow = true
    tree.add(trunk)

    // Matawi na majani ya juu kama mwavuli (Tiered flat canopy)
    const can1Geo = new THREE.CylinderGeometry(3.2, 0.6, 0.8, 8)
    const can1 = new THREE.Mesh(can1Geo, this.foliageMat)
    can1.position.y = height + 0.4
    can1.castShadow = true
    tree.add(can1)

    const can2Geo = new THREE.CylinderGeometry(2.1, 0.4, 0.6, 8)
    const can2 = new THREE.Mesh(can2Geo, this.foliageMat)
    can2.position.set(0.3, height + 0.9, 0)
    can2.castShadow = true
    tree.add(can2)

    tree.position.set(x, 0, z)
    return tree
  }

  // Nguzo ya Umeme ya Kando ya Barabara yenye waya
  createPowerPole(x, z) {
    const group = new THREE.Group()

    // Nguzo ya mti (Wooden Utility Pole)
    const poleGeo = new THREE.CylinderGeometry(0.12, 0.16, 7.5, 8)
    const pole = new THREE.Mesh(poleGeo, this.woodPoleMat)
    pole.position.y = 3.75
    pole.castShadow = true
    group.add(pole)

    // Cross-arm ya juu
    const armGeo = new THREE.BoxGeometry(2.4, 0.12, 0.12)
    const arm = new THREE.Mesh(armGeo, this.woodPoleMat)
    arm.position.set(0, 6.8, 0)
    group.add(arm)

    group.position.set(x, 0, z)
    return group
  }

  // Chuma cha Kando ya Barabara (Guardrail Section)
  createGuardrail(startZ, length, isLeft) {
    const railGroup = new THREE.Group()
    const xPos = isLeft ? -5.8 : 5.8

    // W-beam rail bar
    const beamGeo = new THREE.BoxGeometry(0.12, 0.35, length)
    const beam = new THREE.Mesh(beamGeo, this.guardrailMat)
    beam.position.set(xPos, 0.75, startZ + length / 2)
    beam.castShadow = true
    railGroup.add(beam)

    // Posts & Cat-Eye Reflectors kila mita 10
    const numPosts = Math.floor(length / 10)
    for (let i = 0; i < numPosts; i++) {
      const pZ = startZ + i * 10
      const postGeo = new THREE.BoxGeometry(0.12, 0.75, 0.12)
      const post = new THREE.Mesh(postGeo, this.guardrailMat)
      post.position.set(xPos, 0.375, pZ)
      railGroup.add(post)

      // Cat-eye reflector
      const refGeo = new THREE.BoxGeometry(0.04, 0.12, 0.12)
      const ref = new THREE.Mesh(refGeo, isLeft ? this.reflectorRedMat : this.reflectorWhiteMat)
      ref.position.set(xPos + (isLeft ? 0.08 : -0.08), 0.75, pZ)
      railGroup.add(ref)
    }

    return railGroup
  }

  // Bango Kubwa la Njia ya Tanzania (Highway Overhead Gantry / Road Signs)
  createHighwaySign(z) {
    const group = new THREE.Group()

    // Nguzo mbili za chuma
    const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 5.5, 8)
    const leftPost = new THREE.Mesh(postGeo, this.guardrailMat)
    leftPost.position.set(-6.5, 2.75, z)
    const rightPost = new THREE.Mesh(postGeo, this.guardrailMat)
    rightPost.position.set(6.5, 2.75, z)
    group.add(leftPost, rightPost)

    // Beam ya juu
    const beamGeo = new THREE.BoxGeometry(13.4, 0.2, 0.2)
    const beam = new THREE.Mesh(beamGeo, this.guardrailMat)
    beam.position.set(0, 5.3, z)
    group.add(beam)

    // Bango la Kijani la Alama za Barabarani
    const boardGeo = new THREE.BoxGeometry(6.5, 1.6, 0.1)
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 })
    const board = new THREE.Mesh(boardGeo, boardMat)
    board.position.set(0, 4.4, z)
    group.add(board)

    return group
  }

  // Uundaji wa Sehemu Moja ya Barabara (Chunk)
  createChunk(startZ) {
    const chunk = new THREE.Group()

    // 1. Barabara Kuu ya Lami (11m Asphalt Highway)
    const roadGeo = new THREE.PlaneGeometry(11.2, this.chunkLength)
    roadGeo.rotateX(-Math.PI / 2)
    const road = new THREE.Mesh(roadGeo, this.roadMaterial)
    road.position.set(0, 0, startZ + this.chunkLength / 2)
    road.receiveShadow = true
    chunk.add(road)

    // 2. Mabega ya Barabara (African Red Dirt Shoulders)
    const shoulderGeo = new THREE.PlaneGeometry(3.2, this.chunkLength)
    shoulderGeo.rotateX(-Math.PI / 2)

    const leftShoulder = new THREE.Mesh(shoulderGeo, this.shoulderMaterial)
    leftShoulder.position.set(-7.2, -0.01, startZ + this.chunkLength / 2)
    leftShoulder.receiveShadow = true

    const rightShoulder = new THREE.Mesh(shoulderGeo, this.shoulderMaterial)
    rightShoulder.position.set(7.2, -0.01, startZ + this.chunkLength / 2)
    rightShoulder.receiveShadow = true
    chunk.add(leftShoulder, rightShoulder)

    // 3. Savanna Grass Terrain (Pande zote)
    const grassGeo = new THREE.PlaneGeometry(140, this.chunkLength)
    grassGeo.rotateX(-Math.PI / 2)

    const leftGrass = new THREE.Mesh(grassGeo, this.grassMaterial)
    leftGrass.position.set(-78.8, -0.04, startZ + this.chunkLength / 2)
    leftGrass.receiveShadow = true

    const rightGrass = new THREE.Mesh(grassGeo, this.grassMaterial)
    rightGrass.position.set(78.8, -0.04, startZ + this.chunkLength / 2)
    rightGrass.receiveShadow = true
    chunk.add(leftGrass, rightGrass)

    // 4. Mistari ya Barabara (White Edge Lines & Dashed Yellow Center)
    const lineGeo = new THREE.PlaneGeometry(0.22, this.chunkLength)
    lineGeo.rotateX(-Math.PI / 2)

    const leftLine = new THREE.Mesh(lineGeo, this.whiteMarkingMat)
    leftLine.position.set(-5.1, 0.02, startZ + this.chunkLength / 2)

    const rightLine = new THREE.Mesh(lineGeo, this.whiteMarkingMat)
    rightLine.position.set(5.1, 0.02, startZ + this.chunkLength / 2)
    chunk.add(leftLine, rightLine)

    // Mistari ya njano ya katikati
    const dashLength = 5.0
    const gapLength = 5.0
    const totalStep = dashLength + gapLength
    const numDashes = Math.floor(this.chunkLength / totalStep)

    for (let i = 0; i < numDashes; i++) {
      const dashGeo = new THREE.PlaneGeometry(0.24, dashLength)
      dashGeo.rotateX(-Math.PI / 2)
      const dash = new THREE.Mesh(dashGeo, this.yellowMarkingMat)
      const dashZ = startZ + i * totalStep + dashLength / 2
      dash.position.set(0, 0.02, dashZ)
      chunk.add(dash)
    }

    // 5. Guardrails (Vyuma vya kando ya barabara)
    chunk.add(this.createGuardrail(startZ, this.chunkLength, true))
    chunk.add(this.createGuardrail(startZ, this.chunkLength, false))

    // 6. Nguzo za Umeme (Utility Poles kando ya barabara ya kushoto)
    const numPoles = 3
    for (let p = 0; p < numPoles; p++) {
      const poleZ = startZ + p * (this.chunkLength / numPoles) + 15
      chunk.add(this.createPowerPole(-9.5, poleZ))
    }

    // 7. Miti ya Acacia na Mazingira
    for (let t = 0; t < 10; t++) {
      const zOffset = startZ + (t / 10) * this.chunkLength + (Math.random() - 0.5) * 8
      // Kushoto
      const xLeft = -14 - Math.random() * 32
      chunk.add(this.createAcaciaTree(xLeft, zOffset))
      // Kulia
      const xRight = 14 + Math.random() * 32
      chunk.add(this.createAcaciaTree(xRight, zOffset))
    }

    // 8. Bango kubwa la Barabara kuu mara moja kila chunks 3
    if (Math.random() > 0.55) {
      chunk.add(this.createHighwaySign(startZ + 40))
    }

    chunk.userData = { startZ, endZ: startZ + this.chunkLength }
    this.scene.add(chunk)
    return chunk
  }

  initRoads() {
    let currentZ = -this.chunkLength
    for (let i = 0; i < this.numChunks; i++) {
      const chunk = this.createChunk(currentZ)
      this.roadChunks.push(chunk)
      currentZ += this.chunkLength
    }
  }

  // Mzunguko endelevu (Infinite Highway Update Loop)
  update(truckZ) {
    for (let i = 0; i < this.roadChunks.length; i++) {
      const chunk = this.roadChunks[i]
      if (truckZ - chunk.userData.endZ > 35) {
        let maxZ = -Infinity
        this.roadChunks.forEach(c => {
          if (c.userData.endZ > maxZ) maxZ = c.userData.endZ
        })

        const newStartZ = maxZ
        this.scene.remove(chunk)
        const newChunk = this.createChunk(newStartZ)
        this.roadChunks[i] = newChunk
      }
    }

    // Sogeza jua na milima pamoja na gari kwa smooth perspective
    this.sunLight.position.z = truckZ + 50
    this.sunLight.target.position.z = truckZ
    this.sunLight.target.updateMatrixWorld()

    if (this.mountainGroup) {
      this.mountainGroup.position.z = truckZ * 0.7 // Parallax effect
    }
  }
}
