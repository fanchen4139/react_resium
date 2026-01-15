import { memo, useMemo } from "react"
import { PointPrimitive } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  NearFarScalar,
  SplitDirection,
} from "cesium"
import { folder } from "leva"

/**
 * PointPrimitiveWithLeva
 * - 用 Leva 控制 PointPrimitive 属性
 * - 需放在 <PointPrimitiveCollection> 内使用
 */
const PointPrimitiveWithLeva = () => {
  const params = useLevaControls({
    name: "PointPrimitive 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          pixelSize: { label: "像素大小 pixelSize", value: 10, min: 1, step: 1 },
          disableDepthTestDistance: {
            label: "禁用深度测试距离",
            value: 0,
            min: 0,
            step: 100,
          },

          lng: { label: "经度", value: 116.395102, step: 0.00001 },
          lat: { label: "纬度", value: 39.868458, step: 0.00001 },
          height: { label: "高度", value: 0, step: 10 },
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

  const position = useMemo(
    () => Cartesian3.fromDegrees(params.lng, params.lat, params.height),
    [params.lng, params.lat, params.height]
  )

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
    <PointPrimitive
      show={params.show}
      position={position}
      pixelSize={params.pixelSize}
      disableDepthTestDistance={params.disableDepthTestDistance}
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

export default memo(PointPrimitiveWithLeva)
