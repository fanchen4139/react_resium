import * as Cesium from "cesium";
import { useCallback, useEffect, useRef, useState } from "react";
import { Entity, Polyline, PolylineCollection, useCesium, useCesiumComponent } from "resium";
import "./App.css";
import BaseResuim, { type BaseResiumRef } from "./components/BaseResium";
import Tileset from "./components/Tileset";
import WaterPrimitive from "./components/WaterPrimitive";
import waterConfig from "./config/waterConfig";
import getCoordinateByPosition from "./utils/cesium/GetCoordinateByPosition";
import { DomContainerByArray } from "./components/dom/container";
import WallPrimitive from "./components/WallPrimitive";

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
        viewer.scene.postProcessStages.fxaa.enabled = true
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
    arr.push(getCoordinateByPosition(e.position, camera))
    console.log(JSON.stringify(arr, null, 2));
  }, [])

  const [positions, setPositions] = useState<
    { lng: number; lat: number; screenPosition: { x: number; y: number } | null }[]
  >([]);

  useEffect(() => {
    if (!viewer) return
    const points = Array.from({ length: 10 }).map((_, index) => ({
      lng: 116.398312 + index * 0.003,
      lat: 39.907038,
    }));

    const updatePositions = () => {
      const updatedPositions = points.map((point) => {
        const cartesian = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, 10);
        const screenPosition = Cesium.SceneTransforms.worldToWindowCoordinates(viewer.scene, cartesian);
        return {
          ...point,
          screenPosition: screenPosition
            ? { x: screenPosition.x, y: screenPosition.y }
            : null,
        };
      });
      setPositions(updatedPositions);
    };

    viewer.scene.preRender.addEventListener(updatePositions);

    return () => {
      viewer.scene.preRender.removeEventListener(updatePositions);
    };
  }, [viewer]);

  return (
    <>
      <BaseResuim ref={cesiumRef} enableDebug onClick={handleClick}>
        {/* <Test /> */}
        <Entity position={Cesium.Cartesian3.fromDegrees(116.398312, 39.907038, 1000)}>
          {/* <BillboardGraphics color={Color.WHITESMOKE} image={Image} /> */}
        </Entity>
        <WallPrimitive />
        <PolylineCollection modelMatrix={Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(116.398312, 39.907038))}>

          <Polyline width={100} positions={[
            Cesium.Cartesian3.fromDegrees(116.398312, 39.907038, 0),
            Cesium.Cartesian3.fromDegrees(113.408312, 36.907038, 0),
            Cesium.Cartesian3.fromDegrees(117.408312, 31.927038, 0),
          ]} />
        </PolylineCollection>
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

        <Tileset url='newmodel/Nei/tileset.json' enableDebug cesiumRef={cesiumRef} />
        <Tileset url='newmodel/Wai1/tileset.json' cesiumRef={cesiumRef} />
        <Tileset url='newmodel/zhongnanhaiheliu/tileset.json' cesiumRef={cesiumRef} />
        <Tileset url='newmodel/Wai2/tileset.json' cesiumRef={cesiumRef} />
        <Tileset url='newmodel/Zhong1/tileset.json' cesiumRef={cesiumRef} />
        <Tileset url='newmodel/Zhong2/tileset.json' cesiumRef={cesiumRef} />
        {/* <PolygonGraphics material={} /> */}
        {Object.entries(waterConfig).map(([key, value]) => <WaterPrimitive key={`water_${key}`} controllerName={key} polygonHierarchy={value} />)}
        {positions.map((point, index) => (
          <DomContainerByArray key={index} screenPosition={point.screenPosition}>
            <div>测试面板</div>
          </DomContainerByArray>
        ))}
      </BaseResuim>
    </>
  )
}

export default App