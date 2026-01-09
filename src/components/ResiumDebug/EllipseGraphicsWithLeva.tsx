import { memo, useMemo } from "react"
import { EllipseGraphics } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Cartesian3,
  Color,
  ShadowMode,
  ClassificationType,
  HeightReference,
  DistanceDisplayCondition
} from "cesium"
import { folder } from "leva"

/**
 * EllipseGraphicsWithLeva
 * - 用 Leva 控制 EllipseGraphics 属性
 * - 必须作为 <Entity> 子组件使用
 */
const EllipseGraphicsWithLeva = () => {
  const params = useLevaControls({
    name: "EllipseGraphics 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },

          // 中心坐标
          lng: { label: "经度", value: 116, step: 0.00001 },
          lat: { label: "纬度", value: 39, step: 0.00001 },
          height: { label: "高度", value: 0, step: 10 },
          fill: { label: "填充", value: true },

          semiMajorAxis: {
            label: "半长轴 semiMajorAxis",
            value: 5000,
            min: 0,
            step: 100,
          },
          semiMinorAxis: {
            label: "半短轴 semiMinorAxis",
            value: 3000,
            min: 0,
            step: 100,
          },
          rotation: {
            label: "旋转 rotation (弧度)",
            value: 0,
            min: 0,
            step: Math.PI / 180,
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
          materialColor: {
            label: "填充颜色",
            value: "#00ff00",
          },
          outline: { label: "轮廓 outline", value: false },
          outlineColor: {
            label: "轮廓颜色",
            value: "#000000",
          },
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
          extrudedHeight: {
            label: "挤出高度 extrudedHeight",
            value: 0,
            min: 0,
            step: 100,
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

  const materialColor = useMemo(
    () => Color.fromCssColorString(params.materialColor),
    [params.materialColor]
  )

  const outlineColor = useMemo(
    () => Color.fromCssColorString(params.outlineColor),
    [params.outlineColor]
  )

  const distanceDisplayCondition = useMemo(() => {
    return new DistanceDisplayCondition(params.distanceDisplayCondition[0], params.distanceDisplayCondition[1])
  }, [params.distanceDisplayCondition[0], params.distanceDisplayCondition[1]])

  return (
    <EllipseGraphics
      distanceDisplayCondition={
        params.distanceDisplayCondition
          ? distanceDisplayCondition
          : undefined
      }
      height={params.height}
      heightReference={params.heightReference as HeightReference}
      rotation={params.rotation}
      show={params.show}
      fill={params.fill}
      material={materialColor}
      outline={params.outline}
      outlineColor={outlineColor}
      outlineWidth={params.outlineWidth}
      shadows={params.shadows as ShadowMode}
      classificationType={params.classificationType as ClassificationType}
      extrudedHeight={params.extrudedHeight}
      semiMajorAxis={params.semiMajorAxis}
      semiMinorAxis={params.semiMinorAxis}
    />
  )
}

export default memo(EllipseGraphicsWithLeva)
