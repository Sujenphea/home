/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable class-methods-use-this */
import { MutableRefObject } from "react"
import seedrandom from "seedrandom"
import { BufferGeometry, Material, Mesh, MeshBasicMaterial, Object3D, TextureLoader } from "three"
import gsap, { Expo } from "gsap"
import { DEG_TO_RAD } from "../utils/math"
import { PetalStyleModel } from "./PetalModel"
import { PetalObject } from "./PetalObject"

type PetalProperties = {
  isStamen: boolean
  isPreStamen: boolean
  spawnAngle: number
  spawnCenterOffset: number
  spawnOffsetX: number
  spawnOffsetZ: number
  endSpawnPosition: number
  spawnScale: number
  spawnScaleZ: number
  spawnAngleZ: number
  endSpawnScale: number
  petalLength: number
  petalWidth: number
  petalThickness: number
  sidePetalOffsetRotationX: number
  petalGeometryBlendAmount: number
  spawnOutwards: boolean
  spawnInwards: boolean
  petalMaterial: Material | null
  petalGeometry: BufferGeometry | null
}

/**
 * Starts building from the outermost petals to the innermost petals.
 * Each layer of petal composition is determined by petalProperties in its corresponding depth,
 * where the outermost petals is considered at depth 0.
 * The preious layer of petals determines whether to 'spawn' another layer of petals in two directions:
 * inwards or outwards.
 * There are two types of flowers that are created: orchid, normal.
 */
export class FlowerSpawner {
  // objects
  petalModel: PetalStyleModel

  objectContainer: MutableRefObject<Object3D>

  textureLoader = new TextureLoader()

  // geometries
  petalGeometries: BufferGeometry[] = []

  stamenGeometries: BufferGeometry[] = []

  // materials
  petalMaterial: Material | null = null

  // textures
  stamenTexture: string | null = null

  // states
  generated = false

  petalProperties: PetalProperties[] = [] // for each layer

  animatingPetals: PetalObject[] = []

  baseRandomSeed = `${Math.random() * 1000}`

  flowerIsOrchid = false

  curNumDepths = 0

  currPetalStack: Object3D | null = null

  /* -------------------------------- constants ------------------------------- */
  multiplyBlendMode = !1

  discreteColors = false

  // texture
  useSimpleTextures = !1

  // scale
  isCounterScaleFlower = false

  flowerScale = 4

  viewScale = this.flowerScale

  targetRadius = 10

  // colours
  colourBlend = 0.5

  colourBlendVariation = 0.2

  useDiscreteColors = false

  useFixedColourBlend = false

  // geometry
  geometryBlend = 0.5

  geometryBlendVariation = 0.5

  useDiscreteGeometry = false

  useFixedGeometryBlend = false

  // orchids
  useOrchids = true

  orchidProbablity = 0.25

  // stamen
  stamenProbablity = 0.5

  stamenScale = 0.15

  stamenScaleVariation = 0.2

  stamenScaleZ = 0.4

  stamenScaleZVariation = 0.3

  orchidStamenScaleZ = 0.5

  orchidStamenScaleZVariation = 0.6

  stamenIndividualScaleVariation = 0.1

  stamenIndividualScaleZVariation = 0.05

  stamenAngleStartZ = 20

  stamenAngleStartZVariation = 1

  stamenOffsetY = 0.05

  stamenOffsetYVariation = 0.05

  usePetalTextureForStamen = false

  minStamenSymmetry = 3

  maxStamenSymmetry = 9

  stamenSymmetryBias = 0.8

  stamenRandomOffset = 0.03

  stamenRandomRotation = 10

  stamenPositionOffsetZ = 0.1

  // petal
  petalScaleVariation = 0.15

  petalScaleZVariation = 0.4

  petalWidth = 2

  petalWidthVariation = 0.6

  petalThickness = 3

  petalThicknessVariation = 0.8

  petalScale = 0.15

  petalLength = 1.2

  petalLengthVariation = 0

  orchidPetalScaleBase = 0.5

  orchidPetalScaleVariation = 0.5

  orchidPetalTiltRotationVariation = 30

  // petal symmetry
  minPetalSymmetry = 3

  maxPetalSymmetry = 12

  petalSymmetryBias = 0.5

  // spawn
  symmetricalSpawning = true

  symmetricalSpawningZ = false

  // angle
  spawnAngle = 30

