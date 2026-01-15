import { memo } from "react"
import { GroundPolylinePrimitive, type GroundPolylinePrimitiveProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { ClassificationType } from "cesium"
import { folder } from "leva"

type GroundPolylinePrimitiveWithLevaProps = Omit<
  GroundPolylinePrimitiveProps,
  "show" | "classificationType" | "debugShowBoundingVolume" | "debugShowShadowVolume"
>

/**
 * GroundPolylinePrimitiveWithLeva
 * - 用 Leva 控制 GroundPolylinePrimitive 关键属性
 * - 需放在 <Viewer>/<CesiumWidget> 或 <GroundPrimitiveCollection> 内使用
 */
const GroundPolylinePrimitiveWithLeva = (
  props: GroundPolylinePrimitiveWithLevaProps
) => {
  const params = useLevaControls({
    name: "GroundPolylinePrimitive 控制",
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
    <GroundPolylinePrimitive
      {...props}
      show={params.show}
      classificationType={params.classificationType as ClassificationType}
      debugShowBoundingVolume={params.debugShowBoundingVolume}
      debugShowShadowVolume={params.debugShowShadowVolume}
    />
  )
}

export default memo(GroundPolylinePrimitiveWithLeva)
