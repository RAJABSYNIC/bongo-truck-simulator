import * as THREE from 'three'

// Uundaji wa Mandhari Halisi ya Barabara za Tanzania (Winding Hills, Drainage Ditch & Trees)
export class GameWorld {
  constructor(scene) {
    this.scene = scene
    this.roadChunks = []
    this.chunkLength = 150
    this.numChunks = 6

    this.initMaterials()
    this.initLighting()
    this.initMountains()
    this.initRoads()
  }

  initMaterials() {
    // 1. Lami ya kweli (Textured Highway Asphalt)
    const asphaltCanvas = document.createElement('canvas')
    asphaltCanvas.width = 512
    asphaltCanvas.height = 512
    const ctx = asphaltCanvas.getContext('2d')
    ctx.fillStyle = '#22272e'
    ctx.fillRect(0, 0, 512, 512)

    // Grainy asphalt aggregate
    for (let i = 0; i < 4000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#2d333b' : '#181b20'
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2)
    }

    const asphaltTex = new THREE.CanvasTexture(asphaltCanvas)
    asphaltTex.wrapS = THREE.RepeatWrapping
    asphaltTex.wrapT = THREE.RepeatWrapping
    asphaltTex.repeat.set(2, 8)

    this.roadMaterial = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      roughness: 0.85,
      metalness: 0.1
    })

    // 2. Mfereji wa Zege wa Kando ya Barabara (Concrete Drainage Trench as seen in Image 1)
    this.ditchConcreteMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Concrete Gray
      roughness: 0.9,
      metalness: 0.1
    })

    // 3. Udongo mwekundu wa Afrika Mashariki (African Red Clay / Murram)
    this.shoulderMaterial = new THREE.MeshStandardMaterial({
      color: 0xa85324,
      roughness: 0.96
    })

    // 4. Nyasi za milimani na kando ya barabara (Lush Green Grass as seen in photos)
    this.grassMaterial = new THREE.MeshStandardMaterial({
      color: 0x365314, // Deep Lush African Green
      roughness: 0.9
    })

    // 5. Mistari ya barabarani (Clean White Dashed Center and Edge Lines)
    this.whiteMarkingMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    this.yellowMarkingMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 })

    // 6. Vyuma vya kando ya barabara (Galvanized Steel Guardrails)
    this.guardrailMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.88,
      roughness: 0.22
    })
    this.reflectorRedMat = new THREE.MeshBasicMaterial({ color: 0xef4444 })
    this.reflectorWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff })

    // 7. Miti mikubwa na majani (Dense Roadside Trees and Shrubs)
    this.trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2719, roughness: 0.92 })
    this.foliageDarkMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.8 })
    this.foliageLightMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.75 })
    this.mountainMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.95 })
  }

  initLighting() {
    // Hemisphere Light (Sky Blue + Earthy Soil Bounce)
    this.hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x5a3e1b, 0.85)
    this.scene.add(this.hemiLight)

    // Jua kali la Kitanzania (Warm Sunlight)
    this.sunLight = new THREE.DirectionalLight(0xfffaea, 1.8)
    this.sunLight.position.set(50, 80, 50)
    this.sunLight.castShadow = true
    this.sunLight.shadow.mapSize.width = 2048
    this.sunLight.shadow.mapSize.height = 2048
    this.sunLight.shadow.camera.near = 10
    this.sunLight.shadow.camera.far = 280
    this.sunLight.shadow.camera.left = -45
    this.sunLight.shadow.camera.right = 45
    this.sunLight.shadow.camera.top = 45
    this.sunLight.shadow.camera.bottom = -45
    this.sunLight.shadow.bias = -0.0004
    this.scene.add(this.sunLight)

    // Anga safi ya bluu yenye ukungu wa mbali (Horizon Fog)
    this.scene.background = new THREE.Color(0x7dd3fc)
    this.scene.fog = new THREE.FogExp2(0x7dd3fc, 0.0035)
  }

  initMountains() {
    this.mountainGroup = new THREE.Group()

    for (let i = 0; i < 20; i++) {
      const radius = 70 + Math.random() * 50
      const height = 40 + Math.random() * 35
      const coneGeo = new THREE.ConeGeometry(radius, height, 8)
      const mountain = new THREE.Mesh(coneGeo, this.mountainMat)

      const side = i % 2 === 0 ? -1 : 1
      const x = side * (130 + Math.random() * 70)
      const z = (i - 5) * 80
      mountain.position.set(x, height / 2 - 8, z)
      this.mountainGroup.add(mountain)
    }

    this.scene.add(this.mountainGroup)
  }

  // Mti Mkubwa wa Asili (Dense Tanzanian Forest Tree as seen in photos)
  createRoadsideTree(x, z) {
    const tree = new THREE.Group()
    const height = 5.0 + Math.random() * 3.5

    // Shina la mti
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, height, 8)
    const trunk = new THREE.Mesh(trunkGeo, this.trunkMat)
    trunk.position.y = height / 2
    trunk.castShadow = true
    tree.add(trunk)

    // Matawi na majani manene (Volumetric Leaf Canopy)
    const foliageMat = Math.random() > 0.5 ? this.foliageDarkMat : this.foliageLightMat

    for (let l = 0; l < 3; l++) {
      const rad = 2.4 - l * 0.4 + Math.random() * 0.4
      const canGeo = new THREE.SphereGeometry(rad, 8, 8)
      const can = new THREE.Mesh(canGeo, foliageMat)
      can.position.set((Math.random() - 0.5) * 0.8, height + l * 1.2, (Math.random() - 0.5) * 0.8)
      can.castShadow = true
      tree.add(can)
    }

    tree.position.set(x, 0, z)
    return tree
  }

  // Mfereji wa Zege wa Kando ya Barabara (Concrete Drainage Trench - Image 1)
  createDrainageDitch(startZ, length, isLeft) {
    const ditchGroup = new THREE.Group()
    const xPos = isLeft ? -7.6 : 7.6

    // Trench channel
    const trenchGeo = new THREE.BoxGeometry(0.8, 0.4, length)
    const trench = new THREE.Mesh(trenchGeo, this.ditchConcreteMat)
    trench.position.set(xPos, -0.15, startZ + length / 2)
    trench.receiveShadow = true
    ditchGroup.add(trench)

    return ditchGroup
  }

  // Guardrail yenye Reflectors
  createGuardrail(startZ, length, isLeft) {
    const railGroup = new THREE.Group()
    const xPos = isLeft ? -5.9 : 5.9

    const beamGeo = new THREE.BoxGeometry(0.12, 0.35, length)
    const beam = new THREE.Mesh(beamGeo, this.guardrailMat)
    beam.position.set(xPos, 0.75, startZ + length / 2)
    beam.castShadow = true
    railGroup.add(beam)

    const numPosts = Math.floor(length / 8)
    for (let i = 0; i < numPosts; i++) {
      const pZ = startZ + i * 8
      const postGeo = new THREE.BoxGeometry(0.12, 0.75, 0.12)
      const post = new THREE.Mesh(postGeo, this.guardrailMat)
      post.position.set(xPos, 0.375, pZ)
      railGroup.add(post)

      const refGeo = new THREE.BoxGeometry(0.04, 0.12, 0.12)
      const ref = new THREE.Mesh(refGeo, isLeft ? this.reflectorRedMat : this.reflectorWhiteMat)
      ref.position.set(xPos + (isLeft ? 0.08 : -0.08), 0.75, pZ)
      railGroup.add(ref)
    }

    return railGroup
  }

  createChunk(startZ) {
    const chunk = new THREE.Group()

    // 1. Asphalt Highway (Upana: 11.2m)
    const roadGeo = new THREE.PlaneGeometry(11.2, this.chunkLength)
    roadGeo.rotateX(-Math.PI / 2)
    const road = new THREE.Mesh(roadGeo, this.roadMaterial)
    road.position.set(0, 0, startZ + this.chunkLength / 2)
    road.receiveShadow = true
    chunk.add(road)

    // 2. Mabega ya Udongo Mwekundu (African Red Dirt Road Shoulders)
    const shoulderGeo = new THREE.PlaneGeometry(2.5, this.chunkLength)
    shoulderGeo.rotateX(-Math.PI / 2)

    const leftShoulder = new THREE.Mesh(shoulderGeo, this.shoulderMaterial)
    leftShoulder.position.set(-6.8, -0.01, startZ + this.chunkLength / 2)
    leftShoulder.receiveShadow = true

    const rightShoulder = new THREE.Mesh(shoulderGeo, this.shoulderMaterial)
    rightShoulder.position.set(6.8, -0.01, startZ + this.chunkLength / 2)
    rightShoulder.receiveShadow = true
    chunk.add(leftShoulder, rightShoulder)

    // 3. Mfereji wa Zege wa Maji (Concrete Drainage Trench pembeni)
    chunk.add(this.createDrainageDitch(startZ, this.chunkLength, true))
    chunk.add(this.createDrainageDitch(startZ, this.chunkLength, false))

    // 4. Milima na Miinuko ya Nyasi (Lush Green Embankments)
    const grassGeo = new THREE.PlaneGeometry(150, this.chunkLength)
    grassGeo.rotateX(-Math.PI / 2)

    const leftGrass = new THREE.Mesh(grassGeo, this.grassMaterial)
    leftGrass.position.set(-83, -0.04, startZ + this.chunkLength / 2)
    leftGrass.receiveShadow = true

    const rightGrass = new THREE.Mesh(grassGeo, this.grassMaterial)
    rightGrass.position.set(83, -0.04, startZ + this.chunkLength / 2)
    rightGrass.receiveShadow = true
    chunk.add(leftGrass, rightGrass)

    // 5. Mistari ya Barabara (White Edge Lines & Dashed Center Divider)
    const lineGeo = new THREE.PlaneGeometry(0.2, this.chunkLength)
    lineGeo.rotateX(-Math.PI / 2)

    const leftLine = new THREE.Mesh(lineGeo, this.whiteMarkingMat)
    leftLine.position.set(-5.1, 0.02, startZ + this.chunkLength / 2)

    const rightLine = new THREE.Mesh(lineGeo, this.whiteMarkingMat)
    rightLine.position.set(5.1, 0.02, startZ + this.chunkLength / 2)
    chunk.add(leftLine, rightLine)

    // Mistari ya doti ya katikati
    const dashLength = 4.5
    const gapLength = 4.5
    const totalStep = dashLength + gapLength
    const numDashes = Math.floor(this.chunkLength / totalStep)

    for (let i = 0; i < numDashes; i++) {
      const dashGeo = new THREE.PlaneGeometry(0.22, dashLength)
      dashGeo.rotateX(-Math.PI / 2)
      const dash = new THREE.Mesh(dashGeo, this.whiteMarkingMat)
      const dashZ = startZ + i * totalStep + dashLength / 2
      dash.position.set(0, 0.02, dashZ)
      chunk.add(dash)
    }

    // 6. Vyuma vya Kando ya Barabara (Guardrails)
    chunk.add(this.createGuardrail(startZ, this.chunkLength, true))
    chunk.add(this.createGuardrail(startZ, this.chunkLength, false))

    // 7. Miti Mingi ya Kando ya Barabara (Dense Roadside Green Trees as in photos)
    for (let t = 0; t < 14; t++) {
      const zOffset = startZ + (t / 14) * this.chunkLength + (Math.random() - 0.5) * 6
      const xLeft = -11 - Math.random() * 28
      chunk.add(this.createRoadsideTree(xLeft, zOffset))

      const xRight = 11 + Math.random() * 28
      chunk.add(this.createRoadsideTree(xRight, zOffset))
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

    this.sunLight.position.z = truckZ + 50
    this.sunLight.target.position.z = truckZ
    this.sunLight.target.updateMatrixWorld()

    if (this.mountainGroup) {
      this.mountainGroup.position.z = truckZ * 0.75
    }
  }
}
