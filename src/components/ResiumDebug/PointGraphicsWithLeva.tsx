import { memo, useMemo } from "react"
import { PointGraphics } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Color,
  DistanceDisplayCondition,
  HeightReference,
  NearFarScalar,
  SplitDirection,
} from "cesium"
import { folder } from "leva"

/**
 * PointGraphicsWithLeva
 * - 用 Leva 控制 PointGraphics 属性
 * - 必须作为 <Entity> 子组件使用
 */
const PointGraphicsWithLeva = () => {
  const params = useLevaControls({
    name: "PointGraphics 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          pixelSize: {
            label: "像素大小 pixelSize",
            value: 10,
            min: 1,
            step: 1,
          },
          disableDepthTestDistance: {
            label: "禁用深度测试距离",
            value: 0,
            min: 0,
            step: 100,
          },
          heightReference: {
            label: "高度参考 heightReference",
            options: HeightReference,
            value: HeightReference.NONE,
          },
        },
        { collapsed: false }
      ),

      appearance: folder(
        {
          color: { label: "颜色", value: "#00ff00" },
          outlineColor: { label: "轮廓颜色", value: "#000000" },
          outlineWidth: { label: "轮廓宽度", value: 1, min: 0, step: 0.1 },
          splitDirection: {
            label: "分屏 splitDirection",
            options: SplitDirection,
            value: SplitDirection.NONE,
          },
        },
        { collapsed: false }
      ),

      distance: folder(
        {
          distanceDisplayCondition: {
            label: "距离显示条件 [near, far]",
            value: [0, 1e7],
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
        },
        { collapsed: true }
      ),
    },
  })

  const color = useMemo(
    () => Color.fromCssColorString(params.color),
    [params.color]
  )

  const outlineColor = useMemo(
    () => Color.fromCssColorString(params.outlineColor),
    [params.outlineColor]
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

  return (
    <PointGraphics
      show={params.show}
      pixelSize={params.pixelSize}
      disableDepthTestDistance={params.disableDepthTestDistance}
      heightReference={params.heightReference as HeightReference}
      color={color}
      outlineColor={outlineColor}
      outlineWidth={params.outlineWidth}
      splitDirection={params.splitDirection as SplitDirection}
      distanceDisplayCondition={
        params.distanceDisplayCondition ? distanceDisplayCondition : undefined
      }
      scaleByDistance={scaleByDistance}
      translucencyByDistance={translucencyByDistance}
    />
  )
}

export default memo(PointGraphicsWithLeva)
