import { useEffect, useState } from "react"

const loadImage = (url: string) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener("load", () => resolve(img))
    img.addEventListener("error", (err) => reject(err))
    img.src = url
  })

export const useImages = (images: string[]) => {
  const [loadedImages, setLoadedImages] = useState(false)

  useEffect(() => {
    // images
    ;(async () => {
      await Promise.all(images.map((img) => loadImage(img)))

      setLoadedImages(true)
    })()
  }, [images])

  return {
    loaded: loadedImages,
  }
}
