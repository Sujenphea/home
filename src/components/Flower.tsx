import { PerspectiveCamera } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { forwardRef, MutableRefObject, RefObject, Suspense, useEffect, useImperativeHandle, useRef } from "react"
import { Camera, Color, DirectionalLight, Mesh, MeshPhongMaterial, Object3D, Quaternion, Vector2, Vector3 } from "three"
import { FlowerSpawner } from "./FlowerSpawner"
import { PetalStyleModel } from "./PetalModel"
import { Stalk } from "./Stalk"

import { useWindowSize } from "../hooks/useWindowSize"

import { useThreejsObjects } from "../hooks/useThreejsObjects"
import { getTextureFromImage } from "../utils/getTextureFromImage"
import { DEG_TO_RAD } from "../utils/math"
import { RegenerateRefType } from "../types/RegenerateRefType"
import { usePointer } from "../hooks/useMousePosition"

/* -------------------------------------------------------------------------- */
/*                                  constants                                 */
/* -------------------------------------------------------------------------- */
const discScalePow = 8

const budSize = 0.15
const budVertScale = 1.8
const budOffsetY = 0.45

const stalkColour = 1127168

const stamenDiscScale = 0.04
const stamenDiscOffsetZ = 0.4
const stamenDiscStartOffsetZ = 0.2
const stamenDiscEndOffsetZ = 0
const stamenDiscStartScale = 0.1
const stamenDiscEndScale = 1
const stamenDiscStartScaleZ = 0.3
const stamenDiscEndScaleZ = 1.4

const flowerHeadSwayAmount = 1
const flowerHeadSwayRotation = { x: 0, y: 0, z: 0 }
const flowerSwaySpeed = 0.55
const flowerSwayXSpeed = 0.15
const flowerSwaySpinSpeed = 0.3
const flowerSwayAmount = 0.2
const flowerSwayXAmount = 0.2
const flowerSwaySpinAmount = 2

const flowerHeadOffsetX = 0
const flowerHeadOffsetY = 41.5
const flowerHeadOffsetZ = 0

const flowerPositionZ = -2

const cameraOffsetY = -2
const cameraDist = 32
const baseCameraY = flowerHeadOffsetY + cameraOffsetY

const directionalLight1InitPosition = new Vector3(0, 1, 1)
const directionalLight2InitPosition = new Vector3(0, -1, -0.5)
const directionalLight3InitPosition = new Vector3(0.4, 0.4, -1)

const baseRandomSeed = `${Math.random() * 1000}`

const viewMouseRotationAmountSpin = 1.4
const viewMouseRotationAmountPitch = 0.8

const viewWobbleSpeed = 0.5
const viewWobbleAmount = 0.005

const viewDeviceOffsetRotation = { x: 0, y: 0 }

const viewRotation = { x: 0, y: 0, z: 0 }
const viewPosition = { x: 0, y: 0, z: 0 }
const curViewRotation = { x: 0, y: 0, z: 0 }
const viewRotationVel = { x: 0, y: 0, z: 0 }
const viewRotationAccel = 0.01
const viewRotationDecel = 0.85

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */
const Flower = forwardRef<
  RegenerateRefType,
  {
    windowWidth: number | undefined
    windowHeight: number | undefined
    pointerX: number
    pointerY: number
    pointerType: string
    cameraRef: RefObject<Camera>
    cameraBoxRef: MutableRefObject<Object3D | null>
    cameraBoxInnerRef: MutableRefObject<Object3D | null>
    directionalLight1Ref: MutableRefObject<DirectionalLight | null>
    directionalLight2Ref: MutableRefObject<DirectionalLight | null>
    directionalLight3Ref: MutableRefObject<DirectionalLight | null>

    isLoaded: boolean
  }
