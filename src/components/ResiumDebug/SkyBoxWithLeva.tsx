import { memo, useMemo } from "react"
import { SkyBox } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * SkyBoxWithLeva
 * - 用 Leva 控制 SkyBox 属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const SkyBoxWithLeva = () => {
  const params = useLevaControls({
    name: "SkyBox 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          useCustomSources: {
            label: "启用自定义 sources",
            value: false,
          },
        },
        { collapsed: false }
      ),

      sources: folder(
        {
          positiveX: { label: "+X", value: "" },
          negativeX: { label: "-X", value: "" },
          positiveY: { label: "+Y", value: "" },
          negativeY: { label: "-Y", value: "" },
          positiveZ: { label: "+Z", value: "" },
          negativeZ: { label: "-Z", value: "" },
        },
        { collapsed: true }
      ),
    },
  })

  const sources = useMemo(() => {
    if (!params.useCustomSources) return undefined
    return {
      positiveX: params.positiveX,
      negativeX: params.negativeX,
      positiveY: params.positiveY,
      negativeY: params.negativeY,
      positiveZ: params.positiveZ,
      negativeZ: params.negativeZ,
    }
  }, [
    params.useCustomSources,
    params.positiveX,
    params.negativeX,
    params.positiveY,
    params.negativeY,
    params.positiveZ,
    params.negativeZ,
  ])

  return <SkyBox show={params.show} sources={sources} />
}

export default memo(SkyBoxWithLeva)
