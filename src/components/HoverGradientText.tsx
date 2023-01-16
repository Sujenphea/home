/* eslint-disable react/jsx-props-no-spreading */
import { motion } from "framer-motion"
import { DetailedHTMLProps, HTMLAttributes, useState, useRef, useCallback } from "react"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import { useWindowSize } from "../hooks/useWindowSize"

export const HoverGradientText = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { className, children, ...rest } = props

  /* --------------------------------- states --------------------------------- */
  const [mouseXPosition, setmouseXPosition] = useState("50%")
  const [hovering, setHovering] = useState(false)

  /* ---------------------------------- refs ---------------------------------- */
  const containerRef = useRef<HTMLDivElement | null>(null)

  /* ---------------------------------- hooks --------------------------------- */
  const entry = useIntersectionObserver(containerRef, {})
  const isVisible = !!entry?.isIntersecting

  const windowSize = useWindowSize()

  /* -------------------------------- callbacks ------------------------------- */
  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (isVisible && windowSize && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()

        const result = e.clientX - rect.left

        setmouseXPosition(`${result}px`)
      }
    },
    [isVisible, windowSize, containerRef]
  )

  /* ---------------------------------- main ---------------------------------- */
  return (
    <div>
      <div
        className={`grid ${className}`}
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseEnter={() => {
          setHovering(true)
        }}
        onMouseLeave={() => {
          setHovering(false)
        }}
        {...rest}
      >
        {/* linear gradient */}
        <motion.div
          animate={{
            backgroundPosition: "-200% center",
            transition: {
              duration: 5,
              repeat: Infinity,
              repeatDelay: 0,
              type: "tween",
              ease: "linear",
            },
          }}
          className="px-2 pt-1" // make sure bg covers text
          style={{
            gridArea: "1 / 1",
            color: "transparent",
            background:
              "linear-gradient(90deg, rgba(18,194,233,1) 0%, rgba(196,113,237,1) 31%, rgba(246,79,89,1) 70%, rgba(18,194,233,1) 100%)",
            backgroundClip: "text",
            height: "100%",
            width: "100%",
            backgroundSize: "200%",
          }}
        >
          {children}
        </motion.div>

        {/* spotlight effect */}
        <div
          className="px-2 pt-1" // make sure bg covers text
          style={{
            gridArea: "1 / 1",
            color: "transparent",
            backgroundImage: `radial-gradient(circle at ${mouseXPosition} 50%, rgba(0, 0, 0, 0), rgb(0, 0, 0, 1) 50%`,
            backgroundClip: "text",
          }}
        >
          {children}
        </div>

        {/* overlay if not hovering */}
        <div
          className="px-2 pt-1 transition-opacity duration-500" // make sure bg covers text
          style={{
            opacity: hovering ? 0 : 1,
            gridArea: "1 / 1",
            color: "black",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
