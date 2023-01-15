/* -------------------------------------------------------------------------- */
/*                                    main                                    */

import { loaderZIndex } from "../constants/uiConstants"

/* -------------------------------------------------------------------------- */
export default function Loader() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-slate-200"
      style={{
        zIndex: loaderZIndex,
      }}
    >
      Loading...
    </div>
  )
}
