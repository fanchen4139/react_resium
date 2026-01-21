import { memo, useMemo } from "react"
import { Camera, type CameraProps } from "resium"
import {
  Cartesian3,
  PerspectiveFrustum,
  Math as CesiumMath,
} from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"
import useCesium from "@/hooks/useCesium"

/**
 * CameraWithLeva
 * - 使用 Leva 控制 Camera 组件的关键 props
 */
type CameraWithLevaProps = Omit<
  CameraProps,
  "position" | "direction" | "up" | "right" | "frustum" | "defaultMoveAmount" | "defaultLookAmount" | "defaultRotateAmount" | "defaultZoomAmount" | "constrainedAxis" | "maximumZoomFactor" | "percentageChanged"
>

const CameraWithLeva = ({
  ...props
}: CameraWithLevaProps) => {
  const { scene } = useCesium()
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
      right: folder({
        rightX: { label: "右方向 X", value: 1, step: 0.1 },
        rightY: { label: "右方向 Y", value: 0, step: 0.1 },
        rightZ: { label: "右方向 Z", value: 0, step: 0.1 },
      }),

      frustum: folder({
        fov: { label: "视角 FOV (°)", value: 45, min: 1, max: 180, step: 1 },
        near: { label: "近平面 near", value: 1, min: 0.1, step: 0.1 },
        far: { label: "远平面 far", value: Math.pow(10, 8), min: 1, step: 1000 },
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
        percentageChanged: { label: "percentageChanged【变化百分比】", value: 0.5, min: 0, max: 1, step: 0.01 },
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
    const width = scene?.drawingBufferWidth ?? scene?.canvas?.clientWidth ?? 1
    const height = scene?.drawingBufferHeight ?? scene?.canvas?.clientHeight ?? 1
    const f = new PerspectiveFrustum()
    f.fov = CesiumMath.toRadians(params.fov)
    f.aspectRatio = height === 0 ? 1 : width / height
    f.near = params.near
    f.far = params.far
    return f
  }, [params.fov, params.near, params.far, scene])

  const constrainedAxis = useMemo(() => {
    const axis = new Cartesian3(
      params.constrainedAxisX,
      params.constrainedAxisY,
      params.constrainedAxisZ
    )
    return Cartesian3.magnitude(axis) > 0 ? axis : undefined
  }, [params.constrainedAxisX, params.constrainedAxisY, params.constrainedAxisZ])

  const right = useMemo(
    () => new Cartesian3(params.rightX, params.rightY, params.rightZ),
    [params.rightX, params.rightY, params.rightZ]
  )

  return (
    <Camera
      {...props}
      position={position}
      direction={direction}
      up={up}
      right={right}
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
