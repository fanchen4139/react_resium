import { memo, useMemo } from "react"
import { PlaneGraphics } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Cartesian2,
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  Plane,
  ShadowMode,
} from "cesium"
import { folder } from "leva"

/**
 * PlaneGraphicsWithLeva
 * - 用 Leva 控制 PlaneGraphics 属性
 * - 必须作为 <Entity> 子组件使用
 */
const PlaneGraphicsWithLeva = () => {
  const params = useLevaControls({
    name: "PlaneGraphics 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          fill: { label: "填充 fill", value: true },

          normalX: { label: "法线 X", value: 0, step: 0.1 },
          normalY: { label: "法线 Y", value: 0, step: 0.1 },
          normalZ: { label: "法线 Z", value: 1, step: 0.1 },
          distance: { label: "距离 distance", value: 0, step: 1 },

          dimensionX: {
            label: "宽度 dimensionX",
            value: 10000,
            min: 0,
            step: 100,
          },
          dimensionY: {
            label: "高度 dimensionY",
            value: 10000,
            min: 0,
            step: 100,
          },
        },
        { collapsed: false }
      ),

      appearance: folder(
        {
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

  const plane = useMemo(() => {
    const normal = new Cartesian3(
      params.normalX,
      params.normalY,
      params.normalZ
    )
    return new Plane(normal, params.distance)
  }, [params.normalX, params.normalY, params.normalZ, params.distance])

  const dimensions = useMemo(
    () => new Cartesian2(params.dimensionX, params.dimensionY),
    [params.dimensionX, params.dimensionY]
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
    <PlaneGraphics
      show={params.show}
      plane={plane}
      dimensions={dimensions}
      fill={params.fill}
      material={materialColor}
      outline={params.outline}
      outlineColor={outlineColor}
      outlineWidth={params.outlineWidth}
      shadows={params.shadows as ShadowMode}
      distanceDisplayCondition={
        params.distanceDisplayCondition ? distanceDisplayCondition : undefined
      }
    />
  )
}

export default memo(PlaneGraphicsWithLeva)
