import { memo, useEffect, useState, type FC, type MutableRefObject } from "react";
import { Cesium3DTileset } from "resium";
import useLevaControls from "../hooks/useLevaControls";
import type { DefaultControllerProps, PartialWithout } from "../types/Common";
import { transform } from "../utils/threeDTiles/translateTileset";
import type { BaseResiumRef } from "./RootResium";

type TilesetProps = {
  cesiumRef: MutableRefObject<BaseResiumRef>,
  height?: number
  url: string
} & PartialWithout<DefaultControllerProps, 'enableDebug'>

const Tileset: FC<TilesetProps> = ({ url, enableDebug = false, height = 0, controllerName = "Tileset" }) => {

  const [tile, setTile] = useState(null)

  const params = useLevaControls(
    {
      name: `Tileset_${controllerName}`,
      schema: {
        lng: {
          label: 'lng【经度】',
          value: 116.367831,
          step: 0.00001,
        },
        lat: {
          label: 'lat【纬度】',
          value: 39.907968,
          step: 0.00001,
        },
        height: {
          label: 'height【瓦片高度】',
          value: height,
          step: 10
        },
        rotateZ: {
          label: 'rotateZ【绕Z轴旋转角度】',
          value: 1.81,
          step: 0.01,
        },
        scale: {
          label: 'scale【缩放】',
          value: 0.964,
          step: 0.001,
        },
        debugFreezeFrame: {
          label: 'debugFreezeFrame【冻结当前帧】',
          value: false,
        },
        debugColorizeTiles: {
          label: 'debugColorizeTiles【以色彩结构化 Tileset】',
          value: false,
        },
        debugWireframe: {
          label: 'debugWireframe【渲染为线框】',
          value: false,
        },
        debugShowContentBoundingVolume: {
          label: 'debugShowContentBoundingVolume【显示瓦片的包围盒】',
          value: false,
        },
        debugShowViewerRequestVolume: {
          label: 'debugShowViewerRequestVolume【显示视锥体和请求体积】',
          value: false,
        },
        debugShowGeometricError: {
          label: 'debugShowGeometricError【显示瓦片的几何误差】',
          value: false,
        },
        debugShowRenderingStatistics: {
          label: 'debugShowRenderingStatistics【显示渲染统计信息】',
          value: false,
        },
        debugShowMemoryUsage: {
          label: 'debugShowMemoryUsage【显示内存使用情况】',
          value: false,
        },
        debugShowUrl: {
          label: 'debugShowUrl【显示瓦片的 URL】',
          value: false,
        },

      }
    },
    enableDebug
  )


  useEffect(() => {
    if (!tile) return

    transform(tile, { lng: params.lng, lat: params.lat, height: height }, { z: params.rotateZ }, params.scale)
  }, [params, height])

  return (

    <Cesium3DTileset
      url={url}
      onError={err => console.error(err)}
      enablePick
      debugFreezeFrame={params.debugFreezeFrame}
      debugColorizeTiles={params.debugColorizeTiles}
      debugWireframe={params.debugWireframe}
      debugShowContentBoundingVolume={params.debugShowContentBoundingVolume}
      debugShowViewerRequestVolume={params.debugShowViewerRequestVolume}
      debugShowGeometricError={params.debugShowGeometricError}
      debugShowRenderingStatistics={params.debugShowRenderingStatistics}
      debugShowMemoryUsage={params.debugShowMemoryUsage}
      debugShowUrl={params.debugShowUrl}
      onReady={tileset => {
        setTile(tileset)
        transform(tileset, { lng: params.lng, lat: params.lat, height: height }, { z: params.rotateZ }, params.scale)
        let r = tileset.boundingSphere.radius
        if (tileset.boundingSphere.radius > 10000) {
          r = tileset.boundingSphere.radius / 10
        }
      }}
    />
  )
}

export default memo(Tileset)