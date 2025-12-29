import { memo, useMemo } from "react"
import { CameraFlyTo } from "resium"
import { Cartesian3, Math as CesiumMath } from "cesium"
import { folder } from "leva"
import useLevaControls from "@/hooks/useLevaControls"

type CameraFlyToWithLevaProps = {
  enableDebug?: boolean
}

const CameraFlyToWithLeva = ({ enableDebug = false }: CameraFlyToWithLevaProps) => {
  // 相机调试参数
  const cameraParams = useLevaControls(
    {
      name: "Scene",
      schema: {
        camera: folder({
          distinate: folder({
            lng: {
              label: "lng【经度】",
              value: 116.395102,
              step: 0.00001,
            },
            lat: {
              label: "lat【纬度】",
              value: 39.868458,
              step: 0.00001,
            },
          }),
          orientation: folder({
            heading: {
              label: "heading【偏航(度)】",
              value: -1,
              step: 1,
            },
            pitch: {
              label: "pitch【俯仰(度)】",
              value: -60,
              step: 1,
            },
          }),
        }),
      },
    },
  )

  // CameraFlyTo 需要的参数
  const destination = useMemo(
    () => Cartesian3.fromDegrees(cameraParams.lng, cameraParams.lat, 8000),
    [cameraParams.lng, cameraParams.lat],
  )

  const orientation = useMemo(
    () => ({
      heading: CesiumMath.toRadians(cameraParams.heading), // 偏航（转弧度）
      pitch: CesiumMath.toRadians(cameraParams.pitch), // 俯仰（转弧度）
      range: 3000, // 高度
    }),
    [cameraParams.heading, cameraParams.pitch],
  )

  return (
    <CameraFlyTo
      destination={destination}
      orientation={orientation}
      duration={0}
      once
    />
  )
}

export default memo(CameraFlyToWithLeva)


