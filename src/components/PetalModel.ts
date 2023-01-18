import seedrandom from "seedrandom"
import { DoubleSide, MeshPhongMaterial, TextureLoader, Vector2 } from "three"

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */
type MaterialProperties = {
  showCode?: boolean
  emissive: number
  ambient: number
  color: number
  specular: number
  backgroundColor: string
  backgroundColorBottom: string
  backgroundTint: number
  gloss: number
  normalScale: number
  lightingWrap: number
  colorMap: string
  specularMap: string
  normalMap: string
}

/* eslint-disable no-bitwise */
/* eslint-disable class-methods-use-this */
export class PetalStyleModel {
  textureLoader = new TextureLoader()

  backgroundGradientBottomAlpha: number

  backgroundColors: string[]

  backgroundColorsBottom: string[]

  colorMaps: string[]

  specularMaps: string[]

  normalMaps: string[]

  petalStyles: {
    color: number
    specular: number
    backgroundColor: string
    backgroundColorBottom: string
    backgroundTint: number
    emissive: number
    ambient: number
    gloss: number
    normalScale: number
    lightingWrap: number
    colorMap: string
    specularMap: string
    normalMap: string
  }[]

  useRandomPreset = true

  presetIndex = 1

  showCode = false

  // properties
  color!: number

  specular!: number

  backgroundColor!: string

  backgroundColorBottom!: string

  backgroundTint!: number

  emissive!: number

  ambient!: number

  gloss!: number

  normalScale!: number

  lightingWrap!: number

  colorMap!: string

  specularMap!: string

  normalMap!: string

  hue!: number

  baseSeed = `${Math.random() * 1000}`

