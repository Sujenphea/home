import { AnimatePresence, motion, useAnimationControls } from "framer-motion"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import Image from "next/image"

import glasses from "../../public/assets/glasses.svg"
import { useImages } from "../hooks/useImages"
import { loaderZIndex } from "../constants/uiConstants"

/* -------------------------------------------------------------------------- */
/*                                  constants                                 */
/* -------------------------------------------------------------------------- */
type LoadingStates = "none" | "loading" | "loaded" | "returnLoading" | "returnLoaded"

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
/*                                 components                                 */
/* -------------------------------------------------------------------------- */
/**
 *
 * @param initialLoading Modify loading page if not in initial loading state
 */
const LoadingAnimation = (input: { state?: LoadingStates; initialLoading?: boolean }) => {
  /* --------------------------------- states --------------------------------- */
  const [transformAnimation, setTransformAnimation] = useState({
    translate: "translateY(-100%)",
    mainBg: "0.2s",
    transitionBg: "0s",
  })

  /* --------------------------- animation controls --------------------------- */
  const loaderAnimationControls = useAnimationControls()
  const gogglyEye1Controls = useAnimationControls()
  const gogglyEye2Controls = useAnimationControls()

  /* --------------------------------- effects -------------------------------- */
  // animate goggly eyes
  useEffect(() => {
    if (input.initialLoading) {
      ;(async () => {
        await loaderAnimationControls.start({
          opacity: 1,
          transition: { duration: 0.5, delay: 0.2 },
        })

        gogglyEye1Controls.start({
          rotate: "-360deg",
          y: "-50%",

          transition: {
            duration: 1,
            delay: 0.5,
            repeat: Infinity,
            repeatDelay: 0.2,
            type: "spring",
            bounce: 0.4,
          },
        })

        gogglyEye2Controls.start({
          rotate: "360deg",
          y: "-50%",

          transition: {
            duration: 2,
            delay: 0.3,
            repeat: Infinity,
            repeatDelay: 0.5,
            type: "spring",
            bounce: 0.5,
          },
        })
      })()
    }
  }, [gogglyEye1Controls, gogglyEye2Controls, loaderAnimationControls, input.initialLoading])

  // animate based on loading state
  useEffect(() => {
    switch (input.state) {
      case "none":
        setTransformAnimation({ translate: "translateY(-100%)", mainBg: "0s", transitionBg: "0.2s" })
        break
      case "loading":
        setTransformAnimation({ translate: "translateY(0)", mainBg: "0.2s", transitionBg: "0s" })
        break
      case "loaded":
        setTransformAnimation({ translate: "translateY(100%)", mainBg: "0s", transitionBg: "0.2s" })
        break
      case "returnLoading":
        setTransformAnimation({ translate: "translateY(0)", mainBg: "0.2s", transitionBg: "0s" })
        break
      case "returnLoaded":
        setTransformAnimation({ translate: "translateY(-100%)", mainBg: "0s", transitionBg: "0.2s" })
        break
      default:
        break
    }
  }, [input.state])

  /* ---------------------------------- main ---------------------------------- */
  return (
    <div>
      {/* transition bg */}
      <div
        className="fixed inset-0 bg-blue-200 duration-[400ms]"
        style={{
          zIndex: loaderZIndex,
          transitionDelay: transformAnimation.transitionBg,
          transform: transformAnimation.translate,
        }}
      />

      {/* main bg */}
      <div
        className="fixed inset-0 bg-bgColor duration-[400ms]"
        style={{
          zIndex: loaderZIndex,
          transitionDelay: transformAnimation.mainBg,
          transform: transformAnimation.translate,
        }}
      >
        {/* circle in loading mode */}
        {input.initialLoading && (
          <div className="absolute top-1/2 left-1/2 w-40 -translate-x-1/2 -translate-y-1/2">
            <Image src={glasses} alt="glasses loading icon" priority />

            {/* left goggly eye */}
            <motion.div
              initial={{
                y: "-50%",
              }}
              animate={gogglyEye1Controls}
              className="absolute top-1/2 left-[62px] h-5 w-5 rounded-full"
            >
              <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
            </motion.div>

            {/* right goggly eye */}
            <motion.div
              initial={{
                y: "-50%",
              }}
              animate={gogglyEye2Controls}
              className="absolute top-1/2 right-[16px] h-5 w-5 rounded-full"
            >
              <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    main                                    */
/* -------------------------------------------------------------------------- */
export default function Transition(input: { children?: ReactNode }) {
  const { asPath, events } = useRouter()
  const { loaded: imagesLoaded } = useImages(images)

  /* --------------------------------- states --------------------------------- */
  const [loading, setLoading] = useState<LoadingStates>("none")
  const [initialLoading, setInitialLoading] = useState(true)

  /* --------------------------------- effects -------------------------------- */
  // animate initial loading
  useEffect(() => {
    setLoading("loading")

    setTimeout(() => {
      if (asPath === "/") {
        setLoading("returnLoaded")
      } else {
        setLoading("loaded")
      }
      setInitialLoading(false)
    }, 3e3)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // setup router animation
  useEffect(() => {
    // event handlers
    const handleRouterChangeStart = (url: string) => {
      // back to home
      if (url === "/" && asPath !== "/") {
        setLoading("returnLoading")
      }
      // other navigations
      else if (url !== asPath) {
        setLoading("loading")
      }
    }

    const handleRouterChangeComplete = (url: string) => {
      // navigating back to home
      if (loading === "returnLoading") {
        setTimeout(() => {
          setLoading("returnLoaded")
        }, 400)
      }
      // other navigations
      else if (url === asPath) {
        setTimeout(() => {
          setLoading("loaded")
        }, 400)
      }
    }

    // listen to events
    events.on("routeChangeStart", handleRouterChangeStart)
    events.on("routeChangeComplete", handleRouterChangeComplete)
    events.on("routeChangeError", handleRouterChangeComplete)

    // remove events
    return () => {
      events.off("routeChangeStart", handleRouterChangeStart)
      events.off("routeChangeComplete", handleRouterChangeComplete)
      events.off("routeChangeError", handleRouterChangeComplete)
    }
  }, [asPath, events, loading])

  /* ---------------------------------- main ---------------------------------- */
  return (
    <div className="overflow-hidden">
      {/* loaders */}
      <LoadingAnimation state={loading} initialLoading={initialLoading} />

      {/* content */}
      <AnimatePresence initial mode="wait">
        {imagesLoaded && !initialLoading && (
          <motion.div
            key={asPath}
            variants={{
              initial: {
                opacity: 0,
              },
              animate: {
                opacity: 1,
                transition: { delay: 0.4, duration: 0.2 },
              },
              exit: {
                opacity: 0,
                transition: { delay: 0.2 },
              },
            }}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {input.children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
