import * as THREE from 'three'

// Uundaji wa Mandhari ya Barabara (Endless Highway World)
export class GameWorld {
  constructor(scene) {
    this.scene = scene
    this.roadChunks = []
    this.chunkLength = 120
    this.numChunks = 6
    this.sceneryObjects = []

    this.roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f242d, // Lami nyeusi
      roughness: 0.85,
      metalness: 0.1
    })

    this.shoulderMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b, // Udongo wa pembeni / vumbi
      roughness: 0.95
    })

    this.grassMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d4a22, // Nyasi za kando
      roughness: 0.9
    })

    this.whiteMarkingMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    this.yellowMarkingMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    this.trunkMat = new THREE.MeshStandardMaterial({ color: 0x452b14, roughness: 0.9 })
    this.foliageMat = new THREE.MeshStandardMaterial({ color: 0x1e3a1e, roughness: 0.8 })
    this.metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 })

    this.initLighting()
    this.initRoads()
  }

  initLighting() {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(this.ambientLight)

    // Sun / Moonlight
    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.2)
    this.sunLight.position.set(40, 60, 40)
    this.sunLight.castShadow = true
    this.sunLight.shadow.mapSize.width = 1024
    this.sunLight.shadow.mapSize.height = 1024
    this.sunLight.shadow.camera.near = 10
    this.sunLight.shadow.camera.far = 200
    this.scene.add(this.sunLight)

    // Sky background
    this.scene.background = new THREE.Color(0x0f172a)
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.007)
  }

  createTree(x, z) {
    const tree = new THREE.Group()
    const height = 3.5 + Math.random() * 2.5

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, height, 6)
    const trunk = new THREE.Mesh(trunkGeo, this.trunkMat)
    trunk.position.y = height / 2
    trunk.castShadow = true
    tree.add(trunk)

    // Foliage (Acacia umbrella shape)
    const folGeo = new THREE.CylinderGeometry(2.5, 0.5, 1.2, 7)
    const fol = new THREE.Mesh(folGeo, this.foliageMat)
    fol.position.y = height + 0.6
    fol.castShadow = true
    tree.add(fol)

    tree.position.set(x, 0, z)
    return tree
  }

  createSign(text, x, z) {
    const group = new THREE.Group()

    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8)
    const post = new THREE.Mesh(postGeo, this.metalMat)
    post.position.y = 1.6
    group.add(post)

    const boardGeo = new THREE.BoxGeometry(2.2, 1.2, 0.1)
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x166534, metalness: 0.2, roughness: 0.5 })
    const board = new THREE.Mesh(boardGeo, boardMat)
    board.position.set(0, 2.8, 0)
    group.add(board)

    group.position.set(x, 0, z)
    return group
  }

  createChunk(startZ) {
    const chunk = new THREE.Group()

    // 1. Asphalt Road (Upana: 11m, Urefu: chunkLength)
    const roadGeo = new THREE.PlaneGeometry(11, this.chunkLength)
    roadGeo.rotateX(-Math.PI / 2)
    const road = new THREE.Mesh(roadGeo, this.roadMaterial)
    road.position.set(0, 0, startZ + this.chunkLength / 2)
    road.receiveShadow = true
    chunk.add(road)

    // 2. Road Shoulders (Mchanga/Vumbi pembeni)
    const shoulderGeo = new THREE.PlaneGeometry(3, this.chunkLength)
    shoulderGeo.rotateX(-Math.PI / 2)

    const leftShoulder = new THREE.Mesh(shoulderGeo, this.shoulderMaterial)
    leftShoulder.position.set(-7, -0.02, startZ + this.chunkLength / 2)
    leftShoulder.receiveShadow = true

    const rightShoulder = new THREE.Mesh(shoulderGeo, this.shoulderMaterial)
    rightShoulder.position.set(7, -0.02, startZ + this.chunkLength / 2)
    rightShoulder.receiveShadow = true
    chunk.add(leftShoulder, rightShoulder)

    // 3. Grass Terrain (Pande zote mbili)
    const grassGeo = new THREE.PlaneGeometry(120, this.chunkLength)
    grassGeo.rotateX(-Math.PI / 2)

    const leftGrass = new THREE.Mesh(grassGeo, this.grassMaterial)
    leftGrass.position.set(-68.5, -0.05, startZ + this.chunkLength / 2)
    leftGrass.receiveShadow = true

    const rightGrass = new THREE.Mesh(grassGeo, this.grassMaterial)
    rightGrass.position.set(68.5, -0.05, startZ + this.chunkLength / 2)
    rightGrass.receiveShadow = true
    chunk.add(leftGrass, rightGrass)

    // 4. Road Markings (Mistari ya barabarani)
    // Fog lines (White edge lines)
    const lineGeo = new THREE.PlaneGeometry(0.18, this.chunkLength)
    lineGeo.rotateX(-Math.PI / 2)

    const leftLine = new THREE.Mesh(lineGeo, this.whiteMarkingMat)
    leftLine.position.set(-5.0, 0.02, startZ + this.chunkLength / 2)

    const rightLine = new THREE.Mesh(lineGeo, this.whiteMarkingMat)
    rightLine.position.set(5.0, 0.02, startZ + this.chunkLength / 2)
    chunk.add(leftLine, rightLine)

    // Center Dashed Yellow Line (Mistari ya katikati ya njano)
    const dashLength = 4
    const gapLength = 4
    const totalStep = dashLength + gapLength
    const numDashes = Math.floor(this.chunkLength / totalStep)

    for (let i = 0; i < numDashes; i++) {
      const dashGeo = new THREE.PlaneGeometry(0.2, dashLength)
      dashGeo.rotateX(-Math.PI / 2)
      const dash = new THREE.Mesh(dashGeo, this.yellowMarkingMat)
      const dashZ = startZ + i * totalStep + dashLength / 2
      dash.position.set(0, 0.02, dashZ)
      chunk.add(dash)
    }

    // 5. Trees & Scenery kando ya barabara
    for (let i = 0; i < 8; i++) {
      const zOffset = startZ + (i / 8) * this.chunkLength + (Math.random() - 0.5) * 6
      // Upande wa kushoto
      const xLeft = -10 - Math.random() * 25
      chunk.add(this.createTree(xLeft, zOffset))

      // Upande wa kulia
      const xRight = 10 + Math.random() * 25
      chunk.add(this.createTree(xRight, zOffset))
    }

    // Mileage sign mara moja kila chunks 2
    if (Math.random() > 0.4) {
      const signZ = startZ + 20
      chunk.add(this.createSign("TANZANIA HIGHWAY", 6.8, signZ))
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

  // Weka barabara iwe endless inavyozidi kwenda mbele
  update(truckZ) {
    for (let i = 0; i < this.roadChunks.length; i++) {
      const chunk = this.roadChunks[i]
      // Lori likipita chunk nyuma, uhamishe mbele kabisa
      if (truckZ - chunk.userData.endZ > 30) {
        // Pata chunk iliyopo mbele zaidi
        let maxZ = -Infinity
        this.roadChunks.forEach(c => {
          if (c.userData.endZ > maxZ) maxZ = c.userData.endZ
        })

        const newStartZ = maxZ
        const newEndZ = newStartZ + this.chunkLength

        this.scene.remove(chunk)
        const newChunk = this.createChunk(newStartZ)
        this.roadChunks[i] = newChunk
      }
    }

    // Hamisha mwanga wa jua pamoja na gari
    this.sunLight.position.z = truckZ + 40
    this.sunLight.target.position.z = truckZ
    this.sunLight.target.updateMatrixWorld()
  }
}
