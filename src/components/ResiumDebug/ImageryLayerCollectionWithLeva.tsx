import { memo } from "react"
import { ImageryLayerCollection } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * ImageryLayerCollectionWithLeva
 * - 用 Leva 控制 ImageryLayerCollection 事件日志
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const ImageryLayerCollectionWithLeva = () => {
  const params = useLevaControls({
    name: "ImageryLayerCollection 控制",
    schema: {
      events: folder(
        {
          logOnLayerAdd: { label: "打印 layerAdded", value: false },
          logOnLayerMove: { label: "打印 layerMoved", value: false },
          logOnLayerRemove: { label: "打印 layerRemoved", value: false },
          logOnLayerShowOrHide: { label: "打印 layerShownOrHidden", value: false },
        },
        { collapsed: false }
      ),
    },
  })

  return (
    <ImageryLayerCollection
      onLayerAdd={(layer, index) => {
        if (params.logOnLayerAdd) {
          console.log("[ImageryLayerCollection layerAdded]", layer, index)
        }
      }}
      onLayerMove={(layer, index) => {
        if (params.logOnLayerMove) {
          console.log("[ImageryLayerCollection layerMoved]", layer, index)
        }
      }}
      onLayerRemove={(layer, index) => {
        if (params.logOnLayerRemove) {
          console.log("[ImageryLayerCollection layerRemoved]", layer, index)
        }
      }}
      onLayerShowOrHide={(layer, index) => {
        if (params.logOnLayerShowOrHide) {
          console.log("[ImageryLayerCollection layerShownOrHidden]", layer, index)
        }
      }}
    />
  )
}

export default memo(ImageryLayerCollectionWithLeva)