>((props, ref) => {
  const {
    stamenDisc,
    stamenProto1,
    stamenProto2,
    stamenProto3,
    stamenProto4,
    stamenProto5,
    stem1Path,
    stem1,
    petalProto2,
    petalProto4,
    petalProto5,
    petalProto6,
    petalProto7,
  } = useThreejsObjects()

  /* ---------------------------------- refs ---------------------------------- */
  const flowerContainerRef = useRef<Object3D | null>(null)
  const flowerRef = useRef<Object3D | null>(null)
  const budRef = useRef<Object3D | null>(null)
  const budInnerRef = useRef<Object3D | null>(null)
  const stalkContainerRef = useRef<Object3D | null>(null)
  const stamenDiscRef = useRef<Object3D | null>(null)

  const stalkRef = useRef<Stalk | null>(null)
  const petalStyleModel = useRef(new PetalStyleModel())
  const flowerSpawnerRef = useRef<FlowerSpawner | null>(null)

  /* --------------------------------- effects -------------------------------- */
  // setup stamen disc scale
  useEffect(() => {
    const stamenDiscModelMesh = stamenDisc.children[0] as Mesh

    stamenDiscModelMesh.scale.x = stamenDiscScale
    stamenDiscModelMesh.scale.y = stamenDiscScale
    stamenDiscModelMesh.scale.z = stamenDiscScale

    stamenDiscModelMesh.rotation.x = -90 * DEG_TO_RAD
    stamenDiscModelMesh.position.z = -stamenDiscOffsetZ

    const stamenDiscImg = new Image()
    stamenDiscImg.src = "/assets/stamendisk2.jpg"
    const stamenDiscMap = getTextureFromImage(stamenDiscImg)

    const stamenDiscNormalImg = new Image()
    stamenDiscNormalImg.src = "/assets/stamendisk_normal.jpg"
    const stamenDiscNormalMap = getTextureFromImage(stamenDiscNormalImg)

    const material = new MeshPhongMaterial({
      color: new Color(petalStyleModel.current.hslToRgb(petalStyleModel.current.hue, 0.9, 0.86)),
      emissive: petalStyleModel.current.hslToRgb(petalStyleModel.current.hue, 1, 0.2),
      specular: 10066329,
      shininess: 2,
      map: stamenDiscMap,
      specularMap: stamenDiscMap,
      normalMap: stamenDiscNormalMap,
      normalScale: new Vector2(1, 1),
    })
    stamenDiscModelMesh.material = material
  }, [stamenDisc])

  // setup stalk
  useEffect(() => {
    if (props.isLoaded && stalkContainerRef.current !== null) {
      const stalkMaterial = new MeshPhongMaterial({
        color: stalkColour,
        shininess: 3,
        // wrapRgb: new Vector3(1, 1.2, 1),
        // wrapAround: true
      })

      stalkRef.current = new Stalk(stalkContainerRef.current, stalkMaterial, baseRandomSeed)

      // setup models
      stalkRef.current.setGeometriesFromModels(stem1Path, stem1)

      // generate
      stalkRef.current.generate()
    }
  }, [stalkContainerRef, props.isLoaded, stem1Path, stem1])

  // setup flower
  useEffect(() => {
    if (props.isLoaded && flowerRef.current !== null) {
      flowerSpawnerRef.current = new FlowerSpawner(flowerRef as MutableRefObject<Object3D>, petalStyleModel.current)

      // setup stamen
      const stamenImage = new Image()
      stamenImage.src = "/assets/stamen.png"

      flowerSpawnerRef.current?.setStamenTexture(stamenImage)

      // setup models
      flowerSpawnerRef.current.setGeometriesFromModels(
        [petalProto2, petalProto4, petalProto5, petalProto6, petalProto7],
        [stamenProto1, stamenProto2, stamenProto3, stamenProto4, stamenProto5]
      )

      // generate
      flowerSpawnerRef.current.generate()
    }
  }, [
    flowerRef,
    petalProto2,
    petalProto4,
    petalProto5,
    petalProto6,
    petalProto7,
    petalStyleModel,
    props.isLoaded,
    stamenProto1,
    stamenProto2,
    stamenProto3,
    stamenProto4,
    stamenProto5,
  ])

  /* --------------------------- imperative handles --------------------------- */
  useImperativeHandle(ref, () => ({
    regenerate: () => {
      stalkRef.current?.generate()
      flowerSpawnerRef.current?.generate()
    },
  }))

  /* --------------------------------- frames --------------------------------- */
  useFrame((state) => {
    const time = state.clock.elapsedTime

    // constant swaying motion
    const swayRotateX =
      (flowerSwaySpinAmount *
        (Math.sin(time * flowerSwaySpinSpeed * 0.9456 + 5745) + Math.sin(time * flowerSwaySpinSpeed * 1.234 + 3543))) /
      2
    const swayRotateY =
      (flowerSwayXAmount *
        (Math.sin(time * flowerSwayXSpeed * 1.234 + 435) + Math.sin(time * flowerSwayXSpeed * 0.645 + 46546))) /
      2
    const swayRotateZ =
      (flowerSwayAmount *
        (Math.sin(time * flowerSwaySpeed * 0.8435 + 1325) + Math.sin(time * flowerSwaySpeed * 1.155 + 654654))) /
      2

    if (flowerContainerRef.current) {
      flowerContainerRef.current.rotation.x = swayRotateY * DEG_TO_RAD
      flowerContainerRef.current.rotation.y = swayRotateX * DEG_TO_RAD
      flowerContainerRef.current.rotation.z = swayRotateZ * DEG_TO_RAD
    }
    flowerHeadSwayRotation.x = swayRotateY * flowerHeadSwayAmount * DEG_TO_RAD
    flowerHeadSwayRotation.y = swayRotateX * flowerHeadSwayAmount * DEG_TO_RAD
    flowerHeadSwayRotation.z = swayRotateZ * flowerHeadSwayAmount * DEG_TO_RAD

    // mouse move
    const mouseMove = { x: 0, y: 0 }
    if (props.pointerType === "mouse") {
      mouseMove.y =
        ((props.pointerX - (props.windowWidth || 0) / 2) / (props.windowWidth || 0)) * viewMouseRotationAmountSpin
      mouseMove.x =
        ((props.pointerY - (props.windowHeight || 0) / 2) / (props.windowHeight || 0)) * viewMouseRotationAmountPitch
    } else {
      mouseMove.y =
        (-(props.pointerX - (props.windowWidth || 0) / 2) / (props.windowWidth || 0)) * viewMouseRotationAmountSpin
      mouseMove.x =
        (-(props.pointerY - (props.windowHeight || 0) / 2) / (props.windowHeight || 0)) * viewMouseRotationAmountPitch
    }

    const i = { x: 0, y: 0 }
    i.y = (Math.sin(time * viewWobbleSpeed) + Math.sin(time * viewWobbleSpeed * 0.764)) * viewWobbleAmount
    i.x = (Math.sin(time * viewWobbleSpeed * 0.455) + Math.sin(time * viewWobbleSpeed * 1.255)) * viewWobbleAmount
    mouseMove.y += i.y
    mouseMove.x += i.x

    viewRotationVel.y *= viewRotationDecel
    viewRotationVel.x *= viewRotationDecel
    viewRotationVel.y += (mouseMove.y - curViewRotation.y) * viewRotationAccel
    viewRotationVel.x += (mouseMove.x - curViewRotation.x) * viewRotationAccel
    curViewRotation.y += viewRotationVel.y
    curViewRotation.x += viewRotationVel.x
    viewRotation.y = curViewRotation.y + viewDeviceOffsetRotation.y
    viewRotation.x = curViewRotation.x + viewDeviceOffsetRotation.x
    viewPosition.y = viewRotation.x * -3
    viewPosition.x = viewRotation.y * 3

    // position camera
    if (props.cameraBoxRef.current) {
      const cameraBox = props.cameraBoxRef.current

      cameraBox.position.x = viewPosition.x
      cameraBox.position.y = baseCameraY + viewPosition.y
      cameraBox.position.z = viewPosition.z
      cameraBox.rotation.y = viewRotation.y
    }

    if (props.cameraBoxInnerRef.current) {
      const cameraboxInner = props.cameraBoxInnerRef.current
      cameraboxInner.rotation.x = viewRotation.x
    }

    const s = new Quaternion()
    if (props.cameraRef.current) {
      s.setFromRotationMatrix(props.cameraRef.current.matrixWorld)
    }
    s.normalize()

    // set light position
    if (props.directionalLight1Ref.current) {
      props.directionalLight1Ref.current.position.copy(directionalLight1InitPosition)
      props.directionalLight1Ref.current.position.applyQuaternion(s)
    }

    if (props.directionalLight2Ref.current) {
      props.directionalLight2Ref.current.position.copy(directionalLight2InitPosition)
      props.directionalLight2Ref.current.position.applyQuaternion(s)
    }

    if (props.directionalLight3Ref.current) {
      props.directionalLight3Ref.current.position.copy(directionalLight3InitPosition)
      props.directionalLight3Ref.current.position.applyQuaternion(s)
    }

    // update
    if (flowerSpawnerRef.current) {
      flowerSpawnerRef.current.update()
    }

    if (stalkRef.current) {
      stalkRef.current.update()
    }

    // update position, rotation
    if (stalkRef.current) {
      const u = stalkRef.current.getStalkEndOrientation()

      if (flowerRef.current) {
        flowerRef.current.position.x = u.position.x
        flowerRef.current.position.y = u.position.y
        flowerRef.current.position.z = u.position.z
        flowerRef.current.rotation.x = u.rotation.x + flowerHeadSwayRotation.x
        flowerRef.current.rotation.y = u.rotation.y + flowerHeadSwayRotation.y - Math.PI / 2
        flowerRef.current.rotation.z = u.rotation.z + flowerHeadSwayRotation.z
      }

      if (budRef.current) {
        budRef.current.position.x = u.position.x
        budRef.current.position.y = u.position.y
        budRef.current.position.z = u.position.z
        budRef.current.rotation.x = u.rotation.x
        budRef.current.rotation.y = u.rotation.y
        budRef.current.rotation.z = u.rotation.z
      }

      if (stamenDiscRef.current) {
        stamenDiscRef.current.position.x = u.position.x
        stamenDiscRef.current.position.y = u.position.y
        stamenDiscRef.current.position.z = u.position.z
        stamenDiscRef.current.rotation.x = u.rotation.x
        stamenDiscRef.current.rotation.y = u.rotation.y
        stamenDiscRef.current.rotation.z = u.rotation.z
      }
    }

    if (stalkRef.current) {
      const f = stalkRef.current.stemAnimation.growthProgress

      if (budInnerRef.current) {
        budInnerRef.current.scale.x = 1 + f ** 3 * 2
        budInnerRef.current.scale.y = 1 + f ** 3 * 2
        budInnerRef.current.scale.z = 1 + f ** 3 * 2
      }

      const l = f ** discScalePow
      let c = 1
      let h = 1

      if (flowerSpawnerRef.current && flowerSpawnerRef.current.flowerIsOrchid) {
        c = 0.8
        h = 0.6
      }

      if (stamenDiscRef.current) {
        stamenDiscRef.current.position.z += stamenDiscStartOffsetZ + (stamenDiscEndOffsetZ - stamenDiscStartOffsetZ) * l
        stamenDiscRef.current.scale.x = stamenDiscStartScale + (stamenDiscEndScale - stamenDiscStartScale) * l * c
        stamenDiscRef.current.scale.y = stamenDiscStartScale + (stamenDiscEndScale - stamenDiscStartScale) * l * c
        stamenDiscRef.current.scale.z = stamenDiscStartScaleZ + (stamenDiscEndScaleZ - stamenDiscStartScaleZ) * l * h
      }
    }
  })

  /* ---------------------------------- main ---------------------------------- */
  return (
    <Suspense fallback={null}>
      {/* flower container */}
      <object3D ref={flowerContainerRef} position={[0, 0, flowerPositionZ]}>
        {/* stamen disc */}
        <object3D ref={stamenDiscRef}>
          <primitive object={stamenDisc} />
        </object3D>

        {/* flower */}
        <object3D ref={flowerRef} position={[flowerHeadOffsetZ, flowerHeadOffsetY, flowerHeadOffsetX]} />

        {/* bud */}
        <object3D ref={budRef}>
          {/* bud inner */}
          <object3D ref={budInnerRef} position={[0, 0, budOffsetY]}>
            <mesh scale={[1, 1, budVertScale]}>
              <sphereGeometry args={[budSize, 32, 32]} />
              <meshPhongMaterial color={new Color(stalkColour)} shininess={3} />
            </mesh>
          </object3D>
        </object3D>

        {/* stalk container */}
        <object3D ref={stalkContainerRef} position={[0, 0, 0]} />
      </object3D>
    </Suspense>
  )
})
Flower.displayName = "Flower"

