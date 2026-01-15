import { memo } from "react"
import { ShadowMap } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * ShadowMapWithLeva
 * - 用 Leva 控制 ShadowMap 属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const ShadowMapWithLeva = () => {
  const params = useLevaControls({
    name: "ShadowMap 控制",
    schema: {
      basic: folder(
        {
          enabled: { label: "启用 enabled", value: true },
          darkness: {
            label: "阴影强度 darkness",
            value: 0.3,
            min: 0,
            max: 1,
            step: 0.01,
          },
          softShadows: { label: "柔和阴影 softShadows", value: false },
        },
        { collapsed: false }
      ),

      quality: folder(
        {
          size: {
            label: "阴影贴图尺寸 size",
            value: 2048,
            min: 128,
            max: 4096,
            step: 128,
          },
          maximumDistance: {
            label: "最大距离 maximumDistance",
            value: 5000000,
            min: 0,
            step: 10000,
          },
          fadingEnabled: {
            label: "渐隐 fadingEnabled",
            value: true,
          },
          normalOffset: {
            label: "法线偏移 normalOffset",
            value: true,
          },
        },
        { collapsed: true }
      ),
    },
  })

  return (
    <ShadowMap
      enabled={params.enabled}
      darkness={params.darkness}
      softShadows={params.softShadows}
      size={params.size}
      maximumDistance={params.maximumDistance}
      fadingEnabled={params.fadingEnabled}
      normalOffset={params.normalOffset}
    />
  )
}

export default memo(ShadowMapWithLeva)