  /* ---------------------------------- init ---------------------------------- */
  constructor() {
    // setup
    this.backgroundGradientBottomAlpha = 0.7
    this.backgroundColors = ["#e1f1de", "#daf1ef", "#f5e4e5", "#ffe5d2", "#fff1d2"]
    this.backgroundColorsBottom = ["#fff1d2", "#e1f1de", "#daf1ef", "#f5e4e5", "#ffe5d2"]
    this.colorMaps = [
      "./assets/petalB_1.jpg",
      "./assets/petal1_4.jpg",
      "./assets/petal1_5.jpg",
      "./assets/petal3_1.jpg",
      "./assets/petal4_2.jpg",
    ]
    this.specularMaps = ["./assets/petal1_specular.png"]
    this.normalMaps = ["./assets/peta1_normal.png"]
    this.petalStyles = [
      {
        color: 16777215,
        specular: 8504725,
        backgroundColor: this.backgroundColors[0],
        backgroundColorBottom: this.backgroundColorsBottom[0],
        backgroundTint: 0.15,
        emissive: 0,
        ambient: 16777215,
        gloss: 5,
        normalScale: 1.3,
        lightingWrap: 1.7,
        colorMap: this.colorMaps[0],
        specularMap: this.specularMaps[0],
        normalMap: this.normalMaps[0],
      },
      {
        color: 3442,
        specular: 4761062,
        backgroundColor: this.backgroundColors[0],
        backgroundColorBottom: this.backgroundColorsBottom[2],
        backgroundTint: 0.15,
        emissive: 0,
        ambient: 16777215,
        gloss: 5,
        normalScale: 1,
        lightingWrap: 1.6,
        colorMap: this.colorMaps[0],
        specularMap: this.specularMaps[0],
        normalMap: this.normalMaps[0],
      },
      {
        color: 13446026,
        specular: 318955,
        backgroundColor: this.backgroundColors[0],
        backgroundColorBottom: this.backgroundColorsBottom[0],
        backgroundTint: 0.15,
        emissive: 0,
        ambient: 16777215,
        gloss: 5,
        normalScale: 1,
        lightingWrap: 1.6,
        colorMap: this.colorMaps[0],
        specularMap: this.specularMaps[0],
        normalMap: this.normalMaps[0],
      },
      {
        color: 16777215,
        specular: 4161691,
        backgroundColor: this.backgroundColors[1],
        backgroundColorBottom: this.backgroundColorsBottom[1],
        backgroundTint: 0.15,
        emissive: 0,
        ambient: 16777215,
        gloss: 5,
        normalScale: 1,
        lightingWrap: 1.7,
        colorMap: "./assets/petal4_2.jpg",
        specularMap: "./assets/petal1_specular.png",
        normalMap: "./assets/peta1_normal.png",
      },
      {
        color: 6488728,
        specular: 4681612,
        backgroundColor: this.backgroundColors[0],
        backgroundColorBottom: this.backgroundColorsBottom[1],
        backgroundTint: 0.15,
        emissive: 0,
        ambient: 0,
        gloss: 7.9,
        normalScale: 3.2,
        lightingWrap: 1.6,
        colorMap: "./assets/petalB_1.jpg",
        specularMap: "./assets/petal1_specular.png",
        normalMap: "./assets/peta1_normal.png",
      },
      {
        color: 13577774,
        specular: 10521124,
        backgroundColor: this.backgroundColors[2],
        backgroundColorBottom: this.backgroundColorsBottom[2],
        backgroundTint: 0.15,
        emissive: 0,
        ambient: 16777215,
        gloss: 5,
        normalScale: 1,
        lightingWrap: 1.72,
        colorMap: "./assets/petal4_2.jpg",
        specularMap: "./assets/petal1_specular.png",
        normalMap: "./assets/peta1_normal.png",
      },
      {
        color: 16777215,
        specular: 863021,
        backgroundColor: this.backgroundColors[0],
        backgroundColorBottom: this.backgroundColorsBottom[0],
        backgroundTint: 0.46,
        emissive: 0,
        ambient: 16777215,
        gloss: 26.965368410235328,
        normalScale: 1,
        lightingWrap: 1.7,
        colorMap: "./assets/petalB_1.jpg",
        specularMap: "./assets/petal1_specular.png",
        normalMap: "./assets/peta1_normal.png",
      },
      {
        color: 2447283,
        specular: 72734,
        backgroundColor: this.backgroundColors[2],
        backgroundColorBottom: this.backgroundColorsBottom[2],
        backgroundTint: 0.164,
        emissive: 0,
        ambient: 16777215,
        gloss: 10.523070599116227,
        normalScale: 5.090535402322475,
        lightingWrap: 1.321960744013976,
        colorMap: "./assets/petal1_4.jpg",
        specularMap: "./assets/petal1_specular.png",
        normalMap: "./assets/peta1_normal.png",
      },
      {
        color: 12692687,
        specular: 318955,
        backgroundColor: this.backgroundColors[2],
        backgroundColorBottom: this.backgroundColorsBottom[2],
        backgroundTint: 0.15,
        emissive: 0,
        ambient: 16777215,
        gloss: 5,
        normalScale: 1,
        lightingWrap: 1.6,
        colorMap: "./assets/petalB_1.jpg",
        specularMap: "./assets/petal1_specular.png",
        normalMap: "./assets/peta1_normal.png",
      },
      {
        color: 11279131,
        specular: 11754252,
        backgroundColor: this.backgroundColors[3],
        backgroundColorBottom: this.backgroundColorsBottom[3],
        backgroundTint: 0.19991670137442732,
        emissive: 0,
        ambient: 16777215,
        gloss: 5.261535299558114,
        normalScale: 1.9991670137442732,
        lightingWrap: 1.7392753019575178,
        colorMap: "./assets/petal3_1.jpg",
        specularMap: "./assets/petal1_specular.png",
        normalMap: "./assets/peta1_normal.png",
      },
      {
        color: 14442078,
        specular: 5144377,
        backgroundColor: this.backgroundColors[0],
        backgroundColorBottom: this.backgroundColorsBottom[0],
        backgroundTint: 0.15,
        emissive: 0,
        ambient: 16777215,
        gloss: 5,
        normalScale: 1,
        lightingWrap: 1.6,
        colorMap: "./assets/petal1_5.jpg",
        specularMap: "./assets/petal1_specular.png",
        normalMap: "./assets/peta1_normal.png",
      },
      {
        color: 5721678,
        specular: 4128835,
        backgroundColor: this.backgroundColors[4],
        backgroundColorBottom: this.backgroundColorsBottom[4],
        backgroundTint: 0.15,
        emissive: 4718600,
        ambient: 16777215,
        gloss: 16.442297811119104,
        normalScale: 2.367690884801151,
        lightingWrap: 2.4389837567680135,
        colorMap: "./assets/petal1_5.jpg",
        specularMap: "./assets/petal1_specular.png",
        normalMap: "./assets/peta1_normal.png",
      },
      {
        color: 7864320,
        specular: 4400444,
        backgroundColor: this.backgroundColors[2],
        backgroundColorBottom: this.backgroundColorsBottom[2],
        backgroundTint: 0.15,
        emissive: 0,
        ambient: 16777215,
        gloss: 31.240365841126298,
        normalScale: 2.2887678553077793,
        lightingWrap: 2.328229370054465,
        colorMap: "./assets/petalB_1.jpg",
        specularMap: "./assets/petal1_specular.png",
        normalMap: "./assets/peta1_normal.png",
      },
      {
        color: 20394,
        specular: 4161691,
        backgroundColor: this.backgroundColors[1],
        backgroundColorBottom: this.backgroundColorsBottom[1],
        backgroundTint: 0.15,
        emissive: 4718600,
        ambient: 16777215,
        gloss: 7.663473552686381,
        normalScale: 4.75801749271137,
        lightingWrap: 1.9391920033319447,
        colorMap: "./assets/petal4_2.jpg",
        specularMap: "./assets/petal1_specular.png",
        normalMap: "./assets/peta1_normal.png",
      },
    ]

    this.setDefaultProperties()
    this.setPresetIndex(0)
  }

  /* --------------------------------- private -------------------------------- */
  private setDefaultProperties() {
    this.color = 16777215
    this.specular = 10066329
    this.backgroundColor = this.backgroundColors[0]
    this.backgroundColorBottom = this.backgroundColorsBottom[0]
    this.backgroundTint = 0.15
    this.emissive = 0
    this.ambient = 16777215
    this.gloss = 5
    this.normalScale = 1
    this.lightingWrap = 1.7
    this.colorMap = this.colorMaps[0]
    this.specularMap = this.specularMaps[0]
    this.normalMap = this.normalMaps[0]
    this.hue = 1
  }

