/* eslint-disable class-methods-use-this */
import { BufferGeometry, Material, Mesh, Object3D } from "three"
import gsap, { Expo } from "gsap"

export class Stalk {
  // container
  objectContainer: Object3D

  // stalk
  stalkGeometry: BufferGeometry | null = null

  stalkMaterial: Material

  stalkMesh: Mesh | null = null

  stalk: Object3D | null = null

  maxHeight = 42.3

  // geometry options
  pathGeometry: BufferGeometry | null = null

  filledGeometry: BufferGeometry | null = null

  geometryIndex = 0

  // animate
  stemGrowthEase = Expo.easeOut

  growTime = 5

  remainderGrowTime = 20

  stemAnimation: any = { growthProgress: 0 }

  stemRemainderAnimation = { remainderGrowthProgress: 0 }

  blendAmount = -1

  remainderBlendAmount = -1

  // taper
  topTaperSize = 0.5

  taperPower = 0.4

  // states
  pathPositions: { x: number; y: number; z: number }[] = []

  stalkGenerated = false

  // misc
  generated = false

  baseRandomSeed: string

  /* ---------------------------------- init ---------------------------------- */
  constructor(container: Object3D, material: Material, baseRandomSeed: string) {
    this.objectContainer = container
    this.stalkMaterial = material
    this.baseRandomSeed = baseRandomSeed
  }

  /* --------------------------------- helpers -------------------------------- */
  private reset() {
    this.baseRandomSeed = `${Math.random() * 1000}`

    if (this.stalk) {
      this.objectContainer.remove(this.stalk)
      this.stalk = null
    }
  }

  private blendGeoPoints(e: BufferGeometry, t: BufferGeometry, n: number, r: number) {
    return e.attributes.position.array[n] + (t.attributes.position.array[n] - e.attributes.position.array[n]) * r
  }

  /**
   * Grow stalk
   */
  private updateStalkGeometry() {
    /// check if grown: don't update
    if (!this.pathGeometry || !this.filledGeometry || !this.stalkGeometry) {
      return
    }

    // blend amount
    this.blendAmount = this.stemAnimation.growthProgress
    this.remainderBlendAmount = this.stemRemainderAnimation.remainderGrowthProgress

    // taper stem
    /// not sure how this works
    for (let s = 0; s < this.stalkGeometry.attributes.position.array.length; s += 3) {
      const currY = this.stalkGeometry.attributes.position.array[s + 1]

      // tapering
      let r =
        (currY - this.maxHeight * this.remainderBlendAmount) /
        (this.maxHeight * this.blendAmount - this.maxHeight * this.remainderBlendAmount)
      r = 1 - Math.max(0, Math.min(1, r))
      r **= this.taperPower

      if (r > 0) {
        const i = this.topTaperSize * this.blendAmount
        r = i + r * (1 - i)
      } else {
        r = 0
      }

      this.stalkGeometry.attributes.position.setXYZ(
        s / 3,
        this.blendGeoPoints(this.pathGeometry, this.filledGeometry, s + 0, r),
        this.blendGeoPoints(this.pathGeometry, this.filledGeometry, s + 1, r),
        this.blendGeoPoints(this.pathGeometry, this.filledGeometry, s + 2, r)
      )
    }

    this.stalkGeometry.attributes.position.needsUpdate = !0
  }

  private setPathPositions() {
    if (!this.stalkGeometry) {
      return
    }

    this.pathPositions = []
    const positions = []

    // add position at each y to pathPositions
    for (let i = 0; i < this.stalkGeometry.attributes.position.array.length; i += 3) {
      let currY = this.stalkGeometry.attributes.position.array[i + 1]
      currY = Math.round(currY * 100) / 100

      // add position if currY hasn't been seen yet
      if (!positions[currY]) {
        const position = {
          x: this.stalkGeometry.attributes.position.array[i + 0],
          y: this.stalkGeometry.attributes.position.array[i + 1],
          z: this.stalkGeometry.attributes.position.array[i + 2],
        }

        positions[currY] = position

        // insert into pathPositions in the correct order
        let curInsertIndex = 0
        while (curInsertIndex < this.pathPositions.length && this.pathPositions[curInsertIndex].y < position.y) {
          curInsertIndex += 1
        }
        this.pathPositions.splice(curInsertIndex, 0, position)
      }
    }
  }

