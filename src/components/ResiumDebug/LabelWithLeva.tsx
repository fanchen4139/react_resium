import { memo, useMemo } from "react"
import { Label } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Cartesian2,
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  HeightReference,
  HorizontalOrigin,
  LabelStyle,
  NearFarScalar,
  VerticalOrigin,
} from "cesium"
import { folder } from "leva"

/**
 * LabelWithLeva
 * - 用 Leva 控制 Label 属性
 * - 需放在 <LabelCollection> 内使用
 */
const LabelWithLeva = () => {
  const params = useLevaControls({
    name: "Label 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          text: { label: "文本 text", value: "Label" },
          font: { label: "字体 font", value: "24px sans-serif" },
          style: {
            label: "样式 style",
            options: LabelStyle,
            value: LabelStyle.FILL,
          },
          scale: { label: "缩放 scale", value: 1, min: 0, step: 0.1 },

          lng: { label: "经度", value: 116.395102, step: 0.00001 },
          lat: { label: "纬度", value: 39.868458, step: 0.00001 },
          height: { label: "高度", value: 0, step: 10 },
        },
        { collapsed: false }
      ),

      appearance: folder(
        {
          fillColor: { label: "填充颜色", value: "#ffffff" },
          outlineColor: { label: "轮廓颜色", value: "#000000" },
          outlineWidth: {
            label: "轮廓宽度",
            value: 1,
            min: 0,
            step: 0.1,
          },
          showBackground: { label: "显示背景", value: false },
          backgroundColor: { label: "背景颜色", value: "#000000" },
          backgroundPaddingX: {
            label: "背景内边距 X",
            value: 7,
            min: 0,
            step: 1,
          },
          backgroundPaddingY: {
            label: "背景内边距 Y",
            value: 5,
            min: 0,
            step: 1,
          },
        },
        { collapsed: false }
      ),

      layout: folder(
        {
          horizontalOrigin: {
            label: "水平对齐",
            options: HorizontalOrigin,
            value: HorizontalOrigin.CENTER,
          },
          verticalOrigin: {
            label: "垂直对齐",
            options: VerticalOrigin,
            value: VerticalOrigin.CENTER,
          },
          eyeOffsetX: { label: "eyeOffset X", value: 0, step: 1 },
          eyeOffsetY: { label: "eyeOffset Y", value: 0, step: 1 },
          eyeOffsetZ: { label: "eyeOffset Z", value: 0, step: 1 },
          pixelOffsetX: { label: "pixelOffset X", value: 0, step: 1 },
          pixelOffsetY: { label: "pixelOffset Y", value: 0, step: 1 },
        },
        { collapsed: true }
      ),

      distance: folder(
        {
          heightReference: {
            label: "高度参考",
            options: HeightReference,
            value: HeightReference.NONE,
          },
          distanceDisplayCondition: {
            label: "距离显示条件 [near, far]",
            value: [0, 1e7],
          },
          disableDepthTestDistance: {
            label: "禁用深度测试距离",
            value: 0,
            min: 0,
            step: 100,
          },
          useScaleByDistance: {
            label: "启用 scaleByDistance",
            value: false,
          },
          scaleNear: { label: "scale near", value: 0, min: 0, step: 100 },
          scaleNearValue: {
            label: "scale nearValue",
            value: 1,
            min: 0,
            step: 0.1,
          },
          scaleFar: { label: "scale far", value: 1e7, min: 0, step: 1000 },
          scaleFarValue: {
            label: "scale farValue",
            value: 0,
            min: 0,
            step: 0.1,
          },
          useTranslucencyByDistance: {
            label: "启用 translucencyByDistance",
            value: false,
          },
          translucentNear: {
            label: "translucency near",
            value: 0,
            min: 0,
            step: 100,
          },
          translucentNearValue: {
            label: "translucency nearValue",
            value: 1,
            min: 0,
            max: 1,
            step: 0.01,
          },
          translucentFar: {
            label: "translucency far",
            value: 1e7,
            min: 0,
            step: 1000,
          },
          translucentFarValue: {
            label: "translucency farValue",
            value: 0,
            min: 0,
            max: 1,
            step: 0.01,
          },
          usePixelOffsetScaleByDistance: {
            label: "启用 pixelOffsetScaleByDistance",
            value: false,
          },
          pixelOffsetNear: {
            label: "pixelOffset near",
            value: 0,
            min: 0,
            step: 100,
          },
          pixelOffsetNearValue: {
            label: "pixelOffset nearValue",
            value: 1,
            min: 0,
            step: 0.1,
          },
          pixelOffsetFar: {
            label: "pixelOffset far",
            value: 1e7,
            min: 0,
            step: 1000,
          },
          pixelOffsetFarValue: {
            label: "pixelOffset farValue",
            value: 0,
            min: 0,
            step: 0.1,
          },
        },
        { collapsed: true }
      ),
    },
  })

  const position = useMemo(
    () => Cartesian3.fromDegrees(params.lng, params.lat, params.height),
    [params.lng, params.lat, params.height]
  )

  const fillColor = useMemo(
    () => Color.fromCssColorString(params.fillColor),
    [params.fillColor]
  )

  const outlineColor = useMemo(
    () => Color.fromCssColorString(params.outlineColor),
    [params.outlineColor]
  )

  const backgroundColor = useMemo(
    () => Color.fromCssColorString(params.backgroundColor),
    [params.backgroundColor]
  )

  const backgroundPadding = useMemo(
    () => new Cartesian2(params.backgroundPaddingX, params.backgroundPaddingY),
    [params.backgroundPaddingX, params.backgroundPaddingY]
  )

  const eyeOffset = useMemo(
    () => new Cartesian3(params.eyeOffsetX, params.eyeOffsetY, params.eyeOffsetZ),
    [params.eyeOffsetX, params.eyeOffsetY, params.eyeOffsetZ]
  )

  const pixelOffset = useMemo(
    () => new Cartesian2(params.pixelOffsetX, params.pixelOffsetY),
    [params.pixelOffsetX, params.pixelOffsetY]
  )

  const distanceDisplayCondition = useMemo(() => {
    return new DistanceDisplayCondition(
      params.distanceDisplayCondition[0],
      params.distanceDisplayCondition[1]
    )
  }, [params.distanceDisplayCondition[0], params.distanceDisplayCondition[1]])

  const scaleByDistance = useMemo(() => {
    if (!params.useScaleByDistance) return undefined
    return new NearFarScalar(
      params.scaleNear,
      params.scaleNearValue,
      params.scaleFar,
      params.scaleFarValue
    )
  }, [
    params.useScaleByDistance,
    params.scaleNear,
    params.scaleNearValue,
    params.scaleFar,
    params.scaleFarValue,
  ])

  const translucencyByDistance = useMemo(() => {
    if (!params.useTranslucencyByDistance) return undefined
    return new NearFarScalar(
      params.translucentNear,
      params.translucentNearValue,
      params.translucentFar,
      params.translucentFarValue
    )
  }, [
    params.useTranslucencyByDistance,
    params.translucentNear,
    params.translucentNearValue,
    params.translucentFar,
    params.translucentFarValue,
  ])

  const pixelOffsetScaleByDistance = useMemo(() => {
    if (!params.usePixelOffsetScaleByDistance) return undefined
    return new NearFarScalar(
      params.pixelOffsetNear,
      params.pixelOffsetNearValue,
      params.pixelOffsetFar,
      params.pixelOffsetFarValue
    )
  }, [
    params.usePixelOffsetScaleByDistance,
    params.pixelOffsetNear,
    params.pixelOffsetNearValue,
    params.pixelOffsetFar,
    params.pixelOffsetFarValue,
  ])

  return (
    <Label
      show={params.show}
      text={params.text}
      font={params.font}
      style={params.style as LabelStyle}
      scale={params.scale}
      position={position}
      fillColor={fillColor}
      outlineColor={outlineColor}
      outlineWidth={params.outlineWidth}
      showBackground={params.showBackground}
      backgroundColor={backgroundColor}
      backgroundPadding={backgroundPadding}
      horizontalOrigin={params.horizontalOrigin as HorizontalOrigin}
      verticalOrigin={params.verticalOrigin as VerticalOrigin}
      eyeOffset={eyeOffset}
      pixelOffset={pixelOffset}
      heightReference={params.heightReference as HeightReference}
      distanceDisplayCondition={
        params.distanceDisplayCondition ? distanceDisplayCondition : undefined
      }
      disableDepthTestDistance={params.disableDepthTestDistance}
      scaleByDistance={scaleByDistance}
      translucencyByDistance={translucencyByDistance}
      pixelOffsetScaleByDistance={pixelOffsetScaleByDistance}
    />
  )
}

export default memo(LabelWithLeva)