export const FlowerCanvas = forwardRef<RegenerateRefType, { isLoaded: boolean }>((props, ref) => {
  /* ---------------------------------- hooks --------------------------------- */
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const { x: pointerX, y: pointerY, pointerType } = usePointer()

  /* ---------------------------------- refs ---------------------------------- */
  const cameraRef = useRef<Camera | null>(null)
  const cameraBoxRef = useRef<Object3D | null>(null)
  const cameraBoxInnerRef = useRef<Object3D | null>(null)
  const directionalLight1Ref = useRef<DirectionalLight | null>(null)
  const directionalLight2Ref = useRef<DirectionalLight | null>(null)
  const directionalLight3Ref = useRef<DirectionalLight | null>(null)

  const flowerRef = useRef<RegenerateRefType | null>(null)

  useImperativeHandle(ref, () => ({
    regenerate: () => {
      flowerRef.current?.regenerate()
    },
  }))

  /* ---------------------------------- main ---------------------------------- */
  return (
    <Canvas>
      {/* camera box */}
      <object3D ref={cameraBoxRef} position={[0, baseCameraY, 0]}>
        {/* camerbox inner */}
        <object3D ref={cameraBoxInnerRef}>
          <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            fov={45}
            aspect={(windowWidth || 0) / (windowHeight || 0)}
            near={0.1}
            far={25e3}
            position={[0, 0, cameraDist]}
          />
        </object3D>
      </object3D>

      {/* flower */}
      <Flower
        ref={flowerRef}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        pointerX={pointerX}
        pointerY={pointerY}
        pointerType={pointerType}
        cameraRef={cameraRef}
        cameraBoxInnerRef={cameraBoxInnerRef}
        cameraBoxRef={cameraBoxRef}
        directionalLight1Ref={directionalLight1Ref}
        directionalLight2Ref={directionalLight2Ref}
        directionalLight3Ref={directionalLight3Ref}
        isLoaded={props.isLoaded}
      />

      {/* lights */}
      <object3D>
        <ambientLight intensity={0.5} />
        <directionalLight
          ref={directionalLight1Ref}
          color={new Color(10066329)}
          position={directionalLight1InitPosition}
        />
        <directionalLight
          ref={directionalLight2Ref}
          color={new Color(5592405)}
          position={directionalLight2InitPosition}
        />
        <directionalLight
          ref={directionalLight3Ref}
          color={new Color(4473924)}
          position={directionalLight3InitPosition}
        />
      </object3D>
    </Canvas>
  )
})
FlowerCanvas.displayName = "FlowerCanvas"
