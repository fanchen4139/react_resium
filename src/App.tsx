import * as Cesium from "cesium";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Entity, Polyline, PolylineCollection, PolylineVolumeGraphics, useCesium, useCesiumComponent, WallGraphics } from "resium";
import "./App.css";
import RootResuim, { type BaseResiumRef } from "./components/RootResium";
import Tileset from "./components/Tileset";
import WaterPrimitive from "./components/Primitive/Water";
import waterConfig from "./config/waterConfig";
import getCoordinateByPosition from "./utils/cesium/GetCoordinateByPosition";
import { DomContainerByArray } from "./components/Dom/Container";
// import WallPrimitive from "./components/Primitive/Wall";
// import WallFlowUpEntity from "./components/Entity/WallFlowUp";
import WallDemo from "./components/Entity/WallFlowEntity";
import WaterDemo from "./components/Primitive/Water/demo";
import LabelList from "./components/Dom/LabelList";
import { isDev } from "@/utils/common";
import WallFlowEntity from "./components/Entity/WallFlowEntity";
import PolylineFlowEntity from "./components/Entity/PolylineFlowEntity";
import { Cartesian2, Cartesian3, Color, CornerType } from "cesium";
import PolylineVolumeEntity from "./components/Entity/PolylineVolumeEntity";
import { coordinates } from "@/assets/dongxicheng.json";
import PolygonEntity from "./components/Entity/PolygonEntity";
import PathEntity from "./components/Entity/PathEntity";

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

    // const { camera, scene } = getViewer()
    // const entity = scene.pick(e.position)
    // console.log(entity);

    // // entity.color = Cesium.Color.WHITESMOKE.withAlpha(.5)
    // arr.push(getCoordinateByPosition(e.position, camera))
    // console.log(JSON.stringify(arr, null, 2));
    const viewer = getViewer();

    const wall = viewer.entities.getById('wall_waiwei').wall

    const currentMinimumHeights = wall.minimumHeights.getValue(Cesium.JulianDate.now());
    const currentMaximumHeights = wall.maximumHeights.getValue(Cesium.JulianDate.now());


    // // 更新高度值
    // const updatedMinimumHeights = currentMinimumHeights.map(height => {
    //   console.log(height);
    //   return Math.max(height + 100, 0)

    // });
    // const updatedMaximumHeights = currentMaximumHeights.map((height, index) => {
    //   console.log(height);

    //   return height + 100
    // });

    // // 更新到墙体属性
    // wall.minimumHeights = new Cesium.CallbackProperty(() => updatedMinimumHeights, false);
    // wall.maximumHeights = new Cesium.CallbackProperty(() => updatedMaximumHeights, false);

    // 回调函数
    const updateHeightCallBack = () => {
      // 获取当前的 minimumHeights 和 maximumHeights
      const currentMinimumHeights = wall.minimumHeights.getValue(Cesium.JulianDate.now());
      const currentMaximumHeights = wall.maximumHeights.getValue(Cesium.JulianDate.now());

      // 更新高度值
      const updatedMinimumHeights = currentMinimumHeights.map(height => Math.max(height + 1, 0));
      const updatedMaximumHeights = currentMaximumHeights.map((height, index) => Math.max(updatedMinimumHeights[index], height + 1));

      // 更新到墙体属性
      if (
        updatedMinimumHeights.length === wall.positions.getValue(Cesium.JulianDate.now()).length &&
        updatedMaximumHeights.length === wall.positions.getValue(Cesium.JulianDate.now()).length
      ) {
        wall.minimumHeights = new Cesium.CallbackProperty(() => updatedMinimumHeights, false);
        wall.maximumHeights = new Cesium.CallbackProperty(() => updatedMaximumHeights, false);
      }

    };

    // 添加监听器
    viewer.clock.onTick.addEventListener(updateHeightCallBack);

  }, [])

  const polylineVolumePolygonHierarchy = useMemo(() => coordinates[0], [])

  // const [height, setHeight] = useState(300)

  const defaultParams = useRef({
    graphics: {
      minimumHeight: 100,
      maximumHeight: 300
    },
    material: {}
  })
  const wallRef = useRef(null)


  // 处理坐标
  const degreesArray = polylineVolumePolygonHierarchy.reduce((pre, cur) => {
    pre.push(cur[0], cur[1])
    return pre
  }, [])

  // 墙体最大高度
  const maximumHeights = new Cesium.CallbackProperty(() => coordinates[0].map(_ => 100), false)
  // const maximumHeights = useMemo(() => new Cesium.CallbackProperty(() => coordinates[0].map(_ => 100), false), [])
  // 墙体最小高度
  const minimumHeights = new Cesium.CallbackProperty(() => coordinates[0].map(_ => 300), false)
  // const minimumHeights = useMemo(() => new Cesium.CallbackProperty(() => coordinates[0].map(_ => 300), false), [])

  // 墙体贴图
  const material = useMemo(() => {

    // 默认材质
    return new Cesium.ImageMaterialProperty({ image: 'colors1.png', repeat: new Cartesian2(200, 1) })
  }, [])

  return (
    <>
      <RootResuim ref={cesiumRef} onClick={handleClick} >
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
        <WallDemo enableDebug />
        {/* <WaterDemo enableDebug /> */}
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

        <Tileset url={`${isDev ? 'newmodel' : 'http://172.18.8.146/newmodel/b3dm'}/Wai1/tileset.json`} cesiumRef={cesiumRef} controllerName="Wai1" />
        <Tileset url={`${isDev ? 'newmodel' : 'http://172.18.8.146/newmodel/b3dm'}/zhongnanhaiheliu/tileset.json`} cesiumRef={cesiumRef} controllerName="zhongnanhaiheliu" />
        <Tileset url={`${isDev ? 'newmodel' : 'http://172.18.8.146/newmodel/b3dm'}/Wai2/tileset.json`} cesiumRef={cesiumRef} controllerName="Wai2" />

        {/* <PolygonGraphics material={} /> */}

        {Object.entries(waterConfig).map(([key, value]) => <WaterPrimitive key={`water_${key}`} controllerName={key} polygonHierarchy={value} />)}

        {/* <LabelList /> */}

        <WallFlowEntity enableDebug={true} />
        <PolylineFlowEntity enableDebug={true} />
        {/* <WallFlowUpEntity /> */}
        <Entity id="center_area" name="center_area" position={Cesium.Cartesian3.fromDegrees(116.386378, 39.920743, 1000)}>
          <Tileset url={`${isDev ? 'newmodel' : 'http://172.18.8.146/newmodel/b3dm'}/Nei/tileset.json`} height={300} cesiumRef={cesiumRef} controllerName="Nei" />
          <Tileset url={`${isDev ? 'newmodel' : 'http://172.18.8.146/newmodel/b3dm'}/Zhong1/tileset.json`} enableDebug height={300} cesiumRef={cesiumRef} controllerName="Zhong1" />
          <Tileset url={`${isDev ? 'newmodel' : 'http://172.18.8.146/newmodel/b3dm'}/Zhong2/tileset.json`} enableDebug height={300} cesiumRef={cesiumRef} controllerName="Zhong2" />
          <PolygonEntity
            height={300}
            enableTransformCoordinate
            polygonHierarchy={polylineVolumePolygonHierarchy}
            enableDebug={true}
            defaultParams={{ material: { "color": { "r": 17, "g": 18, "b": 23, "a": 1 } } }} />
          <PolylineFlowEntity
            controllerName="waiwei"
            enableTransformCoordinate
            polygonHierarchy={polylineVolumePolygonHierarchy}
            enableDebug={true}
            defaultParams={{ graphics: { width: 10, height: 300 }, material: {} }}
            customMaterial={new Cesium.ImageMaterialProperty({ image: 'down.jpeg' })} />
          {/* <PolylineVolumeEntity enableTransformCoordinate polygonHierarchy={polylineVolumePolygonHierarchy} enableDebug={true} /> */}
          <WallFlowEntity
            controllerName="waiwei"
            enableTransformCoordinate
            polygonHierarchy={polylineVolumePolygonHierarchy}
            defaultParams={defaultParams.current}
            customMaterial={new Cesium.ImageMaterialProperty({ image: 'down.jpeg', repeat: new Cartesian2(200, 1) })}
            enableDebug />

          {/* <Entity id={`wall_${'waiwei'}`} position={Cesium.Cartesian3.fromDegrees(116.386378, 39.920743, 0)} >
            <WallGraphics
              maximumHeights={maximumHeights}
              minimumHeights={minimumHeights}
              positions={Cesium.Cartesian3.fromDegreesArray(degreesArray)}
              material={material}
            />
          </Entity> */}
          {/* <PathEntity enableTransformCoordinate polygonHierarchy={polylineVolumePolygonHierarchy} enableDebug /> */}
        </Entity>
      </RootResuim>
    </>
  )
}

export default App