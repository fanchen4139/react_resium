import { memo, useMemo } from "react"
import { Camera } from "resium"
import {
  Cartesian3,
  PerspectiveFrustum,
  Math as CesiumMath,
} from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * CameraWithLeva
 * - 使用 Leva 控制 Camera 组件的关键 props
 */
const CameraWithLeva = () => {
  const params = useLevaControls({
    name: "Camera 控制",
    schema: {
      position: folder({
        lng: { label: "经度", value: 116.395102, step: 0.00001 },
        lat: { label: "纬度", value: 39.868458, step: 0.00001 },
        height: { label: "高度", value: 10000, min: 0, step: 100 },
      }),

      direction: folder({
        dirX: { label: "方向 X", value: 0, step: 0.1 },
        dirY: { label: "方向 Y", value: 0, step: 0.1 },
        dirZ: { label: "方向 Z", value: -1, step: 0.1 },
      }),

      up: folder({
        upX: { label: "上方向 X", value: 0, step: 0.1 },
        upY: { label: "上方向 Y", value: 1, step: 0.1 },
        upZ: { label: "上方向 Z", value: 0, step: 0.1 },
      }),

      frustum: folder({
        fov: { label: "视角 FOV (°)", value: 45, min: 1, max: 180, step: 1 },
        near: { label: "近平面 near", value: 1, min: 0.1, step: 0.1 },
        far: { label: "远平面 far", value: 1000000, min: 1, step: 1000 },
      }),

      defaults: folder({
        defaultMoveAmount: { label: "默认移动增量", value: 1000 },
        defaultLookAmount: { label: "默认观察增量", value: 0.01 },
        defaultRotateAmount: { label: "默认旋转增量", value: 0.01 },
        defaultZoomAmount: { label: "默认缩放增量", value: 1000 },
      }),
      extra: folder({
        constrainedAxisX: { label: "约束轴 X", value: 0, step: 0.1 },
        constrainedAxisY: { label: "约束轴 Y", value: 0, step: 0.1 },
        constrainedAxisZ: { label: "约束轴 Z", value: 0, step: 0.1 },
        maximumZoomFactor: { label: "最大缩放系数", value: 10, min: 1, step: 1 },
        percentageChanged: { label: "percentageChanged", value: 0.5, min: 0, max: 1, step: 0.01 },
      }),
    },
  })

  // 位置
  const position = useMemo(
    () => Cartesian3.fromDegrees(params.lng, params.lat, params.height),
    [params.lng, params.lat, params.height]
  )

  // 方向向量
  const direction = useMemo(
    () => new Cartesian3(params.dirX, params.dirY, params.dirZ),
    [params.dirX, params.dirY, params.dirZ]
  )

  // 上方向向量
  const up = useMemo(
    () => new Cartesian3(params.upX, params.upY, params.upZ),
    [params.upX, params.upY, params.upZ]
  )

  // 视锥体
  const frustum = useMemo(() => {
    const f = new PerspectiveFrustum()
    f.fov = CesiumMath.toRadians(params.fov)
    f.near = params.near
    f.far = params.far
    return f
  }, [params.fov, params.near, params.far])

  const constrainedAxis = useMemo(
    () => new Cartesian3(params.constrainedAxisX, params.constrainedAxisY, params.constrainedAxisZ),
    [params.constrainedAxisX, params.constrainedAxisY, params.constrainedAxisZ]
  )

  return (
    <Camera
      position={position}
      direction={direction}
      up={up}
      frustum={frustum}
      defaultMoveAmount={params.defaultMoveAmount}
      defaultLookAmount={params.defaultLookAmount}
      defaultRotateAmount={params.defaultRotateAmount}
      defaultZoomAmount={params.defaultZoomAmount}
      constrainedAxis={constrainedAxis}
      maximumZoomFactor={params.maximumZoomFactor}
      percentageChanged={params.percentageChanged}
      onChange={(pct) => console.log("Camera changed:", pct)}
      onMoveStart={() => console.log("Move start")}
      onMoveEnd={() => console.log("Move end")}
    />
  )
}

export default memo(CameraWithLeva)
