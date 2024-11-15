import {
  Billboard, BillboardCollection,
  BillboardGraphics,
  Cesium3DTileset,
  CesiumContext,
  Entity,
  Model,
  type CesiumComponentRef,
} from "resium";
import {
  Cartesian3,
  Color,
  Math,
  Matrix4,
  Transforms,
  type Viewer
} from "cesium";
import * as Cesium from "cesium"
import { memo, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState, type FC, } from "react";
import Image from "./assets/images/wpjl-ly.png";
import BaseResuim, { type BaseResiumRef } from "./components/BaseResium";
import Test from "./components/Test";
import { transform, setPosition } from "./utils/threeDTiles/translateTileset";
import { error } from "console";
import { useControls } from "leva";
import { Tileset } from "./models/Tileset";
import "./App.css"

const App = function () {
  const cesiumRef = useRef<BaseResiumRef>(null)

  return (
    <>
      <BaseResuim ref={cesiumRef}>
        {/* <Test />
        <Entity position={Cartesian3.fromDegrees(116.398312, 39.907038, 100)}>
          <BillboardGraphics color={Color.WHITESMOKE} image={Image} />
        </Entity>
        <Model
          url={"/lambo.glb"}
          modelMatrix={Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(116.368312, 39.907038, 100))}
          minimumPixelSize={100}
          maximumScale={1}
        />

        <BillboardCollection
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
        </BillboardCollection> */}
        <Tileset cesiumRef={cesiumRef} />
      </BaseResuim>
    </>
  )
}

export default App