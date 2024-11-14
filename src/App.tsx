import {
  Billboard, BillboardCollection,
  BillboardGraphics,
  Cesium3DTileset,
  CesiumContext,
  Entity,
  Model,
} from "resium";
import {
  Cartesian3,
  Color,
  Transforms
} from "cesium";
import { memo, useCallback, useContext, useEffect, useMemo, useState, type FC, } from "react";
import Image from "./assets/images/wpjl-ly.png";
import BaseResuim from "./components/BaseResium";
import Test from "./components/Test";


const App = function () {
  const { viewer, scene } = useContext(CesiumContext)

  const [count, setCount] = useState(0);
  useEffect(() => {

    console.log(count % 4);
  }, [count])
  return (
    <>
      <button style={{ position: 'fixed', right: 0, zIndex: 99 }} onClick={() => setCount(count + 1)}>点击</button>
      <BaseResuim>
        <Test />
        <Entity position={Cartesian3.fromDegrees(116.398312, 39.907038, 100)}>
          <BillboardGraphics color={Color.WHITESMOKE} image={Image} />
        </Entity>
        <Model
          url={"/lambo.glb"}
          modelMatrix={Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(116.368312, 39.907038, 100))}
          minimumPixelSize={100}
          maximumScale={1}
        />

        {count % 4 === 0 && <BillboardCollection
          modelMatrix={Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(116.398312, 39.907038, 100))}>
          {(
            [
              [Color.YELLOW, new Cartesian3(1000.0, 0.0, 0.0)],
              [Color.GREEN, new Cartesian3(0.0, 1000.0, 0.0)],
              [Color.CYAN, new Cartesian3(0.0, -1000.0, 1000.0)],
            ] as const
          ).map((p, i) => (
            <Billboard key={i} id={`billboard-${i}`} image={Image} scale={1.1} color={p[0]} position={p[1]} />
          ))}
        </BillboardCollection>}
        <Cesium3DTileset
          url="newmodel/Nei/tileset.json"
          debugColorizeTiles
          debugShowBoundingVolume
          // onAllTilesLoad={action("onAllTilesLoad")}
          // onInitialTilesLoad={action("onInitialTilesLoad")}
          // onTileFailed={action("onTileFailed")}
          // onTileLoad={action("onTileLoad")}
          // onTileUnload={action("onTileUnload")}
          onReady={e => {
            console.trace(e);

            viewer.zoomTo(e)
          }}
        />
      </BaseResuim>
    </>
  )
}

export default App