import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"

/* -------------------------------------------------------------------------- */
/*                                  constants                                 */
/* -------------------------------------------------------------------------- */
// const pulseAnimation = keyframes`
//   0% {
//     transform: translate(-50%, -50%) scale(0);
//     opacity: 1;
//   }
//   100% {
//     -webkit-transform: translate(-50%, -50%) scale(1);
//     transform: translate(-50%, -50%) scale(1);
//     opacity: 0;
//   }
// `

type LoadingStates = "none" | "loading" | "loaded" | "returnLoading" | "returnLoaded"

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */
const LoadingAnimation = (input: { state?: LoadingStates }) => {
  const [transformAnimation, setTransformAnimation] = useState({
    translate: "translateY(-100%)",
    red: "0.2s",
    black: "0s",
  })

  useEffect(() => {
    switch (input.state) {
      case "none":
        setTransformAnimation({ translate: "translateY(-100%)", red: "0s", black: "0.2s" })
        break
      case "loading":
        setTransformAnimation({ translate: "translateY(0)", red: "0.2s", black: "0s" })
        break
      case "loaded":
        setTransformAnimation({ translate: "translateY(100%)", red: "0s", black: "0.2s" })
        break
      case "returnLoading":
        setTransformAnimation({ translate: "translateY(0)", red: "0.2s", black: "0s" })
        break
      case "returnLoaded":
        setTransformAnimation({ translate: "translateY(-100%)", red: "0s", black: "0.2s" })
        break
      default:
        break
    }
  }, [input.state])

  return (
    <div>
      {/* black bg */}
      <div
        className="fixed inset-0 z-[500] bg-black duration-[400ms]"
        style={{
          transitionDelay: transformAnimation.black,
          background: "black",
          transform: transformAnimation.translate,
        }}
      />

      {/* red bg */}
      <div
        className="fixed inset-0 z-[500] bg-red-500 duration-[400ms]"
        style={{
          transitionDelay: transformAnimation.red,
          transform: transformAnimation.translate,
        }}
      >
        {/* circle in loading mode */}
        <div className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-white" />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    main                                    */
/* -------------------------------------------------------------------------- */
export default function Transition(input: { children?: ReactNode }) {
  const { asPath, events } = useRouter()

  /* --------------------------------- states --------------------------------- */
  const [loading, setLoading] = useState<LoadingStates>("none")

  /* --------------------------------- effects -------------------------------- */
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
        }, 800)
      }
      // other navigations
      else if (url === asPath) {
        setTimeout(() => {
          setLoading("loaded")
        }, 1000)
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

  // animate initial loading if initial page is not home
  useEffect(() => {
    if (asPath !== "/") {
      setLoading("loading")
      setTimeout(() => {
        setLoading("loaded")
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---------------------------------- main ---------------------------------- */
  return (
    <div className="overflow-hidden">
      <LoadingAnimation state={loading} />
      <AnimatePresence initial mode="wait">
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
      </AnimatePresence>
    </div>
  )
}
