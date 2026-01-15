import { memo } from "react"
import { Fog } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * FogWithLeva
 * - 用 Leva 控制 Fog 关键属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const FogWithLeva = () => {
  const params = useLevaControls({
    name: "Fog 控制",
    schema: {
      basic: folder(
        {
          enabled: { label: "启用 enabled", value: true },
          renderable: { label: "渲染 renderable", value: true },
          minimumBrightness: {
            label: "最小亮度 minimumBrightness",
            value: 0.2,
            min: 0,
            max: 1,
            step: 0.01,
          },
        },
        { collapsed: false }
      ),

      density: folder(
        {
          density: {
            label: "密度 density",
            value: 0.0006,
            min: 0,
            max: 0.01,
            step: 0.0001,
          },
          visualDensityScalar: {
            label: "视觉密度 visualDensityScalar",
            value: 0.6,
            min: 0,
            max: 2,
            step: 0.01,
          },
          screenSpaceErrorFactor: {
            label: "屏幕误差因子 screenSpaceErrorFactor",
            value: 2,
            min: 0,
            max: 10,
            step: 0.1,
          },
        },
        { collapsed: false }
      ),

      height: folder(
        {
          heightScalar: {
            label: "高度缩放 heightScalar",
            value: 0.001,
            min: 0,
            max: 0.01,
            step: 0.0001,
          },
          heightFalloff: {
            label: "高度衰减 heightFalloff",
            value: 0.25,
            min: 0.01,
            max: 2,
            step: 0.01,
          },
          maxHeight: {
            label: "最大高度 maxHeight",
            value: 800000,
            min: 0,
            max: 5000000,
            step: 1000,
          },
        },
        { collapsed: true }
      ),
    },
  })

  return (
    <Fog
      enabled={params.enabled}
      renderable={params.renderable}
      minimumBrightness={params.minimumBrightness}
      density={params.density}
      visualDensityScalar={params.visualDensityScalar}
      screenSpaceErrorFactor={params.screenSpaceErrorFactor}
      heightScalar={params.heightScalar}
      heightFalloff={params.heightFalloff}
      maxHeight={params.maxHeight}
    />
  )
}

export default memo(FogWithLeva)
