import { memo, useEffect, useState, type FC, type MutableRefObject } from "react";
import { Cesium3DTileset } from "resium";
import useLevaControls from "../hooks/useLevaControls";
import type { DefaultControllerProps, PartialWithout } from "../types/Common";
import { transform } from "../utils/threeDTiles/translateTileset";
import type { BaseResiumRef } from "./BaseResium";

type TilesetProps = {
    cesiumRef: MutableRefObject<BaseResiumRef>,
    url: string
} & PartialWithout<DefaultControllerProps, 'enableDebug'>

const Tileset: FC<TilesetProps> = ({ cesiumRef, url, enableDebug = false, controllerName = "Tileset" }) => {

    const [tile, setTile] = useState(null)

    const params = useLevaControls(
        {
            name: controllerName,
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
            }
        },
        enableDebug
    )


    useEffect(() => {
        if (!tile) return
        transform(tile, { lng: params.lng, lat: params.lat }, { z: params.rotateZ }, params.scale)
    }, [params])

    return (

        <Cesium3DTileset
            url={url}
            onError={err => console.error(err)}
            enablePick
            // debugColorizeTiles
            // debugShowBoundingVolume
            // onAllTilesLoad={action("onAllTilesLoad")}
            // onInitialTilesLoad={action("onInitialTilesLoad")}
            // onTileFailed={action("onTileFailed")}
            // onTileLoad={action("onTileLoad")}
            // onTileUnload={action("onTileUnload")}
            onReady={tileset => {
                setTile(tileset)
                transform(tileset, { lng: params.lng, lat: params.lat }, { z: params.rotateZ }, params.scale)

                // const viewer = cesiumRef.current.getViewer()
                // viewer?.zoomTo(tileset, {
                //     heading: Cesium.Math.toRadians(0), // 偏航
                //     pitch: Cesium.Math.toRadians(-60), // 俯仰
                //     range: 3000 << 1 // 高度
                // })

            }}
        />
    )
}
export default memo(Tileset)