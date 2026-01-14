import { memo, useMemo, type PropsWithChildren } from "react"
import { BillboardCollection, type BillboardCollectionProps } from "resium"
import { Cartesian3, Transforms, BlendOption } from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

type BillboardCollectionWithLevaProps = PropsWithChildren<
  Omit<
    BillboardCollectionProps,
    "show" | "debugShowBoundingVolume" | "debugShowTextureAtlas" | "modelMatrix" | "blendOption"
  >
>

const BillboardCollectionWithLeva = ({ children, ...props }: BillboardCollectionWithLevaProps) => {
  const params = useLevaControls({
    name: "BillboardCollection 控制",
    schema: {
      display: folder({
        show: { label: "显示 show", value: true },
        debugShowBoundingVolume: { label: "显示边界体 debug", value: false },
        debugShowTextureAtlas: { label: "显示纹理图集 debug", value: false },
      }),
      transform: folder({
        useCustomMatrix: {
          label: "启用自定义 modelMatrix",
          value: false,
        },
        lng: {
          label: "中心经度",
          value: 0,
          step: 0.0001,
        },
        lat: {
          label: "中心纬度",
          value: 0,
          step: 0.0001,
        },
        height: {
          label: "中心高度",
          value: 0,
          step: 10,
        },
      }),
      blend: folder({
        blendOption: {
          label: "blendOption【混合模式】",
          value: BlendOption.OPAQUE_AND_TRANSLUCENT, // 使用枚举值而非字符串
          options: {
            OPAQUE: BlendOption.OPAQUE,
            TRANSLUCENT: BlendOption.TRANSLUCENT,
            OPAQUE_AND_TRANSLUCENT: BlendOption.OPAQUE_AND_TRANSLUCENT,
          },
        },
      }),
    },
  })

  // 自定义 modelMatrix
  const modelMatrix = useMemo(() => {
    if (!params.useCustomMatrix) return undefined

    const center = Cartesian3.fromDegrees(params.lng, params.lat, params.height)
    return Transforms.eastNorthUpToFixedFrame(center)
  }, [params.useCustomMatrix, params.lng, params.lat, params.height])

  return (
    <BillboardCollection
      {...props}
      show={params.show}
      debugShowBoundingVolume={params.debugShowBoundingVolume}
      debugShowTextureAtlas={params.debugShowTextureAtlas}
      blendOption={params.blendOption} // 使用 Leva 控制的枚举值
      modelMatrix={modelMatrix}
    >
      {children}
    </BillboardCollection>
  )
}

export default memo(BillboardCollectionWithLeva)