  spawnAngleVariation = 0.7

  spawnAngleZ = 20

  spawnAngleZVariation = 0.3

  spawnAngleStartZ = -5

  spawnAngleStartZVariation = 1.5

  spawnAngleIndividualVariation = 15

  hasSpawnAngleZIndividualVariation = 10

  spawnAngleYIndividualVariation = 10

  spawnAngleZIndividualVariation = 10

  multipleSpawnAngleReductionMultiplier = 0.6

  armAngleBaseVariation = 360

  armAngleOrchidBaseVariation = 10

  // position
  spawnPosition = 0.1

  spawnPositionVariation = 0

  endSpawnPosition = 0.3

  // offset
  spawnOffsetX = 0.2

  spawnOffsetXVariation = 0.4

  spawnOffsetZ = 0.1

  spawnOffsetZVariation = 0

  // scale
  spawnScale = 0.9

  spawnScaleVariation = 0.6

  spawnScaleZ = 1

  spawnScaleZVariation = 0.5

  endSpawnScale = 0.9

  endSpawnScaleVariation = 0.2

  // spawn side
  spawnSidesProbability = 0.5

  spawnEndProbability = 0.5

  // depths
  baseNumDepths = 0

  maxDepth = 2

  maxDepthVariation = 0

  extraDepthsProbability = 0.25

  // rotation
  generationPetalRotationOffsetVariation = 30

  generationOrchidPetalRotationOffsetVariation = 10

  generationSidePetalRotationOffsetVariation = 30

  generationOrchidSidePetalRotationOffsetVariation = 10

  // animation
  spawnEase = Expo.easeOut

  startPetalFoldScale = 0.1

  startPetalFoldRotation = 20

  startPetalFoldSpinRotation = 40

  startPetalFoldTurnRotation = -10

  petalBaseRotation = 90

  stamenBaseRotation = 90

  stamenBaseRotationX = -90

  stamenBaseRotationY = 0

  stamenStartRotationX = -0.15

  startingPetalScale = 0.01

  extrusionThickness = 0.075

  bevelThickness = 0.04

  spawnDelay = 0.3

  spawnDelayVariation = 0.05

  baseSpawnDelay = 1.1

  spawnDuration = 4.5

  /* ---------------------------------- init ---------------------------------- */
  constructor(container: MutableRefObject<Object3D>, petalModel: PetalStyleModel) {
    this.petalModel = petalModel

    this.objectContainer = container

    // this.baseRandomSeed = baseRandomSeed
  }

  /* -------------------------------- animation ------------------------------- */
  private animateIn() {
    const t = this.spawnEase
    const n = (Math.PI * 2) / 360

    this.animatingPetals.forEach((petal) => {
      // petal.targetYScale = petal.scale.y
      gsap.from(petal.petal!.scale, petal.spawnDuration || 0, {
        delay: petal.spawnDelay,
        ease: t,
        y: this.startPetalFoldScale,
      })

      if (petal.isStamen) {
        gsap.from(petal.rotation, petal.spawnDuration || 0, {
          delay: petal.spawnDelay,
          ease: t,
          y: petal.rotation.y + Math.PI * this.stamenStartRotationX,
        })
      } else {
        gsap.from(petal.petal!.rotation, petal.spawnDuration || 0, {
          delay: petal.spawnDelay,
          ease: t,
          x: this.startPetalFoldSpinRotation * n,
          y: this.startPetalFoldRotation * n,
          z: (this.petalBaseRotation + this.startPetalFoldTurnRotation) * n,
        })

        gsap.from(petal.rotation, petal.spawnDuration || 0, {
          delay: petal.spawnDelay,
          ease: t,
          y: petal.rotation.y + Math.PI * 0.25,
        })
      }

      gsap.to(petal.scale, petal.spawnDuration || 0, {
        delay: petal.spawnDelay,
        ease: t,
        x: petal.petalScaleZ,
        y: petal.petalScale,
        z: petal.petalScale,
      })
    })
  }

