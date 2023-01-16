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
        <div className="absolute inset-y-0 left-0 w-full translate-y-20 lg:w-1/2 lg:translate-y-0">
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
    <div className="overflow-hidden">
      {(!initialised || !imagesLoaded || loading) && <Loader />}

      {/* flower */}
      {initialised && <div className="absolute inset-0 bg-[rgb(245,228,229)]">{flowerDisplay()}</div>}
    </div>
  )
}
