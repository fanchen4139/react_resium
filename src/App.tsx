import {
  Billboard, BillboardCollection,
  BillboardGraphics,
  Cesium3DTileset,
  CesiumContext,
  Entity,
  Model,
  PolygonGraphics,
  Primitive,
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
import Tileset from "./models/Tileset";
import "./App.css"
import WaterPrimitive from "./components/WaterPrimitive";
import waterConfig from "./config/waterConfig";

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
        <Tileset url='newmodel/Nei/tileset.json' cesiumRef={cesiumRef} />
        <Tileset url='newmodel/Wai1/tileset.json' cesiumRef={cesiumRef} />
        <Tileset url='newmodel/zhongnanhaiheliu/tileset.json' cesiumRef={cesiumRef} />
        <Tileset url='newmodel/Wai2/tileset.json' cesiumRef={cesiumRef} />
        <Tileset url='newmodel/Zhong1/tileset.json' cesiumRef={cesiumRef} />
        <Tileset url='newmodel/Zhong2/tileset.json' cesiumRef={cesiumRef} />
        {/* <PolygonGraphics material={} /> */}
        {Object.entries(waterConfig).map(([key, value]) => <WaterPrimitive key={`water_${key}`} name={key} enableDebug polygonHierarchy={value} />)}
      </BaseResuim>
    </>
  )
}

export default App