import { memo, useCallback, useEffect, useState } from "react"
import { transform } from "../utils/threeDTiles/translateTileset"
import { useControls } from "leva"
import { Cesium3DTileset } from "resium"
import * as Cesium from "cesium";
function Tileset({ cesiumRef, url, enableDebug = false }) {

    const [tile, setTile] = useState(null)
    const [params, setParams] = useState({
        lng: 116.367831, // {"lng":116.3678310000003}
        lat: 39.907968, // {"lat":39.907968000000146}
        rotateZ: 1.81, //{"rotateZ":1.81999999999999}
        scale: 0.964, // {"scale":0.964}
    })

    useEffect(() => {
        if (!tile) return
        transform(tile, { lng: params.lng, lat: params.lat }, { z: params.rotateZ }, params.scale)
    }, [params])

    const handleChange = useCallback((value, path) => {
        setParams((prevParams) => {
            const tempObj = {
                ...prevParams,
                [path]: value
            };
            return tempObj;
        });
    }, []);

    enableDebug && useControls({
        lng: {
            value: params.lng,
            step: 0.00001,
            onChange: handleChange,
            transient: true
        },
        lat: {
            value: params.lat,
            step: 0.00001,
            onChange: handleChange,
            transient: true
        },
        rotateZ: {
            value: params.rotateZ,
            step: 0.01,
            onChange: handleChange,
            transient: true
        },
        scale: {
            value: params.scale,
            step: 0.001,
            onChange: handleChange,
            transient: true
        },
    })

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

                const viewer = cesiumRef.current.getViewer()
                viewer?.zoomTo(tileset, {
                    heading: Cesium.Math.toRadians(0), // 偏航
                    pitch: Cesium.Math.toRadians(-60), // 俯仰
                    range: 3000 << 1 // 高度
                })

            }}
        />
    )
}
export default memo(Tileset)