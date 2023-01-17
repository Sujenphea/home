/* eslint-disable react/jsx-props-no-spreading */
import { HTMLAttributes, useEffect, useRef, useState } from "react"

export const DotDotDotDisplay = (props: HTMLAttributes<HTMLDivElement>) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { ...rest } = props

  const [numberDots, setNumberDots] = useState(0)

  const currentNumberRef = useRef(0)
  useEffect(() => {
    const interval = setInterval(() => {
      const newN = (currentNumberRef.current + 1) % 4
      setNumberDots(newN)
      currentNumberRef.current = newN
    }, 450)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div style={{ position: "relative" }}>
      {/* sizing div */}
      <div style={{ opacity: 0 }} {...rest}>
        ...
      </div>
      <div style={{ position: "absolute", top: "0", left: "0", height: "100%", width: "100%" }} {...rest}>
        {".".repeat(numberDots)}
      </div>
    </div>
  )
}
