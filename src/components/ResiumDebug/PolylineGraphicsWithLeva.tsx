import { memo, useMemo } from "react"
import { PolylineGraphics } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  ArcType,
  Cartesian3,
  Color,
  ClassificationType,
  ShadowMode,
  DistanceDisplayCondition,
} from "cesium"
import { folder } from "leva"

/**
 * PolylineGraphicsWithLeva
 * - 用 Leva 控制 PolylineGraphics 属性
 * - 必须作为 <Entity> 子组件使用
 */
const PolylineGraphicsWithLeva = () => {
  const params = useLevaControls({
    name: "PolylineGraphics 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },

          longitudeArray: { label: "经度数组", value: [116, 116.02, 116.04] },
          latitudeArray: { label: "纬度数组", value: [39, 39.01, 39.02] },
          heightArray: { label: "高度数组", value: [0, 0, 0] },

          clampToGround: { label: "贴地 clampToGround", value: false },
          width: { label: "线宽 width", value: 2, min: 0, step: 0.5 },
          materialColor: { label: "材质颜色", value: "#00ff00" },
          depthFailColor: {
            label: "深度失败颜色",
            value: "#ff0000",
          },
        },
        { collapsed: false }
      ),

      advanced: folder(
        {
          arcType: {
            label: "路径类型 arcType",
            options: ArcType,
            value: ArcType.GEODESIC,
          },
          granularity: {
            label: "采样角度 granularity (弧度)",
            value: Math.PI / 180,
            min: 0,
            step: Math.PI / 180,
          },
          shadows: {
            label: "阴影 shadows",
            options: ShadowMode,
            value: ShadowMode.DISABLED,
          },
          classificationType: {
            label: "分类模式",
            options: ClassificationType,
            value: ClassificationType.BOTH,
          },
          distanceDisplayCondition: {
            label: "距离显示条件 [near, far]",
            value: [0, 1e7],
          },
          zIndex: {
            label: "排序 zIndex",
            value: 0,
            step: 1,
          },
        },
        { collapsed: true }
      ),
    },
  })

  const positions = useMemo(
    () =>
      params.longitudeArray.map((lng, index) =>
        Cartesian3.fromDegrees(
          lng,
          params.latitudeArray[index] ?? 0,
          params.heightArray[index] ?? 0
        )
      ),
    [params.longitudeArray, params.latitudeArray, params.heightArray]
  )

  const materialColor = useMemo(
    () => Color.fromCssColorString(params.materialColor),
    [params.materialColor]
  )

  const depthFailMaterial = useMemo(
    () => Color.fromCssColorString(params.depthFailColor),
    [params.depthFailColor]
  )

  const distanceDisplayCondition = useMemo(() => {
    return new DistanceDisplayCondition(
      params.distanceDisplayCondition[0],
      params.distanceDisplayCondition[1]
    )
  }, [params.distanceDisplayCondition[0], params.distanceDisplayCondition[1]])

  return (
    <PolylineGraphics
      show={params.show}
      positions={positions}
      clampToGround={params.clampToGround}
      width={params.width}
      material={materialColor}
      depthFailMaterial={depthFailMaterial}
      arcType={params.arcType as ArcType}
      granularity={params.granularity}
      shadows={params.shadows as ShadowMode}
      classificationType={params.classificationType as ClassificationType}
      distanceDisplayCondition={
        params.distanceDisplayCondition ? distanceDisplayCondition : undefined
      }
      zIndex={params.zIndex}
    />
  )
}

export default memo(PolylineGraphicsWithLeva)
