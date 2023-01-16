import { useEffect, useRef, useState } from "react"
import { FlowerCanvas } from "../src/components/Flower"
import { HoverGradientText } from "../src/components/HoverGradientText"
import Loader from "../src/components/Loader"
import { useImages } from "../src/hooks/useImages"
import { IconGithub } from "../src/Icons/IconGithub"
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

  const contentDisplay = () => {
    return (
      <div className="flex flex-col items-center gap-2 lg:items-start lg:gap-4 xl:gap-5">
        {/* heading */}
        <div className="cursor-default">
          <HoverGradientText className="whitespace-nowrap font-heading text-5xl font-bold uppercase tracking-wide xl:text-6xl">
            Sujen Phea
          </HoverGradientText>
        </div>

        {/* subheading */}
        <div className="mb-4 cursor-default lg:mb-8">
          <div className="text-lg text-black-alpha50 xl:text-xl">Web Developer.</div>
        </div>

        {/* social media */}
        <a
          className="group relative h-8 w-8 xl:h-10 xl:w-10"
          href="https://github.com/sujenphea"
          target="_blank"
          rel="noreferrer"
        >
          <IconGithub
            width="100%"
            className="pointer-events-none absolute top-0 left-0 flex h-full w-full items-center justify-center transition-transform group-hover:scale-90"
          />
        </a>
      </div>
    )
  }

  /* ---------------------------------- main ---------------------------------- */
  return (
    <div className="overflow-hidden">
      {(!initialised || !imagesLoaded || loading) && <Loader />}

      {/* flower */}
      {initialised && <div className="absolute inset-0 bg-[rgb(245,228,229)]">{flowerDisplay()}</div>}

      {/* content */}
      {initialised && (
        <div className="absolute left-1/2 top-20 -translate-x-1/2 lg:right-40 lg:top-1/2 lg:left-auto lg:-translate-y-1/2 lg:translate-x-0 xl:right-1/4">
          {contentDisplay()}
        </div>
      )}
    </div>
  )
}
