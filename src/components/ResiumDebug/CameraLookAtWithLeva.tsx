import { memo, useMemo } from "react"
import { CameraLookAt, type CameraLookAtProps } from "resium"
import {
  Cartesian3,
  Math as CesiumMath,
  HeadingPitchRange,
} from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * CameraLookAtWithLeva
 * - 使用 Leva 控制 CameraLookAt
 * - 需要处于 <Viewer> 或 <CesiumWidget> 内
 */
type CameraLookAtWithLevaProps = Omit<
  CameraLookAtProps,
  "target" | "offset"
>

const CameraLookAtWithLeva = ({ ...props }: CameraLookAtWithLevaProps) => {
  const params = useLevaControls({
    name: "CameraLookAt 控制",
    schema: {
      // 观察目标位置
      target: folder({
        lng: { label: "target 经度", value: 116.395102, step: 0.00001 },
        lat: { label: "target 纬度", value: 39.868458, step: 0.00001 },
        height: { label: "target 高度", value: 0, step: 100 },
      }),
      // 偏移类型与相关参数
      offsetType: {
        label: "偏移类型",
        value: "Cartesian3",
        options: {
          Cartesian3: "Cartesian3",
          HeadingPitchRange: "HeadingPitchRange",
        },
      },
      cartesianOffset: folder({
        x: { label: "offset X【偏移 X】", value: 0, step: 1 },
        y: { label: "offset Y【偏移 Y】", value: 0, step: 1 },
        z: { label: "offset Z【偏移 Z】", value: -10000, step: 100 },
      }),
      hprOffset: folder({
        heading: { label: "偏航（°）", value: 0, min: -180, max: 180, step: 1 },
        pitch: { label: "俯仰（°）", value: -45, min: -90, max: 90, step: 1 },
        range: { label: "距离 range", value: 10000, min: 0, step: 100 },
      }),
    },
  })

  // target 位置
  const target = useMemo(
    () => Cartesian3.fromDegrees(params.lng, params.lat, params.height),
    [params.lng, params.lat, params.height]
  )

  // 偏移量（使用 Cartesian3）
  const cartesianOffset = useMemo(
    () => new Cartesian3(params.x, params.y, params.z),
    [params.x, params.y, params.z]
  )

  // 偏移量（使用 HeadingPitchRange）
  const hprOffset = useMemo(
    () =>
      new HeadingPitchRange(
        CesiumMath.toRadians(params.heading),
        CesiumMath.toRadians(params.pitch),
        params.range
      ),
    [params.heading, params.pitch, params.range]
  )

  const offset =
    params.offsetType === "Cartesian3" ? cartesianOffset : hprOffset

  return (
    <CameraLookAt
      {...props}
      target={target}
      offset={offset}
    />
  )
}

export default memo(CameraLookAtWithLeva)