  private generateStalk() {
    if (!this.filledGeometry) {
      return
    }

    this.stalkGeometry = this.filledGeometry.clone()

    this.updateStalkGeometry()
    this.setPathPositions()

    this.stalkMesh = new Mesh(this.stalkGeometry as BufferGeometry, this.stalkMaterial)

    // add to stalk
    if (this.stalk) {
      this.stalk.add(this.stalkMesh)
    }
    this.stalkGenerated = !0
  }

  private blendPoints(e: { x: number; y: number; z: number }, t: { x: number; y: number; z: number }, n: number) {
    const r = {
      x: e.x + (t.x - e.x) * n,
      y: e.y + (t.y - e.y) * n,
      z: e.z + (t.z - e.z) * n,
    }

    return r
  }

  private getStalkPosition(_y: number) {
    let result = { x: 0, y: 0, z: 0 }

    if (this.pathPositions) {
      // calculate index
      const _index = _y * this.pathPositions.length
      let index = Math.floor(_index)
      index = Math.max(0, Math.min(this.pathPositions.length - 1, index))

      // smooth if not last point
      let _result = { x: 0, y: 0, z: 0 }
      _result = this.pathPositions[index]

      if (index < this.pathPositions.length - 1) {
        const n = this.pathPositions[index + 1]
        const r = _index - index
        _result = this.blendPoints(_result, n, r)
      }

      // set result
      result = _result
    }

    return result
  }

  private getStalkEndPosition() {
    if (!this.generated) {
      return { x: 0, y: 0, z: 0 }
    }

    const progress = this.stemAnimation.growthProgress

    return this.getStalkPosition(progress)
  }

  /* ------------------------------ entry points ------------------------------ */
  public setGeometriesFromModels(pathModel: Object3D, filledModel: Object3D) {
    this.pathGeometry = (pathModel.children[0] as Mesh).geometry

    this.filledGeometry = (filledModel.children[0] as Mesh).geometry
  }

  public generate() {
    // check whether to regrow
    if (this.generated) {
      this.reset()
    } else {
      this.generated = true
    }

    // animate
    gsap.killTweensOf(this.stemAnimation)
    gsap.fromTo(
      this.stemAnimation,
      { growthProgress: 0 },
      {
        growthProgress: 1,
        duration: this.growTime,
        ease: this.stemGrowthEase,
      }
    )
    gsap.killTweensOf(this.stemRemainderAnimation)
    gsap.fromTo(
      this.stemRemainderAnimation,
      { remainderGrowthProgress: 0 },
      {
        remainderGrowthProgress: 1,
        duration: this.remainderGrowTime,
        ease: this.stemGrowthEase,
      }
    )

    // create stalk
    this.stalk = new Object3D()
    this.objectContainer.add(this.stalk)
    this.generateStalk()
  }

  public update() {
    if (this.stalkGenerated) {
      this.updateStalkGeometry()
    }
  }

  public getStalkEndOrientation() {
    const progress = this.stemAnimation.growthProgress
    const endPosition = this.getStalkEndPosition()
    const prevPosition = this.getStalkPosition(progress - 0.05)

    if (!prevPosition) {
      return { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } }
    }

    // smoothed position
    const position = {
      x: prevPosition.x - endPosition.x,
      y: prevPosition.y - endPosition.y,
      z: prevPosition.z - endPosition.z,
    }

    // get angle
    const rotation = { x: 0, y: 0, z: 0 }
    if (position.z !== 0 && position.y !== 0) {
      rotation.x = -Math.atan2(position.y, position.z)
    }

    const s: any = {}
    s.position = endPosition
    s.rotation = rotation
    return s
  }
}