  /* --------------------------------- private -------------------------------- */
  private reset() {
    this.baseRandomSeed = `${Math.random() * 1000}`
    this.objectContainer.current.clear()
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private initTextures() {}

  private initMaterial(e = 0) {
    if (e === 0 && this.petalModel.useRandomPreset) {
      this.petalModel.setRandomPreset()
    }

    this.petalMaterial = this.petalModel.getNewMaterialFromStyle(e)

    return this.petalMaterial
  }

  private clamp(e: number, t: number, n: number) {
    return Math.max(t, Math.min(n, e))
  }

  private blendGeoPoints(geometry1: BufferGeometry, geometry2: BufferGeometry, index: number, factor: number) {
    return (
      geometry1.attributes.position.array[index] +
      (geometry2.attributes.position.array[index] - geometry1.attributes.position.array[index]) * factor
    )
  }

  private blendGeometries(geometry1: BufferGeometry, geometry2: BufferGeometry, factor: number) {
    const r = geometry1.clone()

    for (let i = 0; i < r.attributes.position.array.length; i += 3) {
      r.attributes.position.setXYZ(
        i / 3,
        this.blendGeoPoints(geometry1, geometry2, i + 0, factor),
        this.blendGeoPoints(geometry1, geometry2, i + 1, factor),
        this.blendGeoPoints(geometry1, geometry2, i + 2, factor)
      )
    }

    return r
  }

  private spawnSubPetal(
    petal?: any,
    isStamen?: any,
    depth?: any,
    spawnScale?: any,
    spawnScaleZ?: any,
    spawnPosition?: any,
    spawnRotation?: any,
    u?: any,
    rotationOffset?: any
  ) {
    this.currPetalStack = petal
    this.spawnPetal(isStamen, depth, spawnScale, spawnScaleZ, spawnPosition, spawnRotation, rotationOffset)

    if (!u && this.symmetricalSpawning) {
      if (spawnPosition && spawnPosition.y) {
        // eslint-disable-next-line no-param-reassign
        spawnPosition.y *= -1
      }

      if (spawnRotation && spawnRotation.x) {
        // eslint-disable-next-line no-param-reassign
        spawnRotation.x *= -1
      }

      this.spawnPetal(isStamen, depth, spawnScale, spawnScaleZ, spawnPosition, spawnRotation, rotationOffset)
    }
  }

  private spawnPetal(
    isStamen?: boolean,
    _depth?: number,
    petalScaleFactor?: number,
    petalScaleZFactor?: number,
    position?: { x: number; y: number; z: number },
    rotation?: { x: number; y: number; z: number },
    rotationOffset?: number
  ) {
    // create petal object
    const petal = new PetalObject()

    // default depth is 0
    const depth = _depth === undefined ? 0 : _depth
    const petalProperty = this.petalProperties[depth]

    // add petal to petal container
    if (this.currPetalStack) {
      this.currPetalStack!.add(petal)
    }

    // set petal scale
    const petalScale = petalScaleFactor !== undefined ? petalScaleFactor : 1
    const petalScaleZ = petalScaleZFactor !== undefined ? petalScaleZFactor : 1
    petal.scale.x = petalScaleZ * this.startingPetalScale
    petal.scale.y = petalScale * this.startingPetalScale
    petal.scale.z = petalScale * this.startingPetalScale

    // set position
    if (position !== undefined) {
      petal.position.x = position.x ? position.x : 0
      petal.position.y = position.y ? position.y : 0
      petal.position.z = position.z ? position.z : 0
    }

    // set rotation
    if (rotation !== undefined) {
      petal.rotation.x = rotation.x ? rotation.x * DEG_TO_RAD : 0
      petal.rotation.y = rotation.y ? rotation.y * DEG_TO_RAD : 0
      petal.rotation.z = rotation.z ? rotation.z * DEG_TO_RAD : 0

      if (rotationOffset !== undefined) {
        petal.rotation.x += rotationOffset * DEG_TO_RAD
      }
    }

    // setup petal mesh
    const petalMesh = new Mesh(petalProperty.petalGeometry!, petalProperty.petalMaterial!)

    // set scale + rotation
    if (petalProperty.isStamen) {
      petalMesh.scale.x = this.petalScale * petalProperty.petalThickness
      petalMesh.scale.y = this.petalScale * petalProperty.petalLength
      petalMesh.scale.z = this.petalScale * petalProperty.petalWidth
      petalMesh.rotation.z = this.stamenBaseRotation * DEG_TO_RAD
      petalMesh.rotation.x = this.stamenBaseRotationX * DEG_TO_RAD
      petalMesh.rotation.y = this.stamenBaseRotationY * DEG_TO_RAD
      petalMesh.scale.y *=
        1 +
        (seedrandom(`${this.baseRandomSeed}-stamenIndividualScaleZVariation`)() - 0.5) *
          this.stamenIndividualScaleZVariation
      petalMesh.scale.x *=
        1 +
        (seedrandom(`${this.baseRandomSeed}-stamenIndividualScaleVariation.x`)() - 0.5) *
          this.stamenIndividualScaleVariation
      petalMesh.scale.z *=
        1 +
        (seedrandom(`${this.baseRandomSeed}-stamenIndividualScaleVariation.z`)() - 0.5) *
          this.stamenIndividualScaleVariation
    } else {
      petalMesh.scale.x = this.petalScale * petalProperty.petalWidth
      petalMesh.scale.y = this.petalScale * petalProperty.petalThickness
      petalMesh.scale.z = this.petalScale * petalProperty.petalLength
      petalMesh.rotation.z = this.petalBaseRotation * DEG_TO_RAD
    }

    petalMesh.position.x = (-this.extrusionThickness / 2) * petalMesh.scale.z

    // add petal mesh
    petal.petal = petalMesh
    petal.add(petalMesh)

    // setup petal properties for animation
    const delay = this.spawnDelay * depth + this.baseSpawnDelay
    petal.depth = depth
    petal.spawnDelay = delay
    petal.spawnDuration = this.spawnDuration
    petal.petalScale = petalScale
    petal.petalScaleZ = petalScaleZ
    petal.isStamen = petalProperty.isStamen

    // add to array to animate
    this.animatingPetals.push(petal)

    // set initial rotation to animate
    if (!petalProperty.isStamen) {
      petal.rotation.x +=
        (seedrandom(`${this.baseRandomSeed}-spawnAngleIndividualVariation`)() - 0.5) *
        this.spawnAngleIndividualVariation *
        DEG_TO_RAD
      petal.rotation.y +=
        (seedrandom(`${this.baseRandomSeed}-spawnAngleZIndividualVariation`)() - 0.5) *
        this.spawnAngleZIndividualVariation *
        DEG_TO_RAD
      petal.rotation.z +=
        (seedrandom(`${this.baseRandomSeed}-spawnAngleYIndividualVariation`)() - 0.5) *
        this.spawnAngleYIndividualVariation *
        DEG_TO_RAD
      petal.spawnDelay += (seedrandom(`${this.baseRandomSeed}-spawnDelayVariation`)() - 0.5) * this.spawnDelayVariation
      petal.petalScale! += (seedrandom(`${this.baseRandomSeed}-petalScaleVariation`)() - 0.5) * this.petalScaleVariation
      petal.petalScaleZ! +=
        (seedrandom(`${this.baseRandomSeed}-petalScaleZVariation`)() - 0.5) * this.petalScaleZVariation
    }

    // set position for petal
    const spawnAngle = petalProperty.spawnAngle
    const spawnAngleZ = petalProperty.spawnAngleZ
    const spawnScale = petalProperty.spawnScale
    const spawnScaleZ = petalProperty.spawnScaleZ
    const spawnOffsetY = (petalProperty.spawnOffsetX * petalMesh.scale.x) / 2
    const spawnPosition = -petalProperty.spawnCenterOffset
    const spawnOffsetZ = -petalProperty.spawnOffsetZ
    const spawnInwardOffset = petalMesh.scale.y * petalProperty.endSpawnPosition

    // increase depth and spawn
    if (!isStamen && depth < this.curNumDepths - 1 && !petalProperty.isPreStamen) {
      const nextDepth = depth + 1

      if (petalProperty.spawnOutwards) {
        this.spawnSubPetal(
          petal,
          isStamen,
          nextDepth,
          spawnScale,
          spawnScaleZ,
          { x: spawnOffsetZ, y: spawnOffsetY, z: spawnPosition },
          { x: spawnAngle, y: spawnAngleZ },
          !1,
          petalProperty.sidePetalOffsetRotationX
        )
      }

      if (petalProperty.spawnInwards) {
        this.spawnSubPetal(
          petal,
          isStamen,
          nextDepth,
          petalProperty.endSpawnScale,
          spawnScaleZ,
          { x: spawnOffsetZ, y: spawnOffsetY, z: -spawnInwardOffset },
          { x: 0, y: spawnAngleZ },
          !0,
          0
        )
      }
    }
  }

  private addPetalStack(rotation: number, properties: any) {
    // setup petal container
    this.currPetalStack = new Object3D()
    this.currPetalStack.rotation.x = rotation * DEG_TO_RAD

    if (properties) {
      const i = properties.scale

      this.currPetalStack.scale.x = i
      this.currPetalStack.scale.y = i
      this.currPetalStack.scale.z = i
      this.currPetalStack.scale.y *= properties.petalWidthMultiplier

      this.currPetalStack.rotation.y = properties.tiltRotation * DEG_TO_RAD
    }

    // add to flower
    this.objectContainer.current.add(this.currPetalStack)

    // create petals
    this.spawnPetal(!1)

    return this.currPetalStack
  }

  private addStamenStack(_rotation: number, _offset: number) {
    // setup petal container
    this.currPetalStack = new Object3D()
    this.currPetalStack.rotation.x = -_rotation * DEG_TO_RAD
    this.currPetalStack.position.x = -this.stamenPositionOffsetZ

    // add to flower
    this.objectContainer.current.add(this.currPetalStack)

    const offset: any = {}
    const rotation: any = {}

    offset.z = _offset + (seedrandom(`${this.baseRandomSeed}-stamenRandomOffset`)() - 0.5) * this.stamenRandomOffset
    offset.x = (seedrandom(`${this.baseRandomSeed}-stamenRandomOffset.x`)() - 0.5) * this.stamenRandomOffset
    offset.y = (seedrandom(`${this.baseRandomSeed}-stamenRandomOffset.y`)() - 0.5) * this.stamenRandomOffset
    rotation.z = (seedrandom(`${this.baseRandomSeed}-stamenRandomRotation.z`)() - 0.5) * this.stamenRandomRotation
    rotation.x = (seedrandom(`${this.baseRandomSeed}-stamenRandomRotation.x`)() - 0.5) * this.stamenRandomRotation
    rotation.y = (seedrandom(`${this.baseRandomSeed}-stamenRandomRotation.y`)() - 0.5) * this.stamenRandomRotation

    // make petals
    this.spawnPetal(!0, this.petalProperties.length - 1, 1, 1, offset, rotation)

    return this.currPetalStack
  }

  private generateFlower() {
    this.petalProperties = []
    this.animatingPetals = []

    // setup flower type
    this.flowerIsOrchid = this.useOrchids && seedrandom(`${this.baseRandomSeed}-isOrchid`)() < this.orchidProbablity

    // setup stamen
    let hasStamen
    if (this.flowerIsOrchid) {
      hasStamen = true
    } else {
      hasStamen = seedrandom(`${this.baseRandomSeed}-hasStamen`)() < this.stamenProbablity
    }

    // setup petals
    let numberOfPetals
    if (this.flowerIsOrchid) {
      numberOfPetals = 5
    } else {
      numberOfPetals = Math.floor(
        this.minPetalSymmetry +
          (this.maxPetalSymmetry - this.minPetalSymmetry + 1) *
            seedrandom(`${this.baseRandomSeed}-curSymmetry`)() ** this.petalSymmetryBias
      )
    }

    // setup number of depth
    this.curNumDepths = this.maxDepth
    this.curNumDepths += Math.floor(
      seedrandom(`${this.baseRandomSeed}-maxDepthVariation`)() * this.maxDepthVariation + 0.999
    )
    this.baseNumDepths = this.curNumDepths

    // last depth always for stamen if flower has stamen
    if (hasStamen) {
      this.curNumDepths += 1
    }

    // loop states
    let nextSpawnScale = 1
    let cumulativePetalLength = 0

    // setup petal state for each depth
    for (let currDepth = 0; currDepth < this.curNumDepths; currDepth += 1) {
      const petalProperties: PetalProperties = {
        isStamen: false,
        isPreStamen: false,
        spawnAngle: 0,
        spawnCenterOffset: 0,
        spawnOffsetX: 0,
        spawnOffsetZ: 0,
        endSpawnPosition: 0,
        spawnScale: 0,
        spawnScaleZ: 0,
        spawnAngleZ: 0,
        endSpawnScale: 0,
        petalLength: 0,
        petalWidth: 0,
        petalThickness: 0,
        sidePetalOffsetRotationX: 0,
        petalGeometryBlendAmount: 0,
        spawnOutwards: false,
        spawnInwards: true,
        petalMaterial: null,
        petalGeometry: null,
      }

      const id = `_gen${currDepth}`

      // if there is stamen, set last depth to stamen
      petalProperties.isStamen = hasStamen && currDepth === this.curNumDepths - 1
      // if there is stamen, set 2nd last depth to preStamen
      petalProperties.isPreStamen = hasStamen && currDepth === this.curNumDepths - 2

      // setup petal angle, scale
      petalProperties.spawnAngle =
        this.spawnAngle * (1 - seedrandom(`${this.baseRandomSeed}-spawnAngle${id}`)() * this.spawnAngleVariation)
      petalProperties.spawnCenterOffset =
        this.spawnPosition *
        (1 - seedrandom(`${this.baseRandomSeed}-spawnPosition${id}`)() * this.spawnPositionVariation)
      petalProperties.spawnOffsetX =
        this.spawnOffsetX * (1 - seedrandom(`${this.baseRandomSeed}-spawnOffsetX${id}`)() * this.spawnOffsetXVariation)
      petalProperties.spawnOffsetZ =
        this.spawnOffsetZ * (1 - seedrandom(`${this.baseRandomSeed}-spawnOffsetZ${id}`)() * this.spawnOffsetZVariation)
      petalProperties.endSpawnPosition = this.endSpawnPosition

      // - if is preStamen
      if (petalProperties.isPreStamen) {
        petalProperties.spawnScale = 1
        petalProperties.spawnScaleZ = 1
        petalProperties.spawnAngleZ = 0
        petalProperties.endSpawnScale = 1
      }
      // - if stamen or normal petal
      else {
        petalProperties.spawnScale =
          this.spawnScale * (1 - seedrandom(`${this.baseRandomSeed}-spawnScale${id}`)() * this.spawnScaleVariation)
        petalProperties.spawnScaleZ =
          this.spawnScaleZ * (1 - seedrandom(`${this.baseRandomSeed}-spawnScaleZ${id}`)() * this.spawnScaleZVariation)
        petalProperties.spawnAngleZ =
          this.spawnAngleZ * (1 - seedrandom(`${this.baseRandomSeed}-spawnAngleZ${id}`)() * this.spawnAngleZVariation)
        petalProperties.endSpawnScale =
          this.endSpawnScale *
          (1 - seedrandom(`${this.baseRandomSeed}-endSpawnScale${id}`)() * this.endSpawnScaleVariation)

        if (this.baseNumDepths > 2) {
          petalProperties.spawnAngleZ *= this.multipleSpawnAngleReductionMultiplier
        }
      }

      // setup petal length, width, thickness
      // - if stamen
      if (petalProperties.isStamen) {
        const petalScale =
          this.stamenScale + seedrandom(`${this.baseRandomSeed}-stamenScale${id}`)() ** 1.2 * this.stamenScaleVariation
        let petalLength =
          this.stamenScaleZ +
          seedrandom(`${this.baseRandomSeed}-stamenScaleZ${id}`)() ** 1.5 * this.stamenScaleZVariation

        if (this.flowerIsOrchid) {
          petalLength =
            this.orchidStamenScaleZ +
            seedrandom(`${this.baseRandomSeed}-orchidStamenScaleZ${id}`)() ** 1.5 * this.orchidStamenScaleZVariation
        }

        petalProperties.petalLength = petalLength
        petalProperties.petalWidth = petalScale
        petalProperties.petalThickness = petalScale
      }
      // - if preStamen or normal petal
      else {
        petalProperties.petalWidth =
          this.petalWidth * (1 - seedrandom(`${this.baseRandomSeed}-petalWidth${id}`)() * this.petalWidthVariation)
        petalProperties.petalLength =
          this.petalLength * (1 - seedrandom(`${this.baseRandomSeed}-petalLength${id}`)() * this.petalLengthVariation)
        petalProperties.petalThickness =
          this.petalThickness *
          (1 - seedrandom(`${this.baseRandomSeed}-petalThickness${id}`)() * this.petalThicknessVariation)
      }

      // setup rotation offsets
      if (this.flowerIsOrchid) {
        petalProperties.sidePetalOffsetRotationX =
          (seedrandom(`${this.baseRandomSeed}-sidePetalOffsetRotationX${id}`)() - 0.5) *
          2 *
          this.generationOrchidSidePetalRotationOffsetVariation
      } else {
        petalProperties.sidePetalOffsetRotationX =
          (seedrandom(`${this.baseRandomSeed}-sidePetalOffsetRotationX${id}`)() - 0.5) *
          2 *
          this.generationSidePetalRotationOffsetVariation
      }

      // setup geometry blending
      let geometryBlend = this.geometryBlend
      if (this.useDiscreteGeometry) {
        geometryBlend = seedrandom(`${this.baseRandomSeed}-curGeometryBlend`)() < 0.5 ? 0 : 1
      }

      let geometryBlendOffset = seedrandom(`${this.baseRandomSeed}-geometryBlendOffset`)() * this.geometryBlendVariation
      geometryBlendOffset *= 1 - Math.abs(geometryBlend - 0.5) / 0.5

      let targetGeometryBlendMid =
        geometryBlend +
        (seedrandom(`${this.baseRandomSeed}-targetGeometryBlendMid`)() - 0.5) *
          2 *
          (0.5 - Math.abs(geometryBlend - 0.5)) *
          (1 - geometryBlendOffset)

      if (this.useFixedGeometryBlend) {
        targetGeometryBlendMid = geometryBlend
        geometryBlendOffset = 0
      }
      petalProperties.petalGeometryBlendAmount = this.clamp(
        targetGeometryBlendMid +
          (seedrandom(`${this.baseRandomSeed}-targetGeometryBlendMid${id}`)() - 0.5) * 2 * geometryBlendOffset,
        0,
        1
      )

      // setup spawn direction
      petalProperties.spawnOutwards =
        seedrandom(`${this.baseRandomSeed}-spawnSides${id}`)() < this.spawnSidesProbability
      petalProperties.spawnInwards = seedrandom(`${this.baseRandomSeed}-spawnEnd${id}`)() < this.spawnEndProbability

      if (currDepth === 0 || petalProperties.isPreStamen) {
        if (seedrandom(`${this.baseRandomSeed}-isPreStamen_spawnSides${id}`)() < 0.5) {
          petalProperties.spawnOutwards = true
        } else {
          petalProperties.spawnInwards = true
        }
      }

      if (petalProperties.isPreStamen) {
        petalProperties.spawnOutwards = false
        petalProperties.spawnInwards = true
      }

      // setup geometry
      let geometriesArray: BufferGeometry[]
      if (petalProperties.isStamen) {
        geometriesArray = this.stamenGeometries
      } else {
        geometriesArray = this.petalGeometries
      }
      const randomIndex1 = Math.floor(
        seedrandom(`${this.baseRandomSeed}-geometry1Index${id}`)() * (geometriesArray.length - 0.001)
      )
      const randomIndex2 = Math.floor(
        seedrandom(`${this.baseRandomSeed}-geometry2Index${id}`)() * (geometriesArray.length - 0.001)
      )
      const geometry1 = geometriesArray[randomIndex1]
      const geometry2 = geometriesArray[randomIndex2]
      petalProperties.petalGeometry = this.blendGeometries(
        geometry1,
        geometry2,
        petalProperties.petalGeometryBlendAmount
      )

      // setup material
      if (petalProperties.isStamen && !this.usePetalTextureForStamen) {
        const x = this.textureLoader.load(this.stamenTexture!)
        petalProperties.petalMaterial = new MeshBasicMaterial({
          map: x,
          transparent: !1,
        })
      } else {
        // eslint-disable-next-line no-await-in-loop
        petalProperties.petalMaterial = this.initMaterial(currDepth)
      }

      // update states
      let curPetalLength = petalProperties.petalLength * nextSpawnScale
      if (currDepth < this.curNumDepths - 1) {
        curPetalLength *= petalProperties.endSpawnPosition
      }
      cumulativePetalLength += curPetalLength
      nextSpawnScale *= petalProperties.endSpawnScale

      // push petal property
      this.petalProperties.push(petalProperties)
    }

    // setup scale of flower
    this.viewScale = this.flowerScale
    if (this.isCounterScaleFlower) {
      const T = this.targetRadius / cumulativePetalLength
      this.viewScale *= T
    }
    this.objectContainer.current.scale.x = this.viewScale
    this.objectContainer.current.scale.y = this.viewScale
    this.objectContainer.current.scale.z = this.viewScale

    let C
    let petalStackAngleBase

    const petalProperties = []
    if (this.flowerIsOrchid) {
      petalStackAngleBase =
        (seedrandom(`${this.baseRandomSeed}-armAngleBase`)() - 0.5) * this.armAngleOrchidBaseVariation

      const orchidScalePhaseOffset = seedrandom(`${this.baseRandomSeed}-orchidScalePhaseOffset`)() * Math.PI * 2
      const orchidRotationPhaseOffset = seedrandom(`${this.baseRandomSeed}-orchidRotationPhaseOffset`)() * Math.PI * 2

      // add 'random' properties
      for (let i = 0; i < Math.ceil(numberOfPetals / 2); i += 1) {
        const A: any = {}

        A.scale =
          this.orchidPetalScaleBase +
          this.orchidPetalScaleVariation *
            (0.5 + 0.5 * Math.sin((i / (numberOfPetals / 2)) * Math.PI * 2 + orchidScalePhaseOffset))
        A.tiltRotation =
          this.orchidPetalTiltRotationVariation *
          Math.sin((i / (numberOfPetals / 2)) * Math.PI * 2 + orchidRotationPhaseOffset)
        A.petalWidthMultiplier = 1 + 1 * seedrandom(`${this.baseRandomSeed}-petalWidthMultiplier`)()

        petalProperties.push(A)
      }
    } else {
      petalStackAngleBase = (seedrandom(`${this.baseRandomSeed}-armAngleBase`)() - 0.5) * this.armAngleBaseVariation
    }

    let petalProperty = petalProperties[petalProperties.length - 1]

    const startArmZRotation =
      this.spawnAngleStartZ *
      (1 - seedrandom(`${this.baseRandomSeed}-startArmRotation`)() * this.spawnAngleStartZVariation) *
      DEG_TO_RAD

    // add petals
    for (let i = 0; i < numberOfPetals; i += 1) {
      let rotation = 0

      // setup rotation
      if (this.flowerIsOrchid) {
        rotation = -90 + (i / numberOfPetals) * 360 + petalStackAngleBase
        let O = i
        if (i > numberOfPetals / 2) {
          O = numberOfPetals - i
        }
        petalProperty = petalProperties[O]
      } else {
        rotation = -90 + (i / numberOfPetals) * 360 + petalStackAngleBase
      }

      // add petal
      C = this.addPetalStack(rotation, petalProperty)
      C.rotation.y += startArmZRotation
    }

    // setup stamens
    const stamensCount = Math.floor(
      this.minStamenSymmetry +
        (this.maxStamenSymmetry - this.minStamenSymmetry + 1) *
          seedrandom(`${this.baseRandomSeed}-curStamenSymmetry`)() ** this.stamenSymmetryBias
    )

    const stamenRotationY =
      this.stamenAngleStartZ *
      (1 - seedrandom(`${this.baseRandomSeed}-stamenAngleStartZVariation`)() * this.stamenAngleStartZVariation) *
      DEG_TO_RAD
    const stamenOffsetY =
      this.stamenOffsetY *
      (1 - seedrandom(`${this.baseRandomSeed}-stamenOffsetYVariation`)() * this.stamenOffsetYVariation)

    // add stamens
    if (hasStamen) {
      petalStackAngleBase = (seedrandom(`${this.baseRandomSeed}-armAngleBase`)() - 0.5) * this.armAngleBaseVariation

      // loop each stamen
      for (let j = 0; j < stamensCount; j += 1) {
        const rotation = -90 + (j / stamensCount) * 360 + petalStackAngleBase
        C = this.addStamenStack(rotation, stamenOffsetY)
        C.rotation.y = stamenRotationY
      }
    }

    // animate
    this.animateIn()
  }

  /* ------------------------------ entry points ------------------------------ */
  public setGeometriesFromModels(petalModels: Object3D[], stamenModels: Object3D[]) {
    this.petalGeometries = []
    this.stamenGeometries = []

    petalModels.forEach((item) => {
      const n = (item.children[0] as Mesh).geometry
      this.petalGeometries.push(n)
    })

    stamenModels.forEach((item) => {
      const n = (item.children[0] as Mesh).geometry
      this.stamenGeometries.push(n)
    })
  }

  public setStamenTexture(image: string) {
    this.stamenTexture = image
  }

  public generate() {
    if (this.generated) {
      this.reset()
    } else {
      this.generated = true
      this.initTextures()
      this.initMaterial()
    }

    this.generateFlower()
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public update() {}
}
