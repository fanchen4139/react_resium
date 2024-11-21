import { useRef } from "react";
import "./App.css";
import BaseResuim, { type BaseResiumRef } from "./components/BaseResium";
import WaterPrimitive from "./components/WaterPrimitive";
import waterConfig from "./config/waterConfig";
import Tileset from "./models/Tileset";

const App = function () {
  const cesiumRef = useRef<BaseResiumRef>(null)
  return (
    <>
      <BaseResuim ref={cesiumRef} enableDebug>
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
        {Object.entries(waterConfig).map(([key, value]) => <WaterPrimitive key={`water_${key}`} controllerName={key} enableDebug polygonHierarchy={value} />)}
      </BaseResuim>
    </>
  )
}

export default App