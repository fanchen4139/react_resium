import { memo, useMemo } from "react"
import { PointPrimitiveCollection } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Cartesian3,
  BlendOption,
  Transforms,
  type Matrix4,
} from "cesium"
import { folder } from "leva"

/**
 * PointPrimitiveCollectionWithLeva
 * - 用 Leva 控制 PointPrimitiveCollection 属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const PointPrimitiveCollectionWithLeva: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  const params = useLevaControls({
    name: "PointPrimitiveCollection 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          debugShowBoundingVolume: {
            label: "显示包围体 debug",
            value: false,
          },
          blendOption: {
            label: "混合模式 blendOption",
            value: BlendOption.OPAQUE_AND_TRANSLUCENT,
            options: {
              OPAQUE: BlendOption.OPAQUE,
              TRANSLUCENT: BlendOption.TRANSLUCENT,
              OPAQUE_AND_TRANSLUCENT: BlendOption.OPAQUE_AND_TRANSLUCENT,
            },
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

  const modelMatrix: Matrix4 | undefined = useMemo(() => {
    if (!params.useCustomMatrix) return undefined
    const center = Cartesian3.fromDegrees(
      params.lng,
      params.lat,
      params.height
    )
    return Transforms.eastNorthUpToFixedFrame(center)
  }, [params.useCustomMatrix, params.lng, params.lat, params.height])

  return (
    <PointPrimitiveCollection
      show={params.show}
      debugShowBoundingVolume={params.debugShowBoundingVolume}
      blendOption={params.blendOption as BlendOption}
      modelMatrix={modelMatrix}
    >
      {children}
    </PointPrimitiveCollection>
  )
}

export default memo(PointPrimitiveCollectionWithLeva)
