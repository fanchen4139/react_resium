import { memo } from "react"
import { CameraFlyHome } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * CameraFlyHomeWithLeva
 * - 使用 Leva 控制 CameraFlyHome 的属性
 * - 该组件一旦挂载，会触发 camera.flyHome(duration)
 * - inside Viewer/CesiumWidget 组件内部使用
 */
const CameraFlyHomeWithLeva = () => {
  const params = useLevaControls({
    name: "CameraFlyHome 控制",
    schema: {
      fly: folder({
        duration: {
          label: "飞行时长 duration (秒)",
          value: 3,
          min: 0,
          max: 10,
          step: 0.1,
        },
        once: {
          label: "是否只执行一次 once",
          value: true,
        },
        cancelFlightOnUnmount: {
          label: "组件卸载时取消飞行",
          value: false,
        },
      }),
    },
  })

  return (
    <CameraFlyHome
      duration={params.duration}
      once={params.once}
      cancelFlightOnUnmount={params.cancelFlightOnUnmount}
    />
  )
}

export default memo(CameraFlyHomeWithLeva)
