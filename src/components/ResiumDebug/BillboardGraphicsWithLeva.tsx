import { memo, useMemo } from "react"
import { BillboardGraphics, type BillboardGraphicsProps } from "resium"
import {
  Cartesian3,
  Cartesian2,
  Color,
  NearFarScalar,
  DistanceDisplayCondition,
  HeightReference,
  HorizontalOrigin,
  VerticalOrigin,
  BoundingRectangle,
  Math as CesiumMath,
} from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * BillboardGraphicsWithLeva
 * - 使用 Leva 控制 BillboardGraphics 的所有属性
 * - 需挂载在 Entity 组件内部
 */
type BillboardGraphicsWithLevaProps = Omit<
  BillboardGraphicsProps,
  "show" | "image" | "scale" | "rotation" | "horizontalOrigin" | "verticalOrigin" | "eyeOffset" | "pixelOffset" | "color" | "width" | "height" | "sizeInMeters" | "distanceDisplayCondition" | "disableDepthTestDistance" | "scaleByDistance" | "translucencyByDistance" | "pixelOffsetScaleByDistance" | "imageSubRegion" | "heightReference"
>

const BillboardGraphicsWithLeva = ({ ...props }: BillboardGraphicsWithLevaProps) => {
  const params = useLevaControls({
    name: "BillboardGraphics 控制",
    schema: {
      appearance: folder({
        show: { label: "显示 show", value: true },
        image: { label: "图像 image", value: "" },
        scale: { label: "缩放 scale", value: 1, min: 0.1, max: 5, step: 0.1 },
        rotation: { label: "旋转 rotation (°)", value: 0, min: 0, max: 360, step: 1 },
        sizeInMeters: { label: "尺寸以米 sizeInMeters", value: false },
      }),
      origin: folder({
        horizontalOrigin: {
          label: "水平原点 horizontalOrigin",
          value: "CENTER",
          options: {
            LEFT: "LEFT",
            CENTER: "CENTER",
            RIGHT: "RIGHT",
          },
        },
        verticalOrigin: {
          label: "垂直原点 verticalOrigin",
          value: "CENTER",
          options: {
            TOP: "TOP",
            CENTER: "CENTER",
            BOTTOM: "BOTTOM",
          },
        },
        heightReference: {
          label: "高度参考 heightReference",
          value: "NONE",
          options: {
            NONE: "NONE",
            CLAMP_TO_GROUND: "CLAMP_TO_GROUND",
            RELATIVE_TO_GROUND: "RELATIVE_TO_GROUND",
          },
        },
      }),
      offset: folder({
        eyeOffsetX: { label: "eyeOffset X【视线偏移 X】", value: 0, step: 1 },
        eyeOffsetY: { label: "eyeOffset Y【视线偏移 Y】", value: 0, step: 1 },
        eyeOffsetZ: { label: "eyeOffset Z【视线偏移 Z】", value: 0, step: 1 },
        pixelOffsetX: { label: "pixelOffset X【像素偏移 X】", value: 0, step: 1 },
        pixelOffsetY: { label: "pixelOffset Y【像素偏移 Y】", value: 0, step: 1 },
      }),
      size: folder({
        width: { label: "覆盖宽度 width", value: 0, min: 0, step: 1 },
        height: { label: "覆盖高度 height", value: 0, min: 0, step: 1 },
      }),
      color: folder({
        colorR: { label: "R【红】", value: 1, min: 0, max: 1, step: 0.01 },
        colorG: { label: "G【绿】", value: 1, min: 0, max: 1, step: 0.01 },
        colorB: { label: "B【蓝】", value: 1, min: 0, max: 1, step: 0.01 },
        alpha: { label: "透明度", value: 1, min: 0, max: 1, step: 0.01 },
      }),
      distance: folder({
        distanceNear: { label: "distance 显示近", value: 0, min: 0, step: 100 },
        distanceFar: { label: "distance 显示远", value: 100000, min: 0, step: 100 },
        disableDepthTestDistance: {
          label: "禁深度测试距离",
          value: 0,
          min: 0,
          step: 100,
        },
      }),
      distanceEffects: folder({
        scaleByDistanceNear: { label: "缩放近 near", value: 0 },
        scaleByDistanceNearValue: {
          label: "缩放近值",
          value: 1,
          min: 0,
          max: 5,
          step: 0.1,
        },
        scaleByDistanceFar: { label: "缩放远 far", value: 100000 },
        scaleByDistanceFarValue: {
          label: "缩放远值",
          value: 0.5,
          min: 0,
          max: 5,
          step: 0.1,
        },
        translucencyNear: { label: "透明度近", value: 0 },
        translucencyNearValue: {
          label: "透明度近值",
          value: 1,
          min: 0,
          max: 1,
          step: 0.1,
        },
        translucencyFar: { label: "透明度远", value: 100000 },
        translucencyFarValue: {
          label: "透明度远值",
          value: 0,
          min: 0,
          max: 1,
          step: 0.1,
        },
        pixelOffsetScaleNear: { label: "像素偏移近", value: 0 },
        pixelOffsetScaleNearValue: {
          label: "像素偏移近值",
          value: 1,
          min: 0,
          max: 2,
          step: 0.1,
        },
        pixelOffsetScaleFar: { label: "像素偏移远", value: 100000 },
        pixelOffsetScaleFarValue: {
          label: "像素偏移远值",
          value: 0.5,
          min: 0,
          max: 2,
          step: 0.1,
        },
      }),
      imageSubRegion: folder({
        x: { label: "imageSubRegion X【图像子区域 X】", value: 0, min: 0, max: 1 },
        y: { label: "imageSubRegion Y【图像子区域 Y】", value: 0, min: 0, max: 1 },
        width: { label: "imageSubRegion Width【图像子区域宽】", value: 1, min: 0, max: 1 },
        height: { label: "imageSubRegion Height【图像子区域高】", value: 1, min: 0, max: 1 },
      }),
    },
  })

  const eyeOffset = useMemo(
    () => new Cartesian3(params.eyeOffsetX, params.eyeOffsetY, params.eyeOffsetZ),
    [params.eyeOffsetX, params.eyeOffsetY, params.eyeOffsetZ]
  )

  const pixelOffset = useMemo(
    () => new Cartesian2(params.pixelOffsetX, params.pixelOffsetY),
    [params.pixelOffsetX, params.pixelOffsetY]
  )

  const color = useMemo(
    () => new Color(params.colorR, params.colorG, params.colorB, params.alpha),
    [params.colorR, params.colorG, params.colorB, params.alpha]
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

  const imageSubRegion = useMemo(
    () =>
      new BoundingRectangle(
        params.x, // 使用 Leva 返回的 x
        params.y, // 使用 Leva 返回的 y
        params.width, // 使用 Leva 返回的 width
        params.height // 使用 Leva 返回的 height
      ),
    [params.x, params.y, params.width, params.height]
  )

  return (
    <BillboardGraphics
      {...props}
      show={params.show}
      image={params.image}
      scale={params.scale}
      rotation={CesiumMath.toRadians(params.rotation)}
      horizontalOrigin={HorizontalOrigin[params.horizontalOrigin]}
      verticalOrigin={VerticalOrigin[params.verticalOrigin]}
      heightReference={HeightReference[params.heightReference]}
      eyeOffset={eyeOffset}
      pixelOffset={pixelOffset}
      color={color}
      width={params.width || undefined}
      height={params.height || undefined}
      sizeInMeters={params.sizeInMeters}
      distanceDisplayCondition={distanceDisplayCondition}
      disableDepthTestDistance={params.disableDepthTestDistance}
      scaleByDistance={scaleByDistance}
      translucencyByDistance={translucencyByDistance}
      pixelOffsetScaleByDistance={pixelOffsetScaleByDistance}
      imageSubRegion={imageSubRegion}
    />
  )
}

export default memo(BillboardGraphicsWithLeva)
