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
        <div className="absolute inset-y-0 left-0 w-full -translate-x-10">
          <FlowerCanvas ref={flowerCanvasRef} isLoaded={imagesLoaded && !loading} />
        </div>

        {/* bg overlay */}
        <div
          className="pointer-events-none absolute inset-0 select-none"
          style={{
            background: "linear-gradient(rgba(100, 100, 100, 0.1) 0%, rgba(0, 0, 0, 0) 50%)",
          }}
        />

        {/* opaque overlay */}
        <div
          className="pointer-events-none absolute inset-0 select-none"
          style={{
            background: "linear-gradient(rgba(226,244,255,0.15) 65%, rgba(225,228,245,0.7) 100%)",
          }}
        />
      </>
    )
  }

  const contentDisplay = () => {
    return (
      <div className="flex flex-col items-end gap-3">
        {/* heading */}
        <HoverGradientText
          nonHoverGradient="linear-gradient(90deg, rgba(33,49,67,1) 0%, rgba(40,83,131,1) 10%, rgba(33,49,67,1) 20%)"
          hoverGradient="linear-gradient(90deg, rgba(50,80,120,1) 0%, rgba(40,80,130,1) 50%, rgba(50,80,120,1) 100%)"
          className="whitespace-nowrap text-right text-6xl font-bold uppercase tracking-wide md:text-7xl lg:text-[92px]"
        >
          Sujen Phea
        </HoverGradientText>

        {/* subheading */}
        <div className="text-xl text-black-alpha50 lg:text-2xl lg:font-medium">Web Developer</div>
      </div>
    )
  }

  /* ---------------------------------- main ---------------------------------- */
  return (
    <div className="overflow-hidden">
      {(!initialised || !imagesLoaded || loading) && <Loader />}

      {/* flower */}
      {/* {initialised && <div className="absolute inset-0 bg-[rgb(230,229,213)]">{flowerDisplay()}</div>} */}
      {initialised && <div className="absolute inset-0 bg-[rgba(210,219,243,0.5)]">{flowerDisplay()}</div>}

      {initialised && (
        <>
          {/* content */}
          <div className="absolute right-10 top-20 ">{contentDisplay()}</div>

          {/* footer */}
          <div className="absolute bottom-10 left-10">
            {/* social media */}
            <a
              className="group relative block h-8 w-8 xl:h-10 xl:w-10"
              href="https://github.com/sujenphea"
              target="_blank"
              rel="noreferrer"
            >
              <IconGithub className="pointer-events-none h-full w-full transition-transform group-hover:scale-90" />
            </a>
          </div>
        </>
      )}
    </div>
  )
}
