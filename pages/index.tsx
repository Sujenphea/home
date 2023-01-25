import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import gsap, { Power1 } from "gsap"
import Link from "next/link"
import { IconArrowRight } from "@tabler/icons"
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
  const titleRef = useRef<HTMLDivElement | null>(null)
  const subheadingRef = useRef<HTMLDivElement | null>(null)
  const aboutLinkRef = useRef<HTMLAnchorElement | null>(null)
  const socialMediaRef = useRef<HTMLDivElement | null>(null)

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
      setShowFlower(true)

      gsap
        .timeline()

        // title
        .fromTo(
          titleRef.current,
          {
            opacity: 0,
            x: (windowWidth || 0) < 768 ? "0" : "15%",
            y: (windowWidth || 0) < 768 ? "-20%" : 0,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1,
            delay: 2.5,
            ease: Power1.easeOut,
          }
        )

        // subheading
        .fromTo(
          subheadingRef.current,
          {
            opacity: 0,
            x: (windowWidth || 0) < 768 ? "0" : "15%",
            y: (windowWidth || 0) < 768 ? "-20%" : 0,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1,
            ease: Power1.easeOut,
          },
          "<0.3"
        )

        // about me link
        .fromTo(
          aboutLinkRef.current,
          {
            opacity: 0,
            x: (windowWidth || 0) < 768 ? "0" : "15%",
            y: (windowWidth || 0) < 768 ? "-20%" : 0,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1,
            ease: Power1.easeOut,
          },
          "<0.3"
        )

        // social media
        .fromTo(
          socialMediaRef.current,
          {
            opacity: 0,
          },
          { opacity: 1, duration: 1 }
        )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesLoaded, loading])

  /* --------------------------------- display -------------------------------- */
  const flowerDisplay = () => {
    return (
      <>
        <div className="absolute inset-0 overflow-clip">
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
      <div className="flex flex-col items-end gap-1">
        {/* heading */}
        <div className="relative ">
          <div ref={titleRef}>
            {/* desktop */}
            <div className="hidden md:block">
              <HoverGradientText
                nonHoverGradient="linear-gradient(90deg, rgba(33,49,67,1) 0%, rgba(40,83,131,1) 10%, rgba(33,49,67,1) 20%)"
                hoverGradient="linear-gradient(90deg, rgba(50,80,160,1) 0%, rgba(40,80,130,1) 50%, rgba(50,80,160,1) 100%)"
                className="whitespace-nowrap pl-6 pr-3 text-right font-heading text-[72px] font-extralight lowercase leading-normal tracking-wide lg:text-[84px]"
              >
                Sujen Phea
              </HoverGradientText>

              {/* link to about me */}
              <Link href="/about">
                <div className="absolute right-0 top-0 h-8 w-8 translate-x-[50%] translate-y-[10%] cursor-pointer duration-200 ease-in-out hover:scale-75 hover:opacity-80 md:cursor-none">
                  <IconArrowRight width="100%" height="100%" className="-rotate-45" />
                </div>
              </Link>
            </div>

            {/* mobile */}
            <div className="md:hidden">
              {/* text */}
              <div className="whitespace-nowrap pl-6 pr-3 text-right font-heading text-[60px] font-bold lowercase tracking-wide">
                Sujen Phea
              </div>

              {/* link to about me */}
              <Link href="/about">
                <div className="absolute right-0 top-0 h-6 w-6 translate-x-[50%] cursor-pointer duration-200 ease-in-out hover:scale-75 hover:opacity-80 md:cursor-none">
                  <IconArrowRight width="100%" height="100%" className="-rotate-45" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* subheading + social media */}
        <div className="relative pr-6 lg:overflow-x-hidden">
          <div className="flex items-center gap-3 opacity-0" ref={subheadingRef}>
            <div className="text-lg uppercase text-black-alpha50 opacity-[0.45] md:text-xl md:font-bold lg:text-2xl">
              Web Developer
            </div>

            {/* mobile social media -> cannot position at the bottom ... ios hides it ... */}
            <div className="relative top-[-4px]">
              <a
                className="block h-8 w-8 md:hidden"
                href="https://github.com/sujenphea"
                target="_blank"
                rel="noreferrer"
              >
                <IconGithub className="pointer-events-none h-full w-full" />
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ---------------------------------- main ---------------------------------- */
  return (
    <div className="overflow-hidden">
      <AnimatePresence>{(!initialised || !imagesLoaded || loading) && <Loader />}</AnimatePresence>

      {/* flower */}
      {initialised && (
        <div className="absolute inset-0 bg-white">
          <div className="absolute inset-0 bg-[rgba(210,219,243,0.5)]">{flowerDisplay()}</div>
        </div>
      )}

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

            {/* desktop: social media */}
            <div className="absolute bottom-10 left-10 hidden opacity-0 md:block" ref={socialMediaRef}>
              <a
                className="group relative block h-8 w-8 xl:h-10 xl:w-10"
                href="https://github.com/sujenphea"
                target="_blank"
                rel="noreferrer"
              >
                <IconGithub className="pointer-events-none h-full w-full transition-transform group-hover:scale-90" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
