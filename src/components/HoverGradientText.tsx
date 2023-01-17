/* eslint-disable react/jsx-props-no-spreading */
import { motion } from "framer-motion"
import { DetailedHTMLProps, HTMLAttributes, useState, useRef, useCallback } from "react"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import { useWindowSize } from "../hooks/useWindowSize"

/**
 * @param hoverSpotlightRadius Relative to text container in percentage.
 */
export const HoverGradientText = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    nonHoverGradient?: string
    hoverGradient?: string
    hoverSpotlightRadius?: number
  }
) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { className, children, nonHoverGradient, hoverGradient, hoverSpotlightRadius, ...rest } = props

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
        className="pointer-events-none select-none"
        style={{
          gridArea: "1 / 1",
          color: "transparent",
          backgroundImage:
            hoverGradient ||
            "linear-gradient(90deg, rgba(60,60,60,1) 0%, rgba(100,100,180,1) 50%, rgba(60,60,60,1) 100%)",
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
        className="pointer-events-none"
        style={{
          gridArea: "1 / 1",
          color: "transparent",
          backgroundImage: `radial-gradient(circle at ${mouseXPosition} ${
            100 - (hoverSpotlightRadius || 50)
          }%, rgba(0, 0, 0, 0), rgb(0, 0, 0, 1) ${hoverSpotlightRadius || 50}%`,
          backgroundClip: "text",
        }}
      >
        {children}
      </div>

      {/* overlay if not hovering */}
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
        className="pointer-events-none select-none transition-opacity duration-500 ease-linear"
        style={{
          opacity: hovering ? 0 : 1,
          gridArea: "1 / 1",
          color: "transparent",
          background: nonHoverGradient || "linear-gradient(to right, #000 0, #666 20%, #000 40%)",
          backgroundClip: "text",
          height: "100%",
          width: "100%",
          backgroundSize: "200%",
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
