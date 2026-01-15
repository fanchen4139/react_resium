import { memo, useMemo } from "react"
import { RectangleGraphics } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Rectangle,
  Color,
  ShadowMode,
  ClassificationType,
  HeightReference,
  DistanceDisplayCondition,
} from "cesium"
import { folder } from "leva"

/**
 * RectangleGraphicsWithLeva
 * - 用 Leva 控制 RectangleGraphics 属性
 * - 必须作为 <Entity> 子组件使用
 */
const RectangleGraphicsWithLeva = () => {
  const params = useLevaControls({
    name: "RectangleGraphics 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },

          west: { label: "西经 west", value: 115, step: 0.00001 },
          south: { label: "南纬 south", value: 39, step: 0.00001 },
          east: { label: "东经 east", value: 116, step: 0.00001 },
          north: { label: "北纬 north", value: 40, step: 0.00001 },

          height: { label: "高度 height", value: 0, step: 10 },
          extrudedHeight: {
            label: "挤出高度 extrudedHeight",
            value: 0,
            min: 0,
            step: 10,
          },
          rotation: {
            label: "旋转 rotation (弧度)",
            value: 0,
            min: 0,
            step: Math.PI / 180,
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
          zIndex: {
            label: "排序 zIndex",
            value: 0,
            step: 1,
          },
        },
        { collapsed: false }
      ),

      appearance: folder(
        {
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
        },
        { collapsed: true }
      ),
    },
  })

  const coordinates = useMemo(
    () => Rectangle.fromDegrees(params.west, params.south, params.east, params.north),
    [params.west, params.south, params.east, params.north]
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
    <RectangleGraphics
      show={params.show}
      coordinates={coordinates}
      height={params.height}
      heightReference={params.heightReference as HeightReference}
      extrudedHeight={params.extrudedHeight}
      extrudedHeightReference={params.extrudedHeightReference as HeightReference}
      rotation={params.rotation}
      stRotation={params.stRotation}
      granularity={params.granularity}
      zIndex={params.zIndex}
      fill={params.fill}
      material={materialColor}
      outline={params.outline}
      outlineColor={outlineColor}
      outlineWidth={params.outlineWidth}
      shadows={params.shadows as ShadowMode}
      classificationType={params.classificationType as ClassificationType}
      distanceDisplayCondition={
        params.distanceDisplayCondition ? distanceDisplayCondition : undefined
      }
    />
  )
}

export default memo(RectangleGraphicsWithLeva)
