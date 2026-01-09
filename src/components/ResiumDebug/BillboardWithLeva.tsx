import { memo, useMemo } from "react"
import { Billboard } from "resium"
import {
  Cartesian3,
  Color,
  Math as CesiumMath,
  NearFarScalar,
  DistanceDisplayCondition,
  HorizontalOrigin,
  VerticalOrigin,
  HeightReference,
} from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * BillboardWithLeva
 * - 使用 Leva 面板控制 Billboard 所有可配置的关键属性
 * - 需挂载在 BillboardCollection 组件内部
 */
const BillboardWithLeva = () => {
  const params = useLevaControls({
    name: "Billboard 控制",
    schema: {
      position: folder({
        lng: { label: "经度 lng", value: 116.395102, step: 0.00001 },
        lat: { label: "纬度 lat", value: 39.868458, step: 0.00001 },
        height: { label: "高度 height", value: 0, step: 10 },
      }),
      appearance: folder({
        image: { label: "图像 URL", value: "" },
        scale: { label: "缩放 scale", value: 1, min: 0, max: 5, step: 0.1 },
        rotation: { label: "旋转 rotation (°)", value: 0, min: 0, max: 360, step: 1 },
        show: { label: "是否显示 show", value: true },
        sizeInMeters: { label: "米为单位 sizeInMeters", value: false },
      }),
      color: folder({
        colorR: { label: "R", value: 1, min: 0, max: 1, step: 0.01 },
        colorG: { label: "G", value: 1, min: 0, max: 1, step: 0.01 },
        colorB: { label: "B", value: 1, min: 0, max: 1, step: 0.01 },
        alpha: { label: "透明度 alpha", value: 1, min: 0, max: 1, step: 0.01 },
      }),
      distance: folder({
        disableDepthTestDistance: {
          label: "深度测试距离 disableDepthTestDistance",
          value: 0,
          min: 0,
          max: 100000,
          step: 100,
        },
      }),
      transform: folder({
        eyeOffsetX: { label: "eyeOffset X", value: 0, step: 1 },
        eyeOffsetY: { label: "eyeOffset Y", value: 0, step: 1 },
        eyeOffsetZ: { label: "eyeOffset Z", value: 0, step: 1 },
      }),
      display: folder({
        horizontalOrigin: {
          label: "水平原点",
          value: "CENTER",
          options: {
            LEFT: "LEFT",
            CENTER: "CENTER",
            RIGHT: "RIGHT",
          },
        },
        verticalOrigin: {
          label: "垂直原点",
          value: "CENTER",
          options: {
            TOP: "TOP",
            CENTER: "CENTER",
            BOTTOM: "BOTTOM",
          },
        },
        heightReference: {
          label: "高度参考",
          value: "NONE",
          options: {
            NONE: "NONE",
            CLAMP_TO_GROUND: "CLAMP_TO_GROUND",
            RELATIVE_TO_GROUND: "RELATIVE_TO_GROUND",
          },
        },
      }),
    },
  })

  const position = useMemo(
    () => Cartesian3.fromDegrees(params.lng, params.lat, params.height),
    [params.lng, params.lat, params.height]
  )

  const color = useMemo(
    () => new Color(params.colorR, params.colorG, params.colorB, params.alpha),
    [params.colorR, params.colorG, params.colorB, params.alpha]
  )

  const eyeOffset = useMemo(
    () => new Cartesian3(params.eyeOffsetX, params.eyeOffsetY, params.eyeOffsetZ),
    [params.eyeOffsetX, params.eyeOffsetY, params.eyeOffsetZ]
  )

  return (
    <Billboard
      position={position}
      image={params.image}
      scale={params.scale}
      rotation={CesiumMath.toRadians(params.rotation)}
      show={params.show}
      sizeInMeters={params.sizeInMeters}
      color={color}
      disableDepthTestDistance={params.disableDepthTestDistance}
      eyeOffset={eyeOffset}
      horizontalOrigin={HorizontalOrigin[params.horizontalOrigin]}
      verticalOrigin={VerticalOrigin[params.verticalOrigin]}
      heightReference={HeightReference[params.heightReference]}
    />
  )
}

export default memo(BillboardWithLeva)
