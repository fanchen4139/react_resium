import { memo, useMemo } from "react"
import { BoxGraphics } from "resium"
import {
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  HeightReference,
  ShadowMode,
  Math as CesiumMath,
} from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * BoxGraphicsWithLeva
 * - 使用 Leva 控制 BoxGraphics 所有常用属性
 * - 必须放在 Entity 内
 */
const BoxGraphicsWithLeva = () => {
  const params = useLevaControls({
    name: "BoxGraphics 控制",
    schema: {
      base: folder({
        show: { label: "显示 show", value: true },
      }),
      dimensions: folder({
        width: { label: "宽度 width", value: 1000, min: 0, step: 100 },
        depth: { label: "深度 depth", value: 1000, min: 0, step: 100 },
        height: { label: "高度 height", value: 1000, min: 0, step: 100 },
      }),
      fill: folder({
        fill: { label: "填充 fill", value: true },
        materialR: { label: "材质 R", value: 1, min: 0, max: 1, step: 0.01 },
        materialG: { label: "材质 G", value: 0, min: 0, max: 1, step: 0.01 },
        materialB: { label: "材质 B", value: 0, min: 0, max: 1, step: 0.01 },
        materialAlpha: { label: "材质透明度", value: 1, min: 0, max: 1, step: 0.01 },
      }),
      outline: folder({
        outline: { label: "边框 outline", value: false },
        outlineColorR: { label: "边框 R", value: 1, min: 0, max: 1, step: 0.01 },
        outlineColorG: { label: "边框 G", value: 1, min: 0, max: 1, step: 0.01 },
        outlineColorB: { label: "边框 B", value: 1, min: 0, max: 1, step: 0.01 },
        outlineWidth: { label: "边框宽度", value: 1, min: 0, step: 0.1 },
      }),
      shadows: folder({
        shadows: {
          label: "阴影模式 ShadowMode",
          value: ShadowMode.DISABLED,
          options: {
            DISABLED: ShadowMode.DISABLED,
            ENABLED: ShadowMode.ENABLED,
            CAST_ONLY: ShadowMode.CAST_ONLY,
            RECEIVE_ONLY: ShadowMode.RECEIVE_ONLY,
          },
        },
      }),
      display: folder({
        heightReference: {
          label: "高度参考",
          value: "NONE",
          options: {
            NONE: "NONE",
            CLAMP_TO_GROUND: "CLAMP_TO_GROUND",
            RELATIVE_TO_GROUND: "RELATIVE_TO_GROUND",
          },
        },
        distanceNear: { label: "可见距离 near", value: 0, min: 0, step: 100 },
        distanceFar: { label: "可见距离 far", value: 100000, min: 0, step: 100 },
      }),
    },
  })

  // 构造尺寸
  const dimensions = useMemo(
    () => new Cartesian3(params.width, params.depth, params.height),
    [params.width, params.depth, params.height]
  )

  // 构造材质颜色
  const material = useMemo(
    () => new Color(params.materialR, params.materialG, params.materialB, params.materialAlpha),
    [params.materialR, params.materialG, params.materialB, params.materialAlpha]
  )

  // 边框颜色
  const outlineColor = useMemo(
    () => new Color(params.outlineColorR, params.outlineColorG, params.outlineColorB, 1),
    [params.outlineColorR, params.outlineColorG, params.outlineColorB]
  )

  // 距离显示条件
  const distanceDisplayCondition = useMemo(
    () => new DistanceDisplayCondition(params.distanceNear, params.distanceFar),
    [params.distanceNear, params.distanceFar]
  )

  return (
    <BoxGraphics
      show={params.show}
      dimensions={dimensions}
      heightReference={HeightReference[params.heightReference]}
      fill={params.fill}
      material={material}
      outline={params.outline}
      outlineColor={outlineColor}
      outlineWidth={params.outlineWidth}
      shadows={params.shadows}
      distanceDisplayCondition={distanceDisplayCondition}
    />
  )
}

export default memo(BoxGraphicsWithLeva)
