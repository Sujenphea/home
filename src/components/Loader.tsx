/* -------------------------------------------------------------------------- */
/*                                    main                                    */

import { motion, useAnimationControls } from "framer-motion"
import { useEffect } from "react"
import Image from "next/image"
import { loaderZIndex } from "../constants/uiConstants"

import glasses from "../../public/assets/glasses.svg"

/* -------------------------------------------------------------------------- */
export default function Loader() {
  /* --------------------------- animation controls --------------------------- */
  const loaderAnimationControls = useAnimationControls()
  const gogglyEye1Controls = useAnimationControls()
  const gogglyEye2Controls = useAnimationControls()

  /* --------------------------------- effects -------------------------------- */
  useEffect(() => {
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
  }, [gogglyEye1Controls, gogglyEye2Controls, loaderAnimationControls])

  /* ---------------------------------- main ---------------------------------- */
  return (
    <motion.div
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="fixed inset-0 flex items-center justify-center bg-slate-200"
      style={{
        zIndex: loaderZIndex,
      }}
    >
      <div className="relative w-40">
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
    </motion.div>
  )
}
