import { memo, useEffect } from "react"
import { GroundPrimitiveCollection } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"
import { useCesium } from "resium"

/**
 * GroundPrimitiveCollectionWithLeva
 * - 用 Leva 控制 GroundPrimitiveCollection 属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const GroundPrimitiveCollectionWithLeva: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  const { scene } = useCesium()
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

  useEffect(() => {
    const groundPrimitives = scene?.groundPrimitives
    if (!groundPrimitives) return

    const handleAdded = (primitive: unknown) => {
      if (params.logPrimitiveAdded) {
        console.log("[GroundPrimitiveCollection primitiveAdded]", primitive)
      }
    }

    const handleRemoved = (primitive: unknown) => {
      if (params.logPrimitiveRemoved) {
        console.log("[GroundPrimitiveCollection primitiveRemoved]", primitive)
      }
    }

    if (params.logPrimitiveAdded) {
      groundPrimitives.primitiveAdded.addEventListener(handleAdded)
    }
    if (params.logPrimitiveRemoved) {
      groundPrimitives.primitiveRemoved.addEventListener(handleRemoved)
    }

    return () => {
      groundPrimitives.primitiveAdded.removeEventListener(handleAdded)
      groundPrimitives.primitiveRemoved.removeEventListener(handleRemoved)
    }
  }, [scene, params.logPrimitiveAdded, params.logPrimitiveRemoved])

  return (
    <GroundPrimitiveCollection
      show={params.show}
      destroyPrimitives={params.destroyPrimitives}
    >
      {children}
    </GroundPrimitiveCollection>
  )
}

export default memo(GroundPrimitiveCollectionWithLeva)
