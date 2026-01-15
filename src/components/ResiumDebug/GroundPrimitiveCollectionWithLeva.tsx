import { memo } from "react"
import { GroundPrimitiveCollection } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * GroundPrimitiveCollectionWithLeva
 * - 用 Leva 控制 GroundPrimitiveCollection 属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const GroundPrimitiveCollectionWithLeva: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  const params = useLevaControls({
    name: "GroundPrimitiveCollection 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          destroyPrimitives: {
            label: "销毁 primitives",
            value: true,
          },
        },
        { collapsed: false }
      ),
      events: folder(
        {
          logPrimitiveAdded: { label: "打印 primitiveAdded", value: false },
          logPrimitiveRemoved: { label: "打印 primitiveRemoved", value: false },
        },
        { collapsed: true }
      ),
    },
  })

  return (
    <GroundPrimitiveCollection
      show={params.show}
      destroyPrimitives={params.destroyPrimitives}
      primitiveAdded={
        params.logPrimitiveAdded
          ? (primitive) => console.log("[GroundPrimitiveCollection primitiveAdded]", primitive)
          : undefined
      }
      primitiveRemoved={
        params.logPrimitiveRemoved
          ? (primitive) => console.log("[GroundPrimitiveCollection primitiveRemoved]", primitive)
          : undefined
      }
    >
      {children}
    </GroundPrimitiveCollection>
  )
}

export default memo(GroundPrimitiveCollectionWithLeva)
