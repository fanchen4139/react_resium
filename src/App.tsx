import * as Cesium from "cesium";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BillboardGraphics, Cesium3DTileset, Clock, Entity, Polyline, PolylineCollection, PolylineVolumeGraphics, useCesium, useCesiumComponent, WallGraphics } from "resium";
import "./App.css";
import RootResuim, { type BaseResiumRef } from "./components/RootResium";
import Tileset, { type TilesetRef } from "./components/Tileset";
import WaterPrimitive from "./components/Primitive/Water";
import waterConfig from "./config/waterConfig";
import getCoordinateByPosition from "./utils/cesium/GetCoordinateByPosition";
import { DomContainerByArray } from "./components/Dom/Container";
// import WallPrimitive from "./components/Primitive/Wall";
// import WallFlowUpEntity from "./components/Entity/WallFlowUp";
import WallDemo, { type WallFlowEntityRef } from "./components/Entities/WallFlowEntity";
import WaterDemo from "./components/Primitive/Water/demo";
import LabelList from "./components/Dom/LabelList";
import { isDev } from "@/utils/common";
import WallFlowEntity from "./components/Entities/WallFlowEntity";
import PolylineFlowEntity, { type PolylineFlowEntityRef } from "./components/Entities/PolylineFlowEntity";
import { Cartesian2, Cartesian3, Color, CornerType } from "cesium";
import PolylineVolumeEntity from "./components/Entities/PolylineVolumeEntity";
import { coordinates } from "@/assets/dongxicheng.json";
import PolygonEntity from "./components/Entities/PolygonEntity";
import PathEntity from "./components/Entities/PathEntity";
import { flyToBoundingSphere } from "./utils/cesium/camera";
import { raiseCesium3DTileset } from "./utils/threeDTiles/translateTileset";
import { calDrawLinesDemo } from "./components/Utils/CalDrawLInesDemo";
import LevaControlPanel from "./utils/utilManager/levaControlPanel";
import LevaControlPanelDemo from "@/levaControlsDemo/LevaControlPanel";
import { LevaPanel } from "leva";
import { createGrowthShader } from "./engine/Source/Scene/Shader/GrowthShader";
import { GrowthWithParticles } from "./utils/GrowthController";
const BASE_URL = import.meta.env.VITE_BASE_URL
import { useLevaControlsWithVisibility } from "@/levaControlsDemo/useLevaControlsWithVisibility";


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
        // calDrawLinesDemo(getViewer(), 'line')
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
    const camera = viewer.camera
    const cartesian = camera.pickEllipsoid(e.position);
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);

    const zoomLevel = 14;
    // const tilingScheme = cesiumRef.current.getTilingSchema()
    // Convert the cartographic coordinates to tile coordinates
    // const tileCoords = tilingScheme.positionToTileXY(cartographic, zoomLevel);
    // console.log(`Tile Coordinates at Level ${zoomLevel}: X=${tileCoords.x}, Y=${tileCoords.y}`);
    // console.log(getCoordinateByPosition(e.position, viewer.camera));


    // if (flag) {
    //   neiRef3.current.drop(viewer, 500)
    //   neiRef.current.drop(viewer, 500)
    //   neiRef1.current.drop(viewer, 500)
    //   neiRef2.current.drop(viewer, 500)
    //   waiweiRef.current.drop(viewer, 500)
    //   waiweiPolyRef.current.drop(viewer, 500)
    //   flyToBoundingSphere(viewer, 116.39118, 39.910345, 2000,)
    // } else {
    //   neiRef3.current.raise(viewer, 500)
    //   neiRef.current.raise(viewer, 500)
    //   neiRef1.current.raise(viewer, 500)
    //   neiRef2.current.raise(viewer, 500)
    //   waiweiRef.current.raise(viewer, 500)
    //   waiweiPolyRef.current.raise(viewer, 500)
    //   flyToBoundingSphere(viewer, 116.39118, 39.910345, 6000,)
    // }
    // flag = !flag
  }, [])

  // 中心区域范围点的范围
  const polylineVolumePolygonHierarchy = useMemo(() => coordinates[0], [])

  const neiRef = useRef<TilesetRef>(null)
  const neiRef1 = useRef<TilesetRef>(null)
  const neiRef2 = useRef<TilesetRef>(null)
  const neiRef3 = useRef<TilesetRef>(null)
  const waiweiRef = useRef<WallFlowEntityRef>(null)
  const waiweiPolyRef = useRef<PolylineFlowEntityRef>(null)


  const [opacity, setOpacity] = useState(1); // 路灯初始透明度
  const planeRef = useRef(null); // 用于获取 Cesium 元素
  // const opacityRef = useRef(opacity); // 用于保存最新的 opacity 值

  // useEffect(() => {

  //   // 设置一个定时器模拟路灯闪烁效果
  //   const intervalId = setInterval(() => {
  //     setOpacity((prevOpacity) => {
  //       const newOpacity = prevOpacity === 1 ? 0 : 1;
  //       opacityRef.current = newOpacity; // 更新 opacityRef
  //       return newOpacity;
  //     });

  //     // 使用最新的 opacity 值来设置 Cesium 的透明度
  //     if (planeRef.current && planeRef.current.cesiumElement) {
  //       planeRef.current.cesiumElement.color = new Cesium.CallbackProperty(() => {
  //         return Cesium.Color.WHITE.withAlpha(opacityRef.current); // 使用 ref 中的值
  //       }, false);
  //     }
  //   }, 500); // 每500ms切换一次透明度

  //   // 清理定时器
  //   return () => clearInterval(intervalId);
  // }, []);
  const shader = useMemo(() => createGrowthShader(1200), [])

  const [tileset, setTileset] = useState<Cesium.Cesium3DTileset>(null)
  return (
    <>
      <LevaPanel />
      <LevaControlPanel />
      {/* <LevaControlPanelDemo /> */}
      <RootResuim ref={cesiumRef} onClick={handleClick} enableDebug>
        <div style={{ position: "fixed", top: 0, left: 200, zIndex: 99999 }}>123</div>

        <Clock
          startTime={Cesium.JulianDate.now()}
          currentTime={Cesium.JulianDate.now()}
          stopTime={Cesium.JulianDate.addSeconds(
            Cesium.JulianDate.now(),
            30,
            new Cesium.JulianDate()
          )}
          clockRange={Cesium.ClockRange.CLAMPED}
          clockStep={Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER}
          multiplier={1}
        />


        <Cesium3DTileset
          url={'newmodel/Wai1/tileset.json'}
          onReady={(tileset) => {
            tileset.customShader = shader;
            setTimeout(() => {
              
              tileset.customShader = new Cesium.CustomShader({
                uniforms: {
                  u_height: {
                    type: Cesium.UniformType.FLOAT,
                    value: 0,
                  },
                  u_maxHeight: {
                    type: Cesium.UniformType.FLOAT,
                    value: 1200,
                  }, 
                },

                fragmentShaderText: `
                  void fragmentMain(
                    FragmentInput fsInput,
                    inout czm_modelMaterial material
                  ) {
                      float h = fsInput.attributes.positionMC.z;

                      // ====== 可调速度 ======
                      float speed = 0.2;

                      // 当前可见高度 = 1200 - 时间流逝
                      float visibleHeight = 2400.0 - u_height;

                      // 限制范围：0 ~ 1200
                      visibleHeight = clamp(visibleHeight, 0.0, 1200.0);

                      // 超出当前可见高度 → 裁剪
                      if (visibleHeight > 0.0) {
                          discard;
                      }

                      // 边缘高亮（可选）
                      float edge = smoothstep(visibleHeight - 1.0, visibleHeight, h);
                      material.emissive += vec3(1.0, 0.8, 0.3) * edge * 0.4;
                  }
                `,
              });
            }, 30000);
            setTileset(tileset);
          }}
        />

        {tileset && (
          <GrowthWithParticles
            shader={shader}
            maxHeight={1200}
          />
        )}


        {/* <Tileset url={`${isDev ? 'newmodel' : BASE_URL + '/newmodel/b3dm'}/Wai1/tileset.json`} cesiumRef={cesiumRef} controllerName="Wai1" />  */}
        {/* <Tileset url={`${isDev ? 'newmodel' : BASE_URL + '/newmodel/b3dm'}/zhongnanhaiheliu/tileset.json`} cesiumRef={cesiumRef} controllerName="zhongnanhaiheliu" /> */}
        {/* <Tileset url={`${isDev ? 'newmodel' : BASE_URL + '/newmodel/b3dm'}/Wai2/tileset.json`} cesiumRef={cesiumRef} controllerName="Wai2" />  */}


        {Object.entries(waterConfig).map(([key, value]) => <WaterPrimitive key={`water_${key}`} controllerName={key} polygonHierarchy={value} />)}
        {/* {Object.entries(waterConfig).map(([key, value]) => <WaterDemo enableDebug key={`water_${key}`} enableTransformCoordinate controllerName={key} polygonHierarchy={value} />)} */}

        {/* <LabelList /> */}

        <WallFlowEntity controllerName="故宫围墙" enableDebug={true} defaultParams={{ material: { repeat: new Cartesian2(3, 1) }, graphics: {} }} />
        <PolylineFlowEntity enableDebug={true} />
        {/*<Entity id="center_area" name="center_area" position={Cesium.Cartesian3.fromDegrees(116.386378, 39.920743, 1000)}>*/}

        {/*  <Tileset ref={neiRef} url={`${isDev ? 'newmodel' : BASE_URL + '/newmodel/b3dm'}/Nei/tileset.json`} height={10} cesiumRef={cesiumRef} controllerName="Nei" />*/}
        <Tileset ref={neiRef1} url={`${isDev ? 'newmodel' : BASE_URL + '/newmodel/b3dm'}/Zhong1/tileset.json`} height={20} enableDebug cesiumRef={cesiumRef} controllerName="Zhong1" />
        <Tileset ref={neiRef2} url={`${isDev ? 'newmodel' : BASE_URL + '/newmodel/b3dm'}/Zhong2/tileset.json`} height={20} enableDebug cesiumRef={cesiumRef} controllerName="Zhong2" />
        {/*<BillboardGraphics*/}
        {/*ref={planeRef}*/}
        {/*  image="download.png"*/}
        {/*  width={100}*/}
        {/*  height={200} */}
        {/*  color={Cesium.Color.WHITE.withAlpha(1)} // 根据时间更新透明度*/}
        {/*/>*/}
        {/*  <Tileset ref={neiRef} url={`${isDev ? 'newmodel' : BASE_URL + '/newmodel/b3dm'}/Nei/tileset.json`} height={10} cesiumRef={cesiumRef} controllerName="Nei" />*/}
        {/*  <Tileset ref={neiRef1} url={`${isDev ? 'newmodel' : BASE_URL + '/newmodel/b3dm'}/Zhong1/tileset.json`} height={20} enableDebug cesiumRef={cesiumRef} controllerName="Zhong1" />*/}
        {/*  <Tileset ref={neiRef2} url={`${isDev ? 'newmodel' : BASE_URL + '/newmodel/b3dm'}/Zhong2/tileset.json`} height={20} enableDebug cesiumRef={cesiumRef} controllerName="Zhong2" />*/}
        {/*  <PolygonEntity*/}
        {/*    ref={neiRef3}*/}
        {/*    height={0}*/}
        {/*    enableTransformCoordinate*/}
        {/*    polygonHierarchy={polylineVolumePolygonHierarchy}*/}
        {/*    enableDebug={true}*/}
        {/*    defaultParams={{ material: { "color": { "r": 17, "g": 18, "b": 23, "a": 1 } } }} />*/}
        {/*  <PolylineFlowEntity*/}
        {/*    ref={waiweiPolyRef}*/}
        {/*    controllerName="waiwei"*/}
        {/*    enableTransformCoordinate*/}
        {/*    polygonHierarchy={polylineVolumePolygonHierarchy}*/}
        {/*    enableDebug={true}*/}
        {/*    defaultParams={{ graphics: { width: 10, height: 1 }, material: { color: { r: 15, g: 32, b: 44, a: 1 } } }}*/}
        {/*    customMaterial={new Cesium.ImageMaterialProperty({ image: 'down.jpeg' })} />*/}
        {/*  /!* <PolylineVolumeEntity enableTransformCoordinate polygonHierarchy={polylineVolumePolygonHierarchy} enableDebug={true} /> *!/*/}
        {/*  /!* <WallFlowEntity*/}
        {/*    ref={waiweiRef}*/}
        {/*    controllerName="waiwei"*/}
        {/*    enableTransformCoordinate*/}
        {/*    polygonHierarchy={polylineVolumePolygonHierarchy}*/}
        {/*    defaultParams={{*/}
        {/*      graphics: {*/}
        {/*        minimumHeight: -300,*/}
        {/*        maximumHeight: 0*/}
        {/*      },*/}
        {/*      material: {*/}
        {/*        speed: 0.1,*/}
        {/*        // repeat: new Cartesian2(50, 1)*/}
        {/*      }*/}
        {/*    }}*/}
        {/*    // customMaterial={new Cesium.ImageMaterialProperty({ image: 'download.png', repeat: new Cartesian2(50, 1) })}*/}
        {/*    enableDebug /> *!/*/}

        {/*  /!* <Entity id={`wall_${'waiwei'}`} position={Cesium.Cartesian3.fromDegrees(116.386378, 39.920743, 0)} >*/}
        {/*    <WallGraphics*/}
        {/*      maximumHeights={maximumHeights}*/}
        {/*      minimumHeights={minimumHeights}*/}
        {/*      positions={Cesium.Cartesian3.fromDegreesArray(degreesArray)}*/}
        {/*      material={material}*/}
        {/*    />*/}
        {/*  </Entity> *!/*/}
        {/*  /!* <PathEntity enableTransformCoordinate polygonHierarchy={polylineVolumePolygonHierarchy} enableDebug /> *!/*/}
        {/*</Entity>*/}
      </RootResuim>
    </>
  )
}

export default App