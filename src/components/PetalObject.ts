import { Mesh, Object3D } from "three"

export class PetalObject extends Object3D {
  petal?: Mesh

  depth?: number

  spawnDelay?: number

  spawnDuration?: number

  petalScale?: number

  petalScaleZ?: number

  isStamen?: boolean
}
