import { memo } from "react"
import { GroundPrimitive, type GroundPrimitiveProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { ClassificationType } from "cesium"
import { folder } from "leva"

type GroundPrimitiveWithLevaProps = Omit<
  GroundPrimitiveProps,
  "show" | "classificationType" | "debugShowBoundingVolume" | "debugShowShadowVolume"
>

/**
 * GroundPrimitiveWithLeva
 * - 用 Leva 控制 GroundPrimitive 关键属性
 * - 需放在 <Viewer>/<CesiumWidget> 或 <GroundPrimitiveCollection> 内使用
 */
const GroundPrimitiveWithLeva = (props: GroundPrimitiveWithLevaProps) => {
  const params = useLevaControls({
    name: "GroundPrimitive 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          classificationType: {
            label: "分类模式",
            options: ClassificationType,
            value: ClassificationType.BOTH,
          },
          debugShowBoundingVolume: {
            label: "显示包围体",
            value: false,
          },
          debugShowShadowVolume: {
            label: "显示阴影体",
            value: false,
          },
        },
        { collapsed: false }
      ),
    },
  })

  return (
    <GroundPrimitive
      {...props}
      show={params.show}
      classificationType={params.classificationType as ClassificationType}
      debugShowBoundingVolume={params.debugShowBoundingVolume}
      debugShowShadowVolume={params.debugShowShadowVolume}
    />
  )
}

export default memo(GroundPrimitiveWithLeva)
