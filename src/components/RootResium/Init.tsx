import { useEffect } from "react"
import useCesium from "../../hooks/useCesium"
import { Cartesian3, Math } from "cesium"

const Init = () => {
  const { scene, camera } = useCesium()
  useEffect(() => {
    scene.postProcessStages.fxaa.enabled = true
    camera.flyTo({
      destination: Cartesian3.fromDegrees(116.395102, 39.868458, 8000),
      orientation: {
        heading: Math.toRadians(-1), // 偏航
        pitch: Math.toRadians(-60), // 俯仰
        range: 3000 // 高度
      },
      duration: 0
    })
  }, [])
  return null
}
export default Init