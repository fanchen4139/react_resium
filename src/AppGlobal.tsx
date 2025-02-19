import * as Cesium from "cesium";
import { useCallback, useEffect, useRef, useState } from "react";
import { Entity, Polyline, PolylineCollection } from "resium";
import "./App.css";
import RootResuimGlobal, { type BaseResiumRef } from "./components/BaseResiumGlobal";
import PolylineFlowEntity from "./components/Entities/PolylineFlowEntity";
import WallFlowEntity from "./components/Entities/WallFlowEntity";
import WaterPrimitive from "./components/Primitive/Water";
import WaterPrimitiveDemo from "./components/Primitive/Water/demo";
import waterConfig from "./config/waterConfig";
import getCoordinateByPosition from "./utils/cesium/GetCoordinateByPosition";
import { flyToBoundingSphere, flyTo, rotateDown, rotateLeft, rotateRight, rotateUp, zoomIn, zoomOut } from "./utils/cesium/camera";

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
  let counter = 0
  // viewer 的 onClick 事件
  const handleClick = useCallback((e, t) => {
    const viewer = getViewer()
    // const { id: entity } = viewer.scene.pick(e.position)
    // console.log(entity.position.getValue(viewer.clock.currentTime));

    switch (counter++) {
      // case 0:
      //   rotateCameraUp(viewer, 0.1)
      //   break;
      // case 1:
      //   rotateCameraDown(viewer, 0.1)
      //   break;
      // case 2:
      //   rotateCameraLeft(viewer, 0.1)
      //   break;
      // case 3:
      //   rotateCameraRight(viewer, 0.1)
      //   break;
      // case 4:
      //   zoomInCamera(viewer, 0.1)
      //   break;
      // case 5:
      //   zoomOutCamera(viewer, 0.1)
      //   break;
      // case 0:
      //   flyToLocation(viewer, 116.398312, 39.907038, 1000, 0.1, 0.1, 3)
      //   break;
      default:
        flyToBoundingSphere(viewer, 116.395102, 39.908458, 4000)
        // viewer.camera.flyTo({
        //   destination: entity.position.getValue(viewer.clock.currentTime),
        //   orientation: {
        //     heading: Cesium.Math.toRadians(0.0),
        //     pitch: Cesium.Math.toRadians(-30.0),
        //     roll: 0
        //   },
        //   duration: 5
        // })
        // viewer.camera.lookAt(
        //   entity.position.getValue(viewer.clock.currentTime), // 获取Entity的位置
        //   new Cesium.Cartesian3(0.0, 0.0, 500.0) // 设置相机的偏移量
        // );
        // flyToLocation(viewer, 118.398312, 38.907038, 10000, 0.1, 0.1, 3)
        break;
    }
    // entity.color = Cesium.Color.WHITESMOKE.withAlpha(.5)
    // const { longitude, latitude } = getCoordinateByPosition(e.position, camera)
    // arr.push([longitude, latitude])
    // console.log(JSON.stringify(arr, null, 2));
  }, [])

  return (
    <>
      <RootResuimGlobal ref={cesiumRef} enableDebug onClick={handleClick}>
        <WallFlowEntity enableDebug={true} />
        <PolylineFlowEntity enableDebug={true} />
        {/* <WaterDemo/> */}
        {/* <Test /> */}
        <Entity position={Cesium.Cartesian3.fromDegrees(116.398312, 39.907038, 1000)}>
          {/* <BillboardGraphics color={Color.WHITESMOKE} image={Image} /> */}
        </Entity>
        {/* <PolylineCollection modelMatrix={Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(116.398312, 39.907038))}>

          <Polyline width={100} positions={[
            Cesium.Cartesian3.fromDegrees(116.398312, 39.907038, 0),
            Cesium.Cartesian3.fromDegrees(113.408312, 36.907038, 0),
            Cesium.Cartesian3.fromDegrees(117.408312, 31.927038, 0),
          ]} />
        </PolylineCollection> */}
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

        {/* <Tileset url='newmodel/Nei/tileset.json' cesiumRef={cesiumRef} />
        <Tileset url='newmodel/Wai1/tileset.json' cesiumRef={cesiumRef} />
        <Tileset url='newmodel/zhongnanhaiheliu/tileset.json' cesiumRef={cesiumRef} />
        <Tileset url='newmodel/Wai2/tileset.json' cesiumRef={cesiumRef} />
        <Tileset url='newmodel/Zhong1/tileset.json' cesiumRef={cesiumRef} />
        <Tileset url='newmodel/Zhong2/tileset.json' cesiumRef={cesiumRef} /> */}
        {/* <PolygonGraphics material={} /> */}
        {/* {Object.entries(waterConfig).map(([key, value]) => <WaterPrimitive key={`water_${key}`} controllerName={key} polygonHierarchy={value} />)} */}
        {Object.entries(waterConfig).map(([key, value]) => <WaterPrimitiveDemo key={`water_${key}`} controllerName={key} polygonHierarchy={value} />)}
      </RootResuimGlobal>
    </>
  )
}

export default App