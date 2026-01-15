import { memo } from "react"
import { Moon } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * MoonWithLeva
 * - 用 Leva 控制 Moon 属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const MoonWithLeva = () => {
  const params = useLevaControls({
    name: "Moon 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          onlySunLighting: {
            label: "仅太阳光 onlySunLighting",
            value: false,
          },
          textureUrl: { label: "纹理 URL", value: "" },
        },
        { collapsed: false }
      ),
    },
  })

  return (
    <Moon
      show={params.show}
      onlySunLighting={params.onlySunLighting}
      textureUrl={params.textureUrl || undefined}
    />
  )
}

export default memo(MoonWithLeva)
