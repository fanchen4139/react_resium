import { memo, useMemo } from "react"
import { Billboard, type BillboardProps } from "resium"
import {
  Cartesian2,
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  HorizontalOrigin,
  HeightReference,
  Math as CesiumMath,
  NearFarScalar,
  VerticalOrigin,
} from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * BillboardWithLeva
 * - 使用 Leva 面板控制 Billboard 所有可配置的关键属性
 * - 需挂载在 BillboardCollection 组件内部
 */
type BillboardWithLevaProps = Omit<
  BillboardProps,
  "position" | "image" | "scale" | "rotation" | "show" | "sizeInMeters" | "color" | "disableDepthTestDistance" | "eyeOffset" | "pixelOffset" | "alignedAxis" | "horizontalOrigin" | "verticalOrigin" | "heightReference" | "distanceDisplayCondition" | "scaleByDistance" | "translucencyByDistance" | "pixelOffsetScaleByDistance" | "width" | "height"
>

const BillboardWithLeva = ({ ...props }: BillboardWithLevaProps) => {
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
        width: { label: "width【宽度】", value: 0, min: 0, step: 1 },
        height: { label: "height【高度】", value: 0, min: 0, step: 1 },
      }),
      color: folder({
        colorR: { label: "R【红】", value: 1, min: 0, max: 1, step: 0.01 },
        colorG: { label: "G【绿】", value: 1, min: 0, max: 1, step: 0.01 },
        colorB: { label: "B【蓝】", value: 1, min: 0, max: 1, step: 0.01 },
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
        distanceNear: { label: "distance near【近距离】", value: 0, min: 0, step: 100 },
        distanceFar: { label: "distance far【远距离】", value: 100000, min: 0, step: 100 },
      }),
      transform: folder({
        eyeOffsetX: { label: "eyeOffset X【视线偏移 X】", value: 0, step: 1 },
        eyeOffsetY: { label: "eyeOffset Y【视线偏移 Y】", value: 0, step: 1 },
        eyeOffsetZ: { label: "eyeOffset Z【视线偏移 Z】", value: 0, step: 1 },
        pixelOffsetX: { label: "pixelOffset X【像素偏移 X】", value: 0, step: 1 },
        pixelOffsetY: { label: "pixelOffset Y【像素偏移 Y】", value: 0, step: 1 },
        alignedAxisX: { label: "alignedAxis X【对齐轴 X】", value: 0, step: 0.1 },
        alignedAxisY: { label: "alignedAxis Y【对齐轴 Y】", value: 0, step: 0.1 },
        alignedAxisZ: { label: "alignedAxis Z【对齐轴 Z】", value: 0, step: 0.1 },
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
      distanceEffects: folder({
        scaleByDistanceNear: { label: "scaleByDistance near【按距离缩放近】", value: 0 },
        scaleByDistanceNearValue: { label: "scaleByDistance near value【按距离缩放近值】", value: 1, min: 0, max: 5, step: 0.1 },
        scaleByDistanceFar: { label: "scaleByDistance far【按距离缩放远】", value: 100000 },
        scaleByDistanceFarValue: { label: "scaleByDistance far value【按距离缩放远值】", value: 0.5, min: 0, max: 5, step: 0.1 },
        translucencyNear: { label: "translucency near【透明度近】", value: 0 },
        translucencyNearValue: { label: "translucency near value【透明度近值】", value: 1, min: 0, max: 1, step: 0.1 },
        translucencyFar: { label: "translucency far【透明度远】", value: 100000 },
        translucencyFarValue: { label: "translucency far value【透明度远值】", value: 0, min: 0, max: 1, step: 0.1 },
        pixelOffsetScaleNear: { label: "pixelOffsetScale near【像素偏移缩放近】", value: 0 },
        pixelOffsetScaleNearValue: { label: "pixelOffsetScale near value【像素偏移缩放近值】", value: 1, min: 0, max: 2, step: 0.1 },
        pixelOffsetScaleFar: { label: "pixelOffsetScale far【像素偏移缩放远】", value: 100000 },
        pixelOffsetScaleFarValue: { label: "pixelOffsetScale far value【像素偏移缩放远值】", value: 0.5, min: 0, max: 2, step: 0.1 },
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

  const pixelOffset = useMemo(
    () => new Cartesian2(params.pixelOffsetX, params.pixelOffsetY),
    [params.pixelOffsetX, params.pixelOffsetY]
  )

  const alignedAxis = useMemo(
    () => new Cartesian3(params.alignedAxisX, params.alignedAxisY, params.alignedAxisZ),
    [params.alignedAxisX, params.alignedAxisY, params.alignedAxisZ]
  )

  const distanceDisplayCondition = useMemo(
    () => new DistanceDisplayCondition(params.distanceNear, params.distanceFar),
    [params.distanceNear, params.distanceFar]
  )

  const scaleByDistance = useMemo(
    () =>
      new NearFarScalar(
        params.scaleByDistanceNear,
        params.scaleByDistanceNearValue,
        params.scaleByDistanceFar,
        params.scaleByDistanceFarValue
      ),
    [
      params.scaleByDistanceNear,
      params.scaleByDistanceNearValue,
      params.scaleByDistanceFar,
      params.scaleByDistanceFarValue,
    ]
  )

  const translucencyByDistance = useMemo(
    () =>
      new NearFarScalar(
        params.translucencyNear,
        params.translucencyNearValue,
        params.translucencyFar,
        params.translucencyFarValue
      ),
    [
      params.translucencyNear,
      params.translucencyNearValue,
      params.translucencyFar,
      params.translucencyFarValue,
    ]
  )

  const pixelOffsetScaleByDistance = useMemo(
    () =>
      new NearFarScalar(
        params.pixelOffsetScaleNear,
        params.pixelOffsetScaleNearValue,
        params.pixelOffsetScaleFar,
        params.pixelOffsetScaleFarValue
      ),
    [
      params.pixelOffsetScaleNear,
      params.pixelOffsetScaleNearValue,
      params.pixelOffsetScaleFar,
      params.pixelOffsetScaleFarValue,
    ]
  )

  return (
    <Billboard
      {...props}
      position={position}
      image={params.image}
      scale={params.scale}
      rotation={CesiumMath.toRadians(params.rotation)}
      show={params.show}
      sizeInMeters={params.sizeInMeters}
      width={params.width || undefined}
      height={params.height || undefined}
      color={color}
      disableDepthTestDistance={params.disableDepthTestDistance}
      eyeOffset={eyeOffset}
      pixelOffset={pixelOffset}
      alignedAxis={alignedAxis}
      distanceDisplayCondition={distanceDisplayCondition}
      scaleByDistance={scaleByDistance}
      translucencyByDistance={translucencyByDistance}
      pixelOffsetScaleByDistance={pixelOffsetScaleByDistance}
      horizontalOrigin={HorizontalOrigin[params.horizontalOrigin]}
      verticalOrigin={VerticalOrigin[params.verticalOrigin]}
      heightReference={HeightReference[params.heightReference]}
    />
  )
}

export default memo(BillboardWithLeva)
