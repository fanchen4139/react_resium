import { memo, useMemo, useCallback } from "react"
import { CameraFlyTo, type CameraFlyToProps } from "resium"
import { Cartesian3, Math as CesiumMath, Matrix4, Rectangle } from "cesium"
import { folder } from "leva"
import useLevaControls from "@/hooks/useLevaControls"

/**
 * CameraFlyToWithLeva
 * - 将 CameraFlyTo 封装
 * - Leva 控制所有支持的属性
 */
type CameraFlyToWithLevaProps = Omit<
  CameraFlyToProps,
  "destination" | "orientation" | "duration" | "maximumHeight" | "pitchAdjustHeight" | "flyOverLongitude" | "flyOverLongitudeWeight" | "convert" | "endTransform" | "cancelFlightOnUnmount" | "once" | "easingFunction"
> & {
  easingFunction?: CameraFlyToProps["easingFunction"]
}

const CameraFlyToWithLeva = ({
  easingFunction: easingFunctionProp,
  ...props
}: CameraFlyToWithLevaProps) => {
  const params = useLevaControls({
    name: "CameraFlyTo 控制",
    schema: {
      destination: folder({
        destinationType: {
          label: "destination 类型",
          value: "cartesian",
          options: {
            cartesian: "cartesian",
            rectangle: "rectangle",
          },
        },
        lng: { label: "经度 lng", value: 116.395102, step: 0.00001 },
        lat: { label: "纬度 lat", value: 39.868458, step: 0.00001 },
        height: { label: "高度 height", value: 10000, min: 0, max: 50000, step: 100 },
        west: { label: "west【西】", value: 115, step: 0.00001 },
        south: { label: "south【南】", value: 38, step: 0.00001 },
        east: { label: "east【东】", value: 117, step: 0.00001 },
        north: { label: "north【北】", value: 40, step: 0.00001 },
      }),
      orientation: folder({
        heading: { label: "偏航 heading (°)", value: 0, min: -180, max: 180, step: 1 },
        pitch: { label: "俯仰 pitch (°)", value: -45, min: -90, max: 90, step: 1 },
        roll: { label: "滚转 roll (°)", value: 0, min: -180, max: 180, step: 1 },
      }),
      flight: folder({
        duration: { label: "飞行时长 duration (s)", value: 5, min: 0, max: 20, step: 0.1 },
        maximumHeight: { label: "最大高度 maximumHeight", value: 0, min: 0, max: 50000, step: 100 },
        pitchAdjustHeight: { label: "pitchAdjustHeight【俯仰调整高度】", value: 0, min: 0, max: 50000, step: 100 },
        flyOverLongitude: { label: "flyOverLongitude【跨越经度】", value: 0, min: -180, max: 180, step: 1 },
        flyOverLongitudeWeight: { label: "flyOverLongitudeWeight【跨越经度权重】", value: 0.5, min: 0, max: 1, step: 0.01 },
        convert: { label: "convert【转换】", value: false },
        useEndTransform: { label: "endTransform【结束变换】", value: false },
        endTransformX: { label: "endTransform X【结束变换 X】", value: 0, step: 1 },
        endTransformY: { label: "endTransform Y【结束变换 Y】", value: 0, step: 1 },
        endTransformZ: { label: "endTransform Z【结束变换 Z】", value: 0, step: 1 },
        cancelFlightOnUnmount: { label: "Cancel On Unmount【卸载取消】", value: false },
        once: { label: "只执行一次 once", value: false },
      }),
    },
  })

  // 计算 destination (Cartesian3)
  const destination = useMemo(() => {
    if (params.destinationType === "rectangle") {
      return Rectangle.fromDegrees(params.west, params.south, params.east, params.north)
    }
    return Cartesian3.fromDegrees(params.lng, params.lat, params.height)
  }, [params.destinationType, params.west, params.south, params.east, params.north, params.lng, params.lat, params.height])

  // 计算 orientation
  const orientation = useMemo(() => ({
    heading: CesiumMath.toRadians(params.heading),
    pitch: CesiumMath.toRadians(params.pitch),
    roll: CesiumMath.toRadians(params.roll),
  }), [params.heading, params.pitch, params.roll])

  const endTransform = useMemo(() => {
    if (!params.useEndTransform) return undefined
    return Matrix4.fromTranslation(new Cartesian3(params.endTransformX, params.endTransformY, params.endTransformZ))
  }, [params.useEndTransform, params.endTransformX, params.endTransformY, params.endTransformZ])

  // easingFunction 示例：线性缓动
  const defaultEasingFunction = useCallback(
    (t: number) => t,
    []
  )

  return (
    <CameraFlyTo
      {...props}
      destination={destination}
      orientation={orientation}
      duration={params.duration}
      maximumHeight={params.maximumHeight || undefined}
      pitchAdjustHeight={params.pitchAdjustHeight || undefined}
      flyOverLongitude={params.flyOverLongitude || undefined}
      flyOverLongitudeWeight={params.flyOverLongitudeWeight}
      convert={params.convert}
      endTransform={endTransform}
      easingFunction={easingFunctionProp ?? defaultEasingFunction}
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
