import { memo, useMemo } from "react"
import { PolygonGraphics } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  ArcType,
  Cartesian3,
  Color,
  ClassificationType,
  DistanceDisplayCondition,
  HeightReference,
  ShadowMode,
} from "cesium"
import { folder } from "leva"

/**
 * PolygonGraphicsWithLeva
 * - 用 Leva 控制 PolygonGraphics 属性
 * - 必须作为 <Entity> 子组件使用
 */
const PolygonGraphicsWithLeva = () => {
  const params = useLevaControls({
    name: "PolygonGraphics 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },

          longitudeArray: { label: "经度数组", value: [116, 116.02, 116.04] },
          latitudeArray: { label: "纬度数组", value: [39, 39.01, 39.02] },
          heightArray: { label: "高度数组", value: [0, 0, 0] },

          height: { label: "高度 height", value: 0, step: 10 },
          extrudedHeight: {
            label: "挤出高度 extrudedHeight",
            value: 0,
            min: 0,
            step: 10,
          },

          fill: { label: "填充 fill", value: true },
          materialColor: { label: "填充颜色", value: "#00ff00" },
          outline: { label: "轮廓 outline", value: false },
          outlineColor: { label: "轮廓颜色", value: "#000000" },
          outlineWidth: {
            label: "轮廓宽度",
            value: 1,
            min: 0,
            step: 0.1,
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
          heightReference: {
            label: "高度参考 heightReference",
            options: HeightReference,
            value: HeightReference.NONE,
          },
          extrudedHeightReference: {
            label: "挤出高度参考",
            options: HeightReference,
            value: HeightReference.NONE,
          },
          stRotation: {
            label: "纹理旋转 stRotation (弧度)",
            value: 0,
            min: 0,
            step: Math.PI / 180,
          },
          granularity: {
            label: "采样角度 granularity (弧度)",
            value: Math.PI / 180,
            min: 0,
            step: Math.PI / 180,
          },
          perPositionHeight: {
            label: "按点高度 perPositionHeight",
            value: false,
          },
          closeTop: { label: "封顶 closeTop", value: true },
          closeBottom: { label: "封底 closeBottom", value: true },
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

  const hierarchy = useMemo(
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

  return (
    <PolygonGraphics
      show={params.show}
      hierarchy={hierarchy}
      height={params.height}
      heightReference={params.heightReference as HeightReference}
      extrudedHeight={params.extrudedHeight}
      extrudedHeightReference={params.extrudedHeightReference as HeightReference}
      fill={params.fill}
      material={materialColor}
      outline={params.outline}
      outlineColor={outlineColor}
      outlineWidth={params.outlineWidth}
      arcType={params.arcType as ArcType}
      stRotation={params.stRotation}
      granularity={params.granularity}
      perPositionHeight={params.perPositionHeight}
      closeTop={params.closeTop}
      closeBottom={params.closeBottom}
      shadows={params.shadows as ShadowMode}
      classificationType={params.classificationType as ClassificationType}
      distanceDisplayCondition={
        params.distanceDisplayCondition ? distanceDisplayCondition : undefined
      }
      zIndex={params.zIndex}
    />
  )
}

export default memo(PolygonGraphicsWithLeva)
