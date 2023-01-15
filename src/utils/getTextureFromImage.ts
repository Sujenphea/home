import { Texture } from "three"

export const getTextureFromImage = (e: HTMLImageElement) => {
  const t = document.createElement("canvas")
  t.width = e.width
  t.height = e.height

  const n = t.getContext("2d")
  if (n) {
    n.drawImage(e, 0, 0)
  }

  const r = new Texture(t)
  r.needsUpdate = !0
  return r
}
