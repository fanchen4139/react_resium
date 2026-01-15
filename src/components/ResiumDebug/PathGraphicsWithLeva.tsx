import { memo, useMemo } from "react"
import { PathGraphics } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { Color, DistanceDisplayCondition } from "cesium"
import { folder } from "leva"

/**
 * PathGraphicsWithLeva
 * - 用 Leva 控制 PathGraphics 属性
 * - 必须作为 <Entity> 子组件使用
 */
const PathGraphicsWithLeva = () => {
  const params = useLevaControls({
    name: "PathGraphics 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          width: { label: "线宽 width", value: 2, min: 0, step: 0.5 },
          materialColor: { label: "材质颜色", value: "#00ff00" },
          leadTime: { label: "前导时间 leadTime", value: 0, step: 1 },
          trailTime: { label: "尾随时间 trailTime", value: 60, step: 1 },
          resolution: { label: "采样分辨率 resolution", value: 60, min: 1, step: 1 },
        },
        { collapsed: false }
      ),

      advanced: folder(
        {
          distanceDisplayCondition: {
            label: "距离显示条件 [near, far]",
            value: [0, 1e7],
          },
        },
        { collapsed: true }
      ),
    },
  })

  const material = useMemo(
    () => Color.fromCssColorString(params.materialColor),
    [params.materialColor]
  )

  const distanceDisplayCondition = useMemo(() => {
    return new DistanceDisplayCondition(
      params.distanceDisplayCondition[0],
      params.distanceDisplayCondition[1]
    )
  }, [params.distanceDisplayCondition[0], params.distanceDisplayCondition[1]])

  return (
    <PathGraphics
      show={params.show}
      width={params.width}
      material={material}
      leadTime={params.leadTime}
      trailTime={params.trailTime}
      resolution={params.resolution}
      distanceDisplayCondition={
        params.distanceDisplayCondition ? distanceDisplayCondition : undefined
      }
    />
  )
}

export default memo(PathGraphicsWithLeva)
