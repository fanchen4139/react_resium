import { memo, useMemo, useCallback } from "react"
import { CameraFlyTo } from "resium"
import { Cartesian3, Rectangle, Math as CesiumMath } from "cesium"
import { folder } from "leva"
import useLevaControls from "@/hooks/useLevaControls"

/**
 * CameraFlyToWithLeva
 * - 将 CameraFlyTo 封装
 * - Leva 控制所有支持的属性
 */
const CameraFlyToWithLeva = () => {
  const params = useLevaControls({
    name: "CameraFlyTo 控制",
    schema: {
      destination: folder({
        lng: { label: "经度 lng", value: 116.395102, step: 0.00001 },
        lat: { label: "纬度 lat", value: 39.868458, step: 0.00001 },
        height: { label: "高度 height", value: 10000, min: 0, max: 50000, step: 100 },
      }),
      orientation: folder({
        heading: { label: "偏航 heading (°)", value: 0, min: -180, max: 180, step: 1 },
        pitch: { label: "俯仰 pitch (°)", value: -45, min: -90, max: 90, step: 1 },
        roll: { label: "滚转 roll (°)", value: 0, min: -180, max: 180, step: 1 },
        range: { label: "视距 range", value: 0, min: 0, max: 10000, step: 100 },
      }),
      flight: folder({
        duration: { label: "飞行时长 duration (s)", value: 5, min: 0, max: 20, step: 0.1 },
        maximumHeight: { label: "最大高度 maximumHeight", value: 0, min: 0, max: 50000, step: 100 },
        pitchAdjustHeight: { label: "pitchAdjustHeight", value: 0, min: 0, max: 50000, step: 100 },
        flyOverLongitude: { label: "flyOverLongitude", value: 0, min: -180, max: 180, step: 1 },
        flyOverLongitudeWeight: { label: "flyOverLongitudeWeight", value: 0.5, min: 0, max: 1, step: 0.01 },
        convert: { label: "convert", value: false },
        cancelFlightOnUnmount: { label: "Cancel On Unmount", value: false },
        once: { label: "只执行一次 once", value: false },
      }),
    },
  })

  // 计算 destination (Cartesian3)
  const destination = useMemo(() => {
    return Cartesian3.fromDegrees(params.lng, params.lat, params.height)
  }, [params.lng, params.lat, params.height])

  // 计算 orientation
  const orientation = useMemo(() => ({
    heading: CesiumMath.toRadians(params.heading),
    pitch: CesiumMath.toRadians(params.pitch),
    roll: CesiumMath.toRadians(params.roll),
    range: params.range > 0 ? params.range : undefined, // range 可选
  }), [params.heading, params.pitch, params.roll, params.range])

  // easingFunction 示例：线性缓动
  const easingFunction = useCallback(
    (t: number) => t,
    []
  )

  return (
    <CameraFlyTo
      destination={destination}
      orientation={orientation}
      duration={params.duration}
      maximumHeight={params.maximumHeight || undefined}
      pitchAdjustHeight={params.pitchAdjustHeight || undefined}
      flyOverLongitude={params.flyOverLongitude || undefined}
      flyOverLongitudeWeight={params.flyOverLongitudeWeight}
      convert={params.convert}
      easingFunction={easingFunction}
      cancelFlightOnUnmount={params.cancelFlightOnUnmount}
      once={params.once}
      onComplete={() => {
        console.log("飞行完成")
      }}
      onCancel={() => {
        console.log("飞行取消")
      }}
    />
  )
}

export default memo(CameraFlyToWithLeva)
