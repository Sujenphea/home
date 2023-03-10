import { useRef, useEffect } from "react"
import gsap from "gsap"
import { cursorZIndex } from "../constants/uiConstants"
import { usePointer } from "../hooks/usePointer"

export const Cursor = (props: { color?: string }) => {
  /* ---------------------------------- hooks --------------------------------- */
  const { x: pointerX, y: pointerY } = usePointer()

  /* ---------------------------------- refs ---------------------------------- */
  const cursorOneRef = useRef<HTMLDivElement | null>(null)
  const cursorTwoRef = useRef<HTMLDivElement | null>(null)
  const cursorThreeRef = useRef<HTMLDivElement | null>(null)

  /* --------------------------------- effects -------------------------------- */
  // animate movement
  useEffect(() => {
    gsap.to(cursorOneRef.current, {
      duration: 0.1,
      x: pointerX,
      y: pointerY,
    })

    gsap.to(cursorTwoRef.current, {
      duration: 0.4,
      x: pointerX,
      y: pointerY,
    })

    gsap.to(cursorThreeRef.current, {
      duration: 0.7,
      x: pointerX,
      y: pointerY,
    })
  }, [pointerX, pointerY])

  /* ---------------------------------- main ---------------------------------- */
  return (
    <div
      className="pointer-events-none fixed inset-0 grid h-screen w-screen mix-blend-difference"
      style={{
        zIndex: cursorZIndex,
      }}
    >
      <div ref={cursorOneRef} className="relative" style={{ gridArea: "1 / 1" }}>
        <div
          className="h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            backgroundColor: props.color || "#ccf",
          }}
        />
      </div>

      <div ref={cursorTwoRef} className="relative" style={{ gridArea: "1 / 1" }}>
        <div
          className="h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            backgroundColor: props.color || "#ccf",
          }}
        />
      </div>

      <div ref={cursorThreeRef} className="relative" style={{ gridArea: "1 / 1" }}>
        <div
          className="h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            backgroundColor: props.color || "#ccf",
          }}
        />
      </div>
    </div>
  )
}
