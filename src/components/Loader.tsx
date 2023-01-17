/* -------------------------------------------------------------------------- */
/*                                    main                                    */

import { motion, useAnimationControls } from "framer-motion"
import { useEffect } from "react"
import { loaderZIndex } from "../constants/uiConstants"
import { DotDotDotDisplay } from "./DotDotDotDisplay"

/* -------------------------------------------------------------------------- */
export default function Loader() {
  /* --------------------------- animation controls --------------------------- */
  const loaderAnimationControls = useAnimationControls()

  /* --------------------------------- effects -------------------------------- */
  useEffect(() => {
    ;(async () => {
      loaderAnimationControls.start({
        opacity: 1,
        transition: { duration: 0.5, delay: 0.2 },
      })
    })()
  }, [loaderAnimationControls])

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaderAnimationControls}
        className="relative flex h-20 w-20 items-center justify-center rounded-full"
      >
        {/* border animation */}
        <motion.div
          animate={{
            rotate: 360,
            transition: {
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 0,
            },
          }}
          className="absolute inset-0 rounded-[inherit] border-t-2 border-slate-500"
        />

        {/* text */}
        <div className="text-2xl font-bold">
          <DotDotDotDisplay />
        </div>
      </motion.div>
    </motion.div>
  )
}
