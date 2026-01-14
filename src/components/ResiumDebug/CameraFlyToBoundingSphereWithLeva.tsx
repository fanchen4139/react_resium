import { memo, useMemo, useCallback } from "react"
import { CameraFlyToBoundingSphere, type CameraFlyToBoundingSphereProps } from "resium"
import {
  BoundingSphere,
  Cartesian3,
  HeadingPitchRange,
  Math as CesiumMath,
  Matrix4,
} from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * CameraFlyToBoundingSphereWithLeva
 * - 支持 Leva 面板控制绑定球体视角飞行
 * - 需要位于 <Viewer> 或 <CesiumWidget> 内
 */
type CameraFlyToBoundingSphereWithLevaProps = Omit<
  CameraFlyToBoundingSphereProps,
  "boundingSphere" | "offset" | "duration" | "maximumHeight" | "pitchAdjustHeight" | "flyOverLongitude" | "flyOverLongitudeWeight" | "endTransform" | "cancelFlightOnUnmount" | "once" | "easingFunction"
> & {
  easingFunction?: CameraFlyToBoundingSphereProps["easingFunction"]
}

const CameraFlyToBoundingSphereWithLeva = ({
  easingFunction: easingFunctionProp,
  ...props
}: CameraFlyToBoundingSphereWithLevaProps) => {
  const params = useLevaControls({
    name: "CameraFlyToBoundingSphere 控制",
    schema: {
      // 目标球体
      boundingSphere: folder({
        centerLng: { label: "中心经度", value: 116, step: 0.00001 },
        centerLat: { label: "中心纬度", value: 39, step: 0.00001 },
        centerHeight: { label: "中心高度", value: 0, step: 100 },
        radius: { label: "球体半径", value: 5000, min: 0, step: 100 },
      }),

      // 视角偏移
      offset: folder({
        heading: { label: "偏航(°)", value: 0, step: 1 },
        pitch: { label: "俯仰(°)", value: -45, step: 1 },
        range: { label: "范围 range", value: 10000, min: 0, step: 100 },
      }),

      flight: folder({
        duration: {
          label: "飞行时长 duration (秒)",
          value: 3,
          min: 0,
          max: 10,
          step: 0.1,
        },
        maximumHeight: {
          label: "最大高度 maximumHeight",
          value: 0,
          min: 0,
          step: 100,
        },
        pitchAdjustHeight: {
          label: "俯仰调整高度",
          value: 0,
          min: 0,
          step: 100,
        },
        flyOverLongitude: {
          label: "跨越经度 flyOverLongitude",
          value: 0,
          min: -180,
          max: 180,
          step: 1,
        },
        flyOverLongitudeWeight: {
          label: "跨越经度权重",
          value: 0.5,
          min: 0,
          max: 1,
          step: 0.01,
        },
        useEndTransform: { label: "endTransform【结束变换】", value: false },
        endTransformX: { label: "endTransform X【结束变换 X】", value: 0, step: 1 },
        endTransformY: { label: "endTransform Y【结束变换 Y】", value: 0, step: 1 },
        endTransformZ: { label: "endTransform Z【结束变换 Z】", value: 0, step: 1 },
        once: { label: "只执行一次 once", value: true },
        cancelFlightOnUnmount: {
          label: "卸载时取消飞行",
          value: false,
        },
      }),
    },
  })

  // 计算 BoundingSphere 对象
  const boundingSphere = useMemo(
    () =>
      new BoundingSphere(
        Cartesian3.fromDegrees(
          params.centerLng,
          params.centerLat,
          params.centerHeight
        ),
        params.radius
      ),
    [
      params.centerLng,
      params.centerLat,
      params.centerHeight,
      params.radius,
    ]
  )

  // 计算偏移 HeadingPitchRange
  const offset = useMemo(
    () =>
      new HeadingPitchRange(
        CesiumMath.toRadians(params.heading),
        CesiumMath.toRadians(params.pitch),
        params.range
      ),
    [params.heading, params.pitch, params.range]
  )

  const endTransform = useMemo(() => {
    if (!params.useEndTransform) return undefined
    return Matrix4.fromTranslation(new Cartesian3(params.endTransformX, params.endTransformY, params.endTransformZ))
  }, [params.useEndTransform, params.endTransformX, params.endTransformY, params.endTransformZ])

  // easingFunction 采用线性作为示例
  const defaultEasingFunction = useCallback((t: number) => t, [])

  return (
    <CameraFlyToBoundingSphere
      {...props}
      boundingSphere={boundingSphere}
      offset={offset}
      duration={params.duration}
      maximumHeight={
        params.maximumHeight > 0 ? params.maximumHeight : undefined
      }
      pitchAdjustHeight={
        params.pitchAdjustHeight > 0 ? params.pitchAdjustHeight : undefined
      }
      flyOverLongitude={params.flyOverLongitude}
      flyOverLongitudeWeight={params.flyOverLongitudeWeight}
      endTransform={endTransform}
      easingFunction={easingFunctionProp ?? defaultEasingFunction}
      once={params.once}
      cancelFlightOnUnmount={params.cancelFlightOnUnmount}
      onComplete={() => {
        console.log("飞行完成 ❇️")
      }}
      onCancel={() => {
        console.log("飞行取消 ❌")
      }}
    />
  )
}

export default memo(CameraFlyToBoundingSphereWithLeva)
