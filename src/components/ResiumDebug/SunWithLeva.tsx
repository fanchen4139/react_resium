import { memo } from "react"
import { Sun } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * SunWithLeva
 * - 用 Leva 控制 Sun 属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const SunWithLeva = () => {
  const params = useLevaControls({
    name: "Sun 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          glowFactor: {
            label: "发光强度 glowFactor",
            value: 1,
            min: 0,
            max: 10,
            step: 0.1,
          },
        },
        { collapsed: false }
      ),
    },
  })

  return <Sun show={params.show} glowFactor={params.glowFactor} />
}

export default memo(SunWithLeva)
