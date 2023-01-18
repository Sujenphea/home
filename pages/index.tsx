import { AnimatePresence, motion, useAnimationControls } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { FlowerCanvas } from "../src/components/Flower"
import { HoverGradientText } from "../src/components/HoverGradientText"
import Loader from "../src/components/Loader"
import { useImages } from "../src/hooks/useImages"
import { useWindowSize } from "../src/hooks/useWindowSize"
import { IconGithub } from "../src/Icons/IconGithub"
import { RegenerateRefType } from "../src/types/RegenerateRefType"
import { usePointer } from "../src/hooks/usePointer"

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
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const { x: pointerX, y: pointerY, pointerType } = usePointer()

  /* --------------------------------- states --------------------------------- */
  const [initialised, setInitialised] = useState(false)
  const [loading, setLoading] = useState(true) // minimum loading timeout
  const [showFlower, setShowFlower] = useState(false)

  /* ---------------------------------- refs ---------------------------------- */
  const flowerCanvasRef = useRef<RegenerateRefType | null>(null)

  /* --------------------------- animation controls --------------------------- */
  const titleAnimationControls = useAnimationControls()
  const subheadingAnimationControls = useAnimationControls()
  const socialMediaAnimationControls = useAnimationControls()

  /* --------------------------------- effects -------------------------------- */
  // initialise
  useEffect(() => {
    setInitialised(true)

    setTimeout(() => {
      setLoading(false)
    }, 2e3)
  }, [])

  // animate
  useEffect(() => {
    if (imagesLoaded && !loading) {
      ;(async () => {
        setShowFlower(true)

        await titleAnimationControls.start({
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.6,
            delay: 2.5,
            type: "tween",
            ease: "easeOut",
          },
        })
        await subheadingAnimationControls.start({
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.6,
            type: "tween",
            ease: "easeOut",
          },
        })
        await socialMediaAnimationControls.start({
          opacity: 1,
          transition: {
            duration: 0.5,
            delay: 0.5,
            type: "tween",
            ease: "easeInOut",
          },
        })
      })()
    }
  }, [imagesLoaded, loading, socialMediaAnimationControls, subheadingAnimationControls, titleAnimationControls])

  /* --------------------------------- display -------------------------------- */
  const flowerDisplay = () => {
    return (
      <>
        <div className="absolute inset-y-0 left-0 w-full translate-y-10 md:translate-y-0 lg:-translate-x-10">
          <FlowerCanvas
            ref={flowerCanvasRef}
            isLoaded={showFlower}
            windowWidth={windowWidth || 0}
            windowHeight={windowHeight || 0}
            pointerX={pointerX}
            pointerY={pointerY}
            pointerType={pointerType}
          />
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
        <div className="relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: (windowWidth || 0) < 768 ? "0" : "100%" }}
            animate={titleAnimationControls}
          >
            {/* desktop */}
            <div className="hidden md:block">
              <HoverGradientText
                nonHoverGradient="linear-gradient(90deg, rgba(33,49,67,1) 0%, rgba(40,83,131,1) 10%, rgba(33,49,67,1) 20%)"
                hoverGradient="linear-gradient(90deg, rgba(50,80,120,1) 0%, rgba(40,80,130,1) 50%, rgba(50,80,120,1) 100%)"
                className="whitespace-nowrap text-right text-5xl font-bold uppercase tracking-wide md:text-7xl lg:text-[92px]"
              >
                Sujen Phea
              </HoverGradientText>
            </div>

            {/* mobile */}
            <div className="block md:hidden">
              <div className="whitespace-nowrap text-right text-5xl font-bold uppercase tracking-wide">Sujen Phea</div>
            </div>
          </motion.div>
        </div>

        {/* subheading + socail media */}
        <div className="relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: (windowWidth || 0) < 768 ? "0" : "100%" }}
            animate={subheadingAnimationControls}
          >
            <div className="flex items-center gap-3">
              <div className="text-xl text-black-alpha50 lg:text-2xl lg:font-medium">Web Developer</div>

              {/* mobile social media -> cannot position at the bottom ... ios hides it ... */}
              <a
                className="relative block h-8 w-8 md:hidden"
                href="https://github.com/sujenphea"
                target="_blank"
                rel="noreferrer"
              >
                <IconGithub className="pointer-events-none h-full w-full" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  /* ---------------------------------- main ---------------------------------- */
  return (
    <div className="overflow-hidden">
      <AnimatePresence>{(!initialised || !imagesLoaded || loading) && <Loader />}</AnimatePresence>

      {/* flower */}
      {initialised && <div className="absolute inset-0 bg-[rgba(210,219,243,0.5)]">{flowerDisplay()}</div>}

      <AnimatePresence>
        {initialised && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: { duration: 0.2 },
            }}
            className="relative h-screen w-screen"
          >
            {/* content */}
            <div className="absolute right-10 top-10 md:top-20">{contentDisplay()}</div>

            {/* desktop: socail media */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={socialMediaAnimationControls}
              className="absolute bottom-10 left-10 hidden md:block"
            >
              <a
                className="group relative block h-8 w-8 xl:h-10 xl:w-10"
                href="https://github.com/sujenphea"
                target="_blank"
                rel="noreferrer"
              >
                <IconGithub className="pointer-events-none h-full w-full transition-transform group-hover:scale-90" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