  /**
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   * ref: https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
   *
   * @param   {number}  h       The hue
   * @param   {number}  s       The saturation
   * @param   {number}  l       The lightness
   * @return  {Array}           The RGB representation
   */
  hslToRgb(h: number, s: number, l: number) {
    let r
    let g
    let b

    if (s === 0) {
      r = l
      g = l
      b = l
    } else {
      const hue2rgb = function hue2rgb(_p: number, _q: number, _t: number) {
        let t = _t

        if (t < 0) {
          t += 1
        }

        if (t > 1) {
          t -= 1
        }

        if (t < 1 / 6) {
          return _p + (_q - _p) * 6 * t
        }

        if (t < 1 / 2) {
          return _q
        }

        if (t < 2 / 3) {
          return _p + (_q - _p) * (2 / 3 - t) * 6
        }
        return _p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
  }

  private rgbToHsl(_e: number, _t: number, _n: number) {
    const e = _e / 255
    const t = _t / 255
    const n = _n / 255

    const r = Math.max(e, t, n)
    const i = Math.min(e, t, n)
    let s
    let o
    const u = (r + i) / 2
    if (r === i) {
      s = 0
      o = 0
    } else {
      const a = r - i
      o = u > 0.5 ? a / (2 - r - i) : a / (r + i)

      switch (r) {
        case e:
          s = (t - n) / a + (t < n ? 6 : 0)
          break
        case t:
          s = (n - e) / a + 2
          break
        case n:
          s = (e - t) / a + 4
          break
        default:
          s = 0
          break
      }
      s /= 6
    }
    return [s, o, u]
  }

  private hueFromInt(e: number) {
    const t = (e >> 16) & 255
    const n = (e >> 8) & 255
    const r = e & 255
    const i = this.rgbToHsl(t, n, r)

    return i[0]
  }

  private hexToRgb(hex: string) {
    let e = ""
    if (hex.indexOf("#") === 0) {
      e = `0x${hex.substr(1)}`
    }

    const t = parseInt(e, 16)
    const n = (t >> 16) & 255
    const r = (t >> 8) & 255
    const i = t & 255

    return { r: n, g: r, b: i }
  }

  private setMaterialProperties(t: MaterialProperties) {
    this.setDefaultProperties()

    if (t.showCode) {
      this.showCode = t.showCode
    }
    if (t.emissive) {
      this.emissive = t.emissive
    }
    if (t.ambient) {
      this.ambient = t.ambient
    }
    if (t.color) {
      this.color = t.color
    }
    this.hue = this.hueFromInt(this.color)
    if (t.specular) {
      this.specular = t.specular
    }
    if (t.backgroundColor) {
      this.backgroundColor = t.backgroundColor
    }

    if (t.backgroundColorBottom) {
      this.backgroundColorBottom = t.backgroundColorBottom
    }
    if (t.backgroundTint) {
      this.backgroundTint = t.backgroundTint
    }
    if (t.gloss) {
      this.gloss = t.gloss
    }
    if (t.normalScale) {
      this.normalScale = t.normalScale
    }
    if (t.lightingWrap) {
      this.lightingWrap = t.lightingWrap
    }
    if (t.colorMap) {
      this.colorMap = t.colorMap
    }
    if (t.specularMap) {
      this.specularMap = t.specularMap
    }
    if (t.normalMap) {
      this.normalMap = t.normalMap
    }
  }

  private setPresetIndex(e: number) {
    this.setMaterialProperties(this.petalStyles[e])
    this.presetIndex = e
  }

  /* --------------------------------- public --------------------------------- */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getNewMaterialFromStyle(_e: number) {
    const colorMap = this.textureLoader.load(this.colorMap)
    const normalMap = this.textureLoader.load(this.normalMap)
    const specularMap = this.textureLoader.load(this.specularMap)

    const s = new MeshPhongMaterial({
      color: this.color,
      emissive: this.emissive,
      specular: this.specular,
      shininess: this.gloss,
      map: colorMap,
      specularMap,
      normalMap,
      normalScale: new Vector2(this.normalScale, this.normalScale),
      precision: "mediump",
    })

    s.side = DoubleSide
    return s
  }

  public setRandomPreset() {
    this.baseSeed = `${Math.random() * 1000}`
    const e = seedrandom(`${this.baseSeed}-petalStyle_preset`)

    this.setPresetIndex(Math.floor(e() * (this.petalStyles.length - 0.001)))
  }

  public hexToHtmlRgba(e: string, _t: number) {
    const t = Math.round(_t * 100) / 100
    const n = this.hexToRgb(e)
    return `rgba(${n.r},${n.g},${n.b},${t})`
  }

  public decimalToHex(decimal: number) {
    let t = Number(decimal).toString(16)

    t = "000000".substr(0, 6 - t.length) + t
    return t
  }
}
