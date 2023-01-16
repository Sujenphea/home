import { useEffect, useState } from "react"

export const usePointer = () => {
  const [pointer, setPointer] = useState({ x: 0, y: 0, pointerType: "mouse" })

  const updatePointerPosition = (ev: PointerEvent) => {
    setPointer({ x: ev.pageX, y: ev.pageY, pointerType: ev.pointerType })
  }

  useEffect(() => {
    window.addEventListener("pointermove", updatePointerPosition)

    return () => {
      window.removeEventListener("pointermove", updatePointerPosition)
    }
  }, [])

  return pointer
}
