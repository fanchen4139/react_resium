import { memo, useMemo } from "react"
import { CylinderGraphics, type CylinderGraphicsProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { Color, DistanceDisplayCondition, ShadowMode, HeightReference } from "cesium"
import { folder } from "leva"

/**
 * CylinderGraphicsWithLeva
 * 用 Leva 控制 CylinderGraphics 可写属性
 * - 必须作为 <Entity> 子组件使用
 */
type CylinderGraphicsWithLevaProps = Omit<
  CylinderGraphicsProps,
  "show" | "length" | "topRadius" | "bottomRadius" | "material" | "outline" | "outlineColor" | "outlineWidth" | "heightReference" | "shadows" | "distanceDisplayCondition" | "fill" | "numberOfVerticalLines" | "slices"
>

const CylinderGraphicsWithLeva = ({ ...props }: CylinderGraphicsWithLevaProps) => {
  const params = useLevaControls({
    name: "CylinderGraphics 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },

          // Cylinder 的高度和半径
          length: {
            label: "长度 length",
            value: 10000,
            min: 0,
            step: 100,
          },
          topRadius: {
            label: "顶部半径 topRadius",
            value: 5000,
            min: 0,
            step: 100,
          },
          bottomRadius: {
            label: "底部半径 bottomRadius",
            value: 5000,
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
          fill: { label: "填充 fill", value: true },
          materialColor: { label: "颜色", value: "#ffffff" },
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
          numberOfVerticalLines: {
            label: "垂直线数量",
            value: 16,
            min: 0,
            step: 1,
          },
          slices: {
            label: "切片数 slices",
            value: 128,
            min: 3,
            step: 1,
          },
          shadows: {
            label: "阴影 shadows",
            options: ShadowMode,
            value: ShadowMode.DISABLED,
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
  const [distanceNear, distanceFar] = params.distanceDisplayCondition
  const distanceDisplayCondition = useMemo(() => {
    return new DistanceDisplayCondition(distanceNear, distanceFar)
  }, [distanceNear, distanceFar])

  // Color 和其他 Cesium 复杂对象需通过 useMemo 创建
  const materialColor = useMemo(
    () => Color.fromCssColorString(params.materialColor),
    [params.materialColor]
  )

  return (
    <CylinderGraphics
      {...props}
      show={params.show}
      length={params.length}
      topRadius={params.topRadius}
      bottomRadius={params.bottomRadius}
      fill={params.fill}
      material={materialColor}
      outline={params.outline}
      outlineColor={Color.fromCssColorString(params.outlineColor)}
      outlineWidth={params.outlineWidth}
      numberOfVerticalLines={params.numberOfVerticalLines}
      slices={params.slices}
      heightReference={params.heightReference as HeightReference}
      shadows={params.shadows as ShadowMode}
      distanceDisplayCondition={
        params.distanceDisplayCondition
          ? distanceDisplayCondition 
          : undefined
      }
    />
  )
}

export default memo(CylinderGraphicsWithLeva)
