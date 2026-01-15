import { memo, useMemo } from "react"
import { Primitive, type PrimitiveProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Cartesian3,
  ShadowMode,
  Transforms,
  type Matrix4,
} from "cesium"
import { folder } from "leva"

type PrimitiveWithLevaProps = Omit<
  PrimitiveProps,
  "show" | "shadows" | "debugShowBoundingVolume" | "cull" | "modelMatrix"
> & {
  modelMatrix?: Matrix4
}

/**
 * PrimitiveWithLeva
 * - 用 Leva 控制 Primitive 关键属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const PrimitiveWithLeva = ({
  modelMatrix: modelMatrixProp,
  ...props
}: PrimitiveWithLevaProps) => {
  const params = useLevaControls({
    name: "Primitive 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          cull: { label: "剔除 cull", value: true },
          debugShowBoundingVolume: {
            label: "显示包围体",
            value: false,
          },
          shadows: {
            label: "阴影 shadows",
            options: ShadowMode,
            value: ShadowMode.DISABLED,
          },
        },
        { collapsed: false }
      ),

      transform: folder(
        {
          useCustomMatrix: {
            label: "启用自定义 modelMatrix",
            value: false,
          },
          lng: {
            label: "中心经度",
            value: 116.395102,
            step: 0.00001,
          },
          lat: {
            label: "中心纬度",
            value: 39.868458,
            step: 0.00001,
          },
          height: {
            label: "中心高度",
            value: 0,
            step: 100,
          },
        },
        { collapsed: true }
      ),
    },
  })

  const modelMatrix = useMemo(() => {
    if (!params.useCustomMatrix) return modelMatrixProp
    const center = Cartesian3.fromDegrees(
      params.lng,
      params.lat,
      params.height
    )
    return Transforms.eastNorthUpToFixedFrame(center)
  }, [
    params.useCustomMatrix,
    params.lng,
    params.lat,
    params.height,
    modelMatrixProp,
  ])

  return (
    <Primitive
      {...props}
      show={params.show}
      cull={params.cull}
      debugShowBoundingVolume={params.debugShowBoundingVolume}
      shadows={params.shadows as ShadowMode}
      modelMatrix={modelMatrix}
    />
  )
}

export default memo(PrimitiveWithLeva)
