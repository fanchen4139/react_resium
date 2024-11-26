import * as Cesium from "cesium";
import { useCallback, useEffect, useRef, useState } from "react";
import { Entity, Polyline, PolylineCollection, useCesium, useCesiumComponent } from "resium";
import "./App.css";
import RootResuim, { type BaseResiumRef } from "./components/RootResium";
import Tileset from "./components/Tileset";
import WaterPrimitive from "./components/Primitive/Water";
import waterConfig from "./config/waterConfig";
import getCoordinateByPosition from "./utils/cesium/GetCoordinateByPosition";
import { DomContainerByArray } from "./components/Dom/Container";
import WallPrimitive from "./components/Primitive/Wall";
import WallDemo from "./components/Primitive/Wall/demo";
import LabelList from "./components/Dom/LabelList";

const App = function () {
  const cesiumRef = useRef<BaseResiumRef>(null)
  const [viewer, setViewer] = useState<Cesium.Viewer>(null)
  const getViewer = (): Cesium.Viewer => {
    if (!viewer) {
      const viewerRef = cesiumRef.current.getViewer()
      setViewer(viewerRef)
      return viewerRef
    } else {
      return viewer
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (!viewer) {
        getViewer()
      } else {
        clearInterval(interval)
      }
    }, 100);
    return () => {
      clearInterval(interval)
    }
  }, [viewer])

  const arr = []

  // viewer 的 onClick 事件
  const handleClick = useCallback((e, t) => {
    const { camera, scene } = getViewer()
    const entity = scene.pick(e.position)
    entity.color = Cesium.Color.WHITESMOKE.withAlpha(.5)
    // arr.push(getCoordinateByPosition(e.position, camera))
    // console.log(JSON.stringify(arr, null, 2));
  }, [])


  return (
    <>
      <RootResuim ref={cesiumRef} onClick={handleClick}>
        {/* <Test /> */}
        <Entity position={Cesium.Cartesian3.fromDegrees(116.398312, 39.907038, 1000)}>
          {/* <BillboardGraphics color={Color.WHITESMOKE} image={Image} /> */}
        </Entity>
        {/* <WallPrimitive /> */}
        <PolylineCollection modelMatrix={Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(116.398312, 39.907038))}>

          <Polyline width={100} positions={[
            Cesium.Cartesian3.fromDegrees(116.398312, 39.907038, 0),
            Cesium.Cartesian3.fromDegrees(113.408312, 36.907038, 0),
            Cesium.Cartesian3.fromDegrees(117.408312, 31.927038, 0),
          ]} />
        </PolylineCollection>
        <WallDemo />
        {/*<Model
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

        {Object.entries(waterConfig).map(([key, value]) => <WaterPrimitive key={`water_${key}`} controllerName={key} polygonHierarchy={value} />)}

        {/* <LabelList /> */}

      </RootResuim>
    </>
  )
}

export default App