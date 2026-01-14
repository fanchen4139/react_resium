import { memo } from "react"
import { Cesium3DTilesetGraphics, type Cesium3DTilesetGraphicsProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"

/**
 * Cesium3DTilesetGraphicsWithLeva
 * 支持 Leva 动态调试 Cesium3DTilesetGraphics 所有属性
 * 需放在 <Entity> 组件内部使用
 */
type Cesium3DTilesetGraphicsWithLevaProps = Omit<
  Cesium3DTilesetGraphicsProps,
  "show" | "uri" | "maximumScreenSpaceError"
>

const Cesium3DTilesetGraphicsWithLeva = ({ ...props }: Cesium3DTilesetGraphicsWithLevaProps) => {
  const params = useLevaControls({
    name: "Cesium3DTilesetGraphics 控制",
    schema: {
      show: { label: "是否显示 show", value: true },
      uri: { label: "Tileset URI【瓦片集 URI】", value: "" },
      maximumScreenSpaceError: {
        label: "最大屏幕空间误差",
        value: 16,
        min: 0,
        step: 1,
      },
    },
  })

  return (
    <Cesium3DTilesetGraphics
      {...props}
      show={params.show}
      uri={params.uri}
      maximumScreenSpaceError={params.maximumScreenSpaceError}
    />
  )
}

export default memo(Cesium3DTilesetGraphicsWithLeva)
