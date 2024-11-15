import { memo, useCallback, useEffect, useState } from "react"
import { transform } from "../utils/threeDTiles/translateTileset"
import { useControls } from "leva"
import { Cesium3DTileset } from "resium"
import * as Cesium from "cesium";
function Tileset({ cesiumRef, url, enableDebug = false }) {

    const [tile, setTile] = useState(null)
    const [params, setParams] = useState({
        lon: 116.367211,
        lat: 39.907738,
        rotateZ: 1.7
    })

    useEffect(() => {
        if (!tile) return
        transform(tile, params)
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
        lon: {
            value: params.lon,
            step: 0.0001,
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
            step: 0.1,
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
                console.log(tileset);

                transform(tileset, params)

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