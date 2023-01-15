import { AnimatePresence, motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { FlowerCanvas } from "../src/components/Flower"
import Loader from "../src/components/Loader"
import { useImages } from "../src/hooks/useImages"
import { RegenerateRefType } from "../src/types/RegenerateRefType"

/* -------------------------------------------------------------------------- */
/*                                  constants                                 */
/* -------------------------------------------------------------------------- */
const images = [
  "./assets/petalB_1.jpg",
  "./assets/petal1_4.jpg",
  "./assets/petal1_5.jpg",
  "./assets/petal3_1.jpg",
  "./assets/petal4_2.jpg",
  "./assets/petal1_specular.png",
  "./assets/peta1_normal.png",
  "./assets/stamen.png",
  "./assets/stamendisk_normal.jpg",
  "./assets/stamendisk2.jpg",
]

/* -------------------------------------------------------------------------- */
/*                                    main                                    */
/* -------------------------------------------------------------------------- */
export default function Home() {
  const { loaded: imagesLoaded } = useImages(images)

  /* --------------------------------- states --------------------------------- */
  const [initialised, setInitialised] = useState(false)
  const [loading, setLoading] = useState(true) // minimum loading timeout

  /* ---------------------------------- refs ---------------------------------- */
  const flowerCanvasRef = useRef<RegenerateRefType | null>(null)

  /* --------------------------------- effects -------------------------------- */
  // initialise
  useEffect(() => {
    setInitialised(true)

    setTimeout(() => {
      setLoading(false)
    }, 3e3)
  }, [])

  const flowerDisplay = () => {
    return (
      <>
        <div className="absolute inset-0">
          <FlowerCanvas ref={flowerCanvasRef} isLoaded={imagesLoaded && !loading} />
        </div>

        {/* bg overlay */}
        <div
          className="pointer-events-none absolute inset-0 select-none"
          style={{
            background: "linear-gradient(rgba(245, 228, 229, 0.15) 65%, rgba(218, 241, 239, 0.7) 100%)",
          }}
        />
      </>
    )
  }

  /* ---------------------------------- main ---------------------------------- */
  return (
    <div>
      {(!initialised || !imagesLoaded || loading) && <Loader />}

      {/* flower */}
      {initialised && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute inset-0 bg-[rgb(245,228,229)]"
          >
            {flowerDisplay()}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
