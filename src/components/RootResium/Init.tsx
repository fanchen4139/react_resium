import { useEffect } from "react"
import useCesium from "../../hooks/useCesium"
import { Cartesian3, Math, ScreenSpaceEventType } from "cesium"

const Init = () => {

  const viewer = useCesium()

  useEffect(() => {
    // 禁用双击追踪 Entity
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    // 启用抗锯齿
    viewer.scene.postProcessStages.fxaa.enabled = true

    // 初始化视角
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(116.395102, 39.828458, 15000),
      orientation: {
        heading: Math.toRadians(-1), // 偏航
        pitch: Math.toRadians(-60), // 俯仰
        // range: 300000 // 高度
      },
      duration: 0
    })
  }, [])

  return null
}
export default Init