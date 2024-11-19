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
import Test from "./components/Test";
import { transform, setPosition } from "./utils/threeDTiles/translateTileset";
import { error } from "console";
import { useControls } from "leva";
import Tileset from "./models/Tileset";
import "./App.css"
import WaterPrimitive from "./components/WaterPrimitive";
import waterConfig from "./config/waterConfig";

const App = function () {
  const cesiumRef = useRef<BaseResiumRef>(null)
  const WaterMaterrial = useMemo(() => new Cesium.Material({
    fabric: {
      type: "Water",
      uniforms: {
        // baseWaterColor: Cesium.Color.RED, // 水的颜色
        // blendColor: Cesium.Color.DARKBLUE // 从水到非水区域混合时使用的rgba颜色
        // specularMap: "", // 一张黑白图用来作为标识哪里是用水来渲染的贴图，如果不指定，则代表使用该material的primitive区域全部都是水，如果指定全黑色的图，则表示该区域没有水，如果是灰色的，则代表水的透明度，这里一般是指定都是要么有水，要么没有水，而且对于不是矩形的primitive区域，最好定义全是白色，不然很难绘制出一张贴图正好能保证需要的地方有水，不需要的地方没有水
        normalMap: Cesium.buildModuleUrl('Assets/Textures/waterNormals.jpg'), // 用来生成起伏效果的法线贴图
        frequency: 10000.0, // 水浪的波动
        animationSpeed: 0.01, // 水波振幅
        amplitude: 10, // 水流速度
        // specularIntensity: 0.01, // 镜面反射强度
      }
    }
  }), [])
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
        {Object.values(waterConfig).map(item => <WaterPrimitive polygonHierarchy={item} />)}
      </BaseResuim>
    </>
  )
}

export default App