import * as THREE from 'three'

// Ujenzi wa Karakana Halisi ya Ndani (Realistic 3D Indoor Garage / Workshop)
export class GarageScene {
  constructor(scene) {
    this.scene = scene
    this.garageGroup = new THREE.Group()
    this.initMaterials()
    this.buildHangar()
    this.buildProps()
    this.buildLighting()
    this.scene.add(this.garageGroup)
  }

  initMaterials() {
    // Sakafu ya zege iliyosuguliwa (Polished concrete floor with light reflection)
    const floorCanvas = document.createElement('canvas')
    floorCanvas.width = 512
    floorCanvas.height = 512
    const ctx = floorCanvas.getContext('2d')
    ctx.fillStyle = '#1e242d'
    ctx.fillRect(0, 0, 512, 512)
    // Concrete speckle texture
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#282e38' : '#171c24'
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2)
    }
    // Parking Bay Yellow Lines
    ctx.strokeStyle = '#eab308'
    ctx.lineWidth = 14
    ctx.strokeRect(40, 20, 432, 472)

    const floorTex = new THREE.CanvasTexture(floorCanvas)
    floorTex.wrapS = THREE.RepeatWrapping
    floorTex.wrapT = THREE.RepeatWrapping
    floorTex.repeat.set(2, 2)

    this.floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.35,
      metalness: 0.25
    })

    // Ukuta wa zege na mabati ya viwandani (Industrial walls)
    this.wallMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.8,
      metalness: 0.2
    })

    this.brickMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.9,
      metalness: 0.1
    })

    this.girderMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.4
    })

    this.metalBoxMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c, // Red Snap-On style tool box
      metalness: 0.7,
      roughness: 0.3
    })

    this.oilDrumMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1, // Blue Oil Drums (Total / Puma)
      metalness: 0.6,
      roughness: 0.4
    })

    this.tireMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.9
    })

    this.lightHousingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 2.0
    })
  }

  buildHangar() {
    const width = 28
    const length = 32
    const height = 9

    // 1. Sakafu (Floor)
    const floorGeo = new THREE.PlaneGeometry(width, length)
    floorGeo.rotateX(-Math.PI / 2)
    const floor = new THREE.Mesh(floorGeo, this.floorMat)
    floor.receiveShadow = true
    this.garageGroup.add(floor)

    // 2. Ukuta wa Nyuma (Back Wall)
    const backWallGeo = new THREE.PlaneGeometry(width, height)
    const backWall = new THREE.Mesh(backWallGeo, this.brickMat)
    backWall.position.set(0, height / 2, -length / 2)
    backWall.receiveShadow = true
    this.garageGroup.add(backWall)

    // 3. Ukuta wa Kushoto na Kulia (Side Walls)
    const sideWallGeo = new THREE.PlaneGeometry(length, height)
    sideWallGeo.rotateY(Math.PI / 2)

    const leftWall = new THREE.Mesh(sideWallGeo, this.wallMat)
    leftWall.position.set(-width / 2, height / 2, 0)
    leftWall.receiveShadow = true

    const rightWall = new THREE.Mesh(sideWallGeo, this.wallMat)
    rightWall.position.set(width / 2, height / 2, 0)
    rightWall.receiveShadow = true
    this.garageGroup.add(leftWall, rightWall)

    // 4. Dari ya Chuma na Viguzo (Roof & Steel Girders/Trusses)
    const roofGeo = new THREE.PlaneGeometry(width, length)
    roofGeo.rotateX(Math.PI / 2)
    const roof = new THREE.Mesh(roofGeo, this.wallMat)
    roof.position.set(0, height, 0)
    this.garageGroup.add(roof)

    // Steel Trusses / Girders
    for (let z = -length / 2 + 5; z < length / 2; z += 7) {
      const girderGeo = new THREE.BoxGeometry(width, 0.4, 0.4)
      const girder = new THREE.Mesh(girderGeo, this.girderMat)
      girder.position.set(0, height - 0.5, z)
      this.garageGroup.add(girder)
    }

    // 5. Mlango Mkubwa wa Gereji (Front Open Garage Entrance)
    // Nguzo za geti la gereji
    const pLeft = new THREE.Mesh(new THREE.BoxGeometry(2, height, 1), this.wallMat)
    pLeft.position.set(-width / 2 + 1, height / 2, length / 2)
    const pRight = new THREE.Mesh(new THREE.BoxGeometry(2, height, 1), this.wallMat)
    pRight.position.set(width / 2 - 1, height / 2, length / 2)
    const pTop = new THREE.Mesh(new THREE.BoxGeometry(width, 2, 1), this.wallMat)
    pTop.position.set(0, height - 1, length / 2)
    this.garageGroup.add(pLeft, pRight, pTop)
  }

  buildProps() {
    // 1. Kabati za Vifaa (Red Mechanic Tool Cabinets)
    for (let i = 0; i < 3; i++) {
      const boxGeo = new THREE.BoxGeometry(1.8, 2.2, 0.8)
      const box = new THREE.Mesh(boxGeo, this.metalBoxMat)
      box.position.set(-12 + i * 2.2, 1.1, -14.5)
      box.castShadow = true
      this.garageGroup.add(box)
    }

    // 2. Matangi ya Mafuta ya Kupaka/Injini (Oil Drums Stacks)
    const drumPositions = [
      { x: 11.5, z: -14 },
      { x: 12.5, z: -14 },
      { x: 12.0, z: -12.8 },
      { x: -12.5, z: 8 },
      { x: -12.5, z: 9.5 }
    ]

    drumPositions.forEach(pos => {
      const drumGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.3, 16)
      const drum = new THREE.Mesh(drumGeo, this.oilDrumMat)
      drum.position.set(pos.x, 0.65, pos.z)
      drum.castShadow = true
      this.garageGroup.add(drum)
    })

    // 3. Rundo la Magurudumu na Matairi Mapya ya Lori (Spare Truck Tires)
    for (let t = 0; t < 4; t++) {
      const tireGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.38, 16)
      const tire = new THREE.Mesh(tireGeo, this.tireMat)
      tire.position.set(11.8, 0.19 + t * 0.4, 2)
      tire.castShadow = true
      this.garageGroup.add(tire)
    }

    // 4. Jack Kubwa ya Kunyanyulia Lori (Heavy Duty Truck Jack)
    const jackGeo = new THREE.BoxGeometry(0.8, 0.4, 1.8)
    const jack = new THREE.Mesh(jackGeo, this.metalBoxMat)
    jack.position.set(4.5, 0.2, 4)
    this.garageGroup.add(jack)
  }

  buildLighting() {
    // 1. Mwangaza wa ndani ya karakana (Soft Ambient Light)
    const ambient = new THREE.AmbientLight(0xffffff, 0.8)
    this.garageGroup.add(ambient)

    // 2. Taa za Viwandani Juu ya Dari (Industrial High-Bay Overhead Spotlights)
    const lightPositions = [
      { x: -5, z: -4 },
      { x: 5, z: -4 },
      { x: -5, z: 4 },
      { x: 5, z: 4 }
    ]

    lightPositions.forEach(lp => {
      // Fixture box
      const fixGeo = new THREE.BoxGeometry(1.2, 0.2, 0.6)
      const fix = new THREE.Mesh(fixGeo, this.lightHousingMat)
      fix.position.set(lp.x, 8.4, lp.z)
      this.garageGroup.add(fix)

      // Spotlight ikimulika gari katikati
      const spot = new THREE.SpotLight(0xfffaea, 4.0, 24, Math.PI / 4, 0.4)
      spot.position.set(lp.x, 8.3, lp.z)
      spot.target.position.set(0, 1.5, 0)
      spot.castShadow = true
      spot.shadow.mapSize.width = 1024
      spot.shadow.mapSize.height = 1024
      this.garageGroup.add(spot, spot.target)
    })

    // 3. Mwangaza wa Jua la Asubuhi linaloingia kupitia lango la gereji
    const sunThroughDoor = new THREE.DirectionalLight(0xffedcc, 1.5)
    sunThroughDoor.position.set(0, 4, 25)
    sunThroughDoor.target.position.set(0, 1.5, 0)
    sunThroughDoor.castShadow = true
    this.garageGroup.add(sunThroughDoor, sunThroughDoor.target)
  }

  destroy() {
    this.scene.remove(this.garageGroup)
  }
}

