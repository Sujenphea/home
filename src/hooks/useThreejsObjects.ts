import { useLoader } from "@react-three/fiber"
import { OBJLoader } from "three-stdlib"

export const useThreejsObjects = () => {
  const stamenDisc = useLoader(OBJLoader, `./meshes/stamendisk_proto_v1.obj`)
  const stamenProto1 = useLoader(OBJLoader, "./meshes/stamen_proto_1.obj")
  const stamenProto2 = useLoader(OBJLoader, "./meshes/stamen_proto_2.obj")
  const stamenProto3 = useLoader(OBJLoader, "./meshes/stamen_proto_3.obj")
  const stamenProto4 = useLoader(OBJLoader, "./meshes/stamen_proto_4.obj")
  const stamenProto5 = useLoader(OBJLoader, "./meshes/stamen_proto_5.obj")

  const stem1Path = useLoader(OBJLoader, "./meshes/stem1_path.obj")
  const stem1 = useLoader(OBJLoader, "./meshes/stem1.obj")

  const petalProto2 = useLoader(OBJLoader, "./meshes/petal_proto2.obj")
  const petalProto4 = useLoader(OBJLoader, "./meshes/petal_proto4.obj")
  const petalProto5 = useLoader(OBJLoader, "./meshes/petal_proto5.obj")
  const petalProto6 = useLoader(OBJLoader, "./meshes/petal_proto6.obj")
  const petalProto7 = useLoader(OBJLoader, "./meshes/petal_proto7.obj")

  return {
    stamenDisc,
    stamenProto1,
    stamenProto2,
    stamenProto3,
    stamenProto4,
    stamenProto5,
    stem1Path,
    stem1,
    petalProto2,
    petalProto4,
    petalProto5,
    petalProto6,
    petalProto7,
  }
}
