import { memo } from "react"
import { ScreenSpaceCameraController } from "resium"
import { CameraEventType } from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * ScreenSpaceCameraControllerWithLeva
 * - 用 Leva 控制 ScreenSpaceCameraController 属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const ScreenSpaceCameraControllerWithLeva = () => {
  const params = useLevaControls({
    name: "ScreenSpaceCameraController 控制",
    schema: {
      enable: folder(
        {
          enableInputs: { label: "启用输入 enableInputs", value: true },
          enableRotate: { label: "旋转 enableRotate", value: true },
          enableTilt: { label: "倾斜 enableTilt", value: true },
          enableZoom: { label: "缩放 enableZoom", value: true },
          enableTranslate: { label: "平移 enableTranslate", value: true },
          enableLook: { label: "视角 enableLook", value: true },
          enableCollisionDetection: {
            label: "碰撞检测",
            value: true,
          },
        },
        { collapsed: false }
      ),

      events: folder(
        {
          rotateEventType: {
            label: "旋转事件",
            options: CameraEventType,
            value: CameraEventType.LEFT_DRAG,
          },
          tiltEventType: {
            label: "倾斜事件",
            options: CameraEventType,
            value: CameraEventType.RIGHT_DRAG,
          },
          zoomEventType: {
            label: "缩放事件",
            options: CameraEventType,
            value: CameraEventType.WHEEL,
          },
          translateEventType: {
            label: "平移事件",
            options: CameraEventType,
            value: CameraEventType.MIDDLE_DRAG,
          },
          lookEventType: {
            label: "视角事件",
            options: CameraEventType,
            value: CameraEventType.LEFT_DRAG,
          },
        },
        { collapsed: false }
      ),

      inertia: folder(
        {
          inertiaSpin: {
            label: "旋转惯性 inertiaSpin",
            value: 0.9,
            min: 0,
            max: 1,
            step: 0.01,
          },
          inertiaTranslate: {
            label: "平移惯性 inertiaTranslate",
            value: 0.9,
            min: 0,
            max: 1,
            step: 0.01,
          },
          inertiaZoom: {
            label: "缩放惯性 inertiaZoom",
            value: 0.8,
            min: 0,
            max: 1,
            step: 0.01,
          },
          bounceAnimationTime: {
            label: "回弹时间 bounceAnimationTime",
            value: 3,
            min: 0,
            step: 0.1,
          },
        },
        { collapsed: true }
      ),

      limits: folder(
        {
          minimumZoomDistance: {
            label: "最小缩放距离",
            value: 1,
            min: 0,
            step: 1,
          },
          maximumZoomDistance: {
            label: "最大缩放距离",
            value: 100000000,
            min: 0,
            step: 1000,
          },
          minimumCollisionTerrainHeight: {
            label: "最小碰撞地形高度",
            value: 15000,
            min: 0,
            step: 100,
          },
          minimumPickingTerrainHeight: {
            label: "最小拾取地形高度",
            value: 15000,
            min: 0,
            step: 100,
          },
          minimumTrackBallHeight: {
            label: "最小轨迹球高度",
            value: 7500000,
            min: 0,
            step: 1000,
          },
          minimumPickingTerrainDistanceWithInertia: {
            label: "惯性拾取距离",
            value: 15000,
            min: 0,
            step: 100,
          },
          maximumTiltAngle: {
            label: "最大倾斜角 maximumTiltAngle",
            value: Math.PI / 2,
            min: 0,
            max: Math.PI / 2,
            step: Math.PI / 180,
          },
          maximumMovementRatio: {
            label: "最大移动比 maximumMovementRatio",
            value: 0.1,
            min: 0,
            max: 1,
            step: 0.01,
          },
          zoomFactor: {
            label: "缩放因子 zoomFactor",
            value: 5,
            min: 0.1,
            step: 0.1,
          },
        },
        { collapsed: true }
      ),
    },
  })

  return (
    <ScreenSpaceCameraController
      enableInputs={params.enableInputs}
      enableRotate={params.enableRotate}
      enableTilt={params.enableTilt}
      enableZoom={params.enableZoom}
      enableTranslate={params.enableTranslate}
      enableLook={params.enableLook}
      enableCollisionDetection={params.enableCollisionDetection}
      rotateEventTypes={params.rotateEventType as CameraEventType}
      tiltEventTypes={params.tiltEventType as CameraEventType}
      zoomEventTypes={params.zoomEventType as CameraEventType}
      translateEventTypes={params.translateEventType as CameraEventType}
      lookEventTypes={params.lookEventType as CameraEventType}
      inertiaSpin={params.inertiaSpin}
      inertiaTranslate={params.inertiaTranslate}
      inertiaZoom={params.inertiaZoom}
      bounceAnimationTime={params.bounceAnimationTime}
      minimumZoomDistance={params.minimumZoomDistance}
      maximumZoomDistance={params.maximumZoomDistance}
      minimumCollisionTerrainHeight={params.minimumCollisionTerrainHeight}
      minimumPickingTerrainHeight={params.minimumPickingTerrainHeight}
      minimumTrackBallHeight={params.minimumTrackBallHeight}
      minimumPickingTerrainDistanceWithInertia={
        params.minimumPickingTerrainDistanceWithInertia
      }
      maximumTiltAngle={params.maximumTiltAngle}
      maximumMovementRatio={params.maximumMovementRatio}
      zoomFactor={params.zoomFactor}
    />
  )
}

export default memo(ScreenSpaceCameraControllerWithLeva)
