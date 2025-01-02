import * as Cesium from "cesium";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Entity, Polyline, PolylineCollection, PolylineVolumeGraphics, useCesium, useCesiumComponent, WallGraphics } from "resium";
import "./App.css";
import RootResuim, { type BaseResiumRef } from "./components/RootResium";
import Tileset, { type TilesetRef } from "./components/Tileset";
import WaterPrimitive from "./components/Primitive/Water";
import waterConfig from "./config/waterConfig";
import getCoordinateByPosition from "./utils/cesium/GetCoordinateByPosition";
import { DomContainerByArray } from "./components/Dom/Container";
// import WallPrimitive from "./components/Primitive/Wall";
// import WallFlowUpEntity from "./components/Entity/WallFlowUp";
import WallDemo, { type WallFlowEntityRef } from "./components/Entity/WallFlowEntity";
import WaterDemo from "./components/Primitive/Water/demo";
import LabelList from "./components/Dom/LabelList";
import { isDev } from "@/utils/common";
import WallFlowEntity from "./components/Entity/WallFlowEntity";
import PolylineFlowEntity, { type PolylineFlowEntityRef } from "./components/Entity/PolylineFlowEntity";
import { Cartesian2, Cartesian3, Color, CornerType } from "cesium";
import PolylineVolumeEntity from "./components/Entity/PolylineVolumeEntity";
import { coordinates } from "@/assets/dongxicheng.json";
import PolygonEntity from "./components/Entity/PolygonEntity";
import PathEntity from "./components/Entity/PathEntity";
import { flyToBoundingSphere } from "./utils/cesium/camera";
import { raiseCesium3DTileset } from "./utils/threeDTiles/translateTileset";

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

  let flag = false

  // viewer 的 onClick 事件
  const handleClick = useCallback((e, t) => {
    const viewer = getViewer();

    if (flag) {
      neiRef3.current.drop(viewer, 500)
      neiRef.current.drop(viewer, 500)
      neiRef1.current.drop(viewer, 500)
      neiRef2.current.drop(viewer, 500)
      waiweiRef.current.drop(viewer, 500)
      waiweiPolyRef.current.drop(viewer, 500)
      flyToBoundingSphere(viewer, 116.395102, 39.908458, 4000,)
    } else {
      neiRef3.current.raise(viewer, 500)
      neiRef.current.raise(viewer, 500)
      neiRef1.current.raise(viewer, 500)
      neiRef2.current.raise(viewer, 500)
      waiweiRef.current.raise(viewer, 500)
      waiweiPolyRef.current.raise(viewer, 500)
      flyToBoundingSphere(viewer, 116.395102, 39.908458, 6000,)
    }
    flag = !flag
  }, [])

  const polylineVolumePolygonHierarchy = useMemo(() => coordinates[0], [])

  const [height, setHeight] = useState(0)


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

  const neiRef = useRef<TilesetRef>(null)
  const neiRef1 = useRef<TilesetRef>(null)
  const neiRef2 = useRef<TilesetRef>(null)
  const neiRef3 = useRef<TilesetRef>(null)
  const waiweiRef = useRef<WallFlowEntityRef>(null)
  const waiweiPolyRef = useRef<PolylineFlowEntityRef>(null)

  return (
    <>
      <RootResuim ref={cesiumRef} onClick={handleClick} >

        <Tileset url={`${isDev ? 'newmodel' : 'http://172.18.8.146/newmodel/b3dm'}/Wai1/tileset.json`} cesiumRef={cesiumRef} controllerName="Wai1" />
        <Tileset url={`${isDev ? 'newmodel' : 'http://172.18.8.146/newmodel/b3dm'}/zhongnanhaiheliu/tileset.json`} cesiumRef={cesiumRef} controllerName="zhongnanhaiheliu" />
        <Tileset url={`${isDev ? 'newmodel' : 'http://172.18.8.146/newmodel/b3dm'}/Wai2/tileset.json`} cesiumRef={cesiumRef} controllerName="Wai2" />


        {Object.entries(waterConfig).map(([key, value]) => <WaterPrimitive key={`water_${key}`} controllerName={key} polygonHierarchy={value} />)}

        {/* <LabelList /> */}

        <WallFlowEntity enableDebug={true} />
        <PolylineFlowEntity enableDebug={true} />
        <Entity id="center_area" name="center_area" position={Cesium.Cartesian3.fromDegrees(116.386378, 39.920743, 1000)}>
          <Tileset ref={neiRef} url={`${isDev ? 'newmodel' : 'http://172.18.8.146/newmodel/b3dm'}/Nei/tileset.json`} height={10} cesiumRef={cesiumRef} controllerName="Nei" />
          <Tileset ref={neiRef1} url={`${isDev ? 'newmodel' : 'http://172.18.8.146/newmodel/b3dm'}/Zhong1/tileset.json`} height={20} enableDebug cesiumRef={cesiumRef} controllerName="Zhong1" />
          <Tileset ref={neiRef2} url={`${isDev ? 'newmodel' : 'http://172.18.8.146/newmodel/b3dm'}/Zhong2/tileset.json`} height={20} enableDebug cesiumRef={cesiumRef} controllerName="Zhong2" />
          <PolygonEntity
            ref={neiRef3}
            height={height}
            enableTransformCoordinate
            polygonHierarchy={polylineVolumePolygonHierarchy}
            enableDebug={true}
            defaultParams={{ material: { "color": { "r": 17, "g": 18, "b": 23, "a": 1 } } }} />
          <PolylineFlowEntity
            ref={waiweiPolyRef}
            controllerName="waiwei"
            enableTransformCoordinate
            polygonHierarchy={polylineVolumePolygonHierarchy}
            enableDebug={true}
            defaultParams={{ graphics: { width: 10, height: 1 }, material: { color: { r: 15, g: 32, b: 44, a: 1 } } }}
            customMaterial={new Cesium.ImageMaterialProperty({ image: 'down.jpeg' })} />
          {/* <PolylineVolumeEntity enableTransformCoordinate polygonHierarchy={polylineVolumePolygonHierarchy} enableDebug={true} /> */}
          <WallFlowEntity
            ref={waiweiRef}
            controllerName="waiwei"
            enableTransformCoordinate
            polygonHierarchy={polylineVolumePolygonHierarchy}
            defaultParams={{
              graphics: {
                minimumHeight: -300,
                maximumHeight: 0
              },
              material: {}
            }}
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