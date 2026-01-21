import { memo } from "react"
import { LevaPanel } from "leva"
import * as Cesium from "cesium";
import { BrightnessStage, Entity } from "resium"
import { Cartesian3 } from "cesium"
import LevaControlPanel from "@/utils/utilManager/levaControlPanel"
import {
  CameraFlyHomeWithLeva,
  CameraFlyToWithLeva,
  CameraLookAtWithLeva,
  CameraWithLeva,
  ClockWithLeva,
  BoxGraphicsWithLeva,
  CorridorGraphicsWithLeva,
  CustomDataSourceWithLeva,
  CylinderGraphicsWithLeva,
  CzmlDataSourceWithLeva,
  EllipseGraphicsWithLeva,
  EllipsoidGraphicsWithLeva,
  EntityDescriptionWithLeva,
  EntityWithLeva,
  FogWithLeva,
  GlobeWithLeva,
  ImageryLayerCollectionWithLeva,
  ImageryLayerWithLeva,
  LabelCollectionWithLeva,
  LabelGraphicsWithLeva,
  LabelWithLeva,
  ModelGraphicsWithLeva,
  ModelWithLeva,
  MoonWithLeva,
  PathGraphicsWithLeva,
  PlaneGraphicsWithLeva,
  PointGraphicsWithLeva,
  PointPrimitiveCollectionWithLeva,
  PointPrimitiveWithLeva,
  PolygonGraphicsWithLeva,
  PolylineCollectionWithLeva,
  PolylineGraphicsWithLeva,
  PolylineVolumeGraphicsWithLeva,
  PolylineWithLeva,
  RectangleGraphicsWithLeva,
  SceneWithLeva,
  ScreenSpaceCameraControllerWithLeva,
  ScreenSpaceEventHandlerWithLeva,
  ShadowMapWithLeva,
  SkyAtmosphereWithLeva,
  SkyBoxWithLeva,
  SunWithLeva,
  ViewerWithLeva,
  WallGraphicsWithLeva,
} from "@/components/ResiumDebug"
import Cesium3DTilesetWithLeva from "./components/ResiumDebug/Cesium3DTilesetWithLeva"
import { isDev } from "./utils/common"
const BASE_URL = import.meta.env.VITE_BASE_URL

/**
 * ResiumDebugDemo
 * - 演示 /src/components/ResiumDebug 中的 Leva 组件
 */
const ResiumDebugDemo = () => {
  return (
    <>
      <LevaPanel />
      <LevaControlPanel />

      <ViewerWithLeva enableDebug full>
        <SceneWithLeva light={new Cesium.DirectionalLight({
          direction: new Cesium.Cartesian3(
            0.35492591601301104,
            -0.8909182691839401,
            -0.2833588392420772), color: Cesium.Color.WHITE, intensity: 1
        })} />
        <GlobeWithLeva show={true} enableLighting atmosphereLightIntensity={10} dynamicAtmosphereLightingFromSun />
        <SkyAtmosphereWithLeva />
        <SunWithLeva />
        <MoonWithLeva />
        <SkyBoxWithLeva />
        {/* <FogWithLeva /> */}
        <ShadowMapWithLeva />
        {/* <ScreenSpaceCameraControllerWithLeva /> */}
        <ScreenSpaceEventHandlerWithLeva />
        <ImageryLayerCollectionWithLeva />
        <ImageryLayerWithLeva />
        {/* <BrightnessStage brightness={1}/> */}

        <ClockWithLeva />
        <CameraWithLeva />
        <CameraLookAtWithLeva />
        <CameraFlyToWithLeva />
        <CameraFlyHomeWithLeva />
        <Cesium3DTilesetWithLeva name="Wai1" url={"newmodel/Wai1/tileset.json"} useModelMatrix modelLat={39.868458} modelLng={116.395102} modelHeight={1000} />
        <Cesium3DTilesetWithLeva name="Zhong1" url={`${isDev ? 'newmodel' : BASE_URL + '/newmodel/b3dm'}/Zhong1/tileset.json`} />
        <Cesium3DTilesetWithLeva name="Zhong2" url={`${isDev ? 'newmodel' : BASE_URL + '/newmodel/b3dm'}/Zhong2/tileset.json`} />

        <CustomDataSourceWithLeva>
          <EntityWithLeva>
            <PointGraphicsWithLeva />
            <LabelGraphicsWithLeva />
            <EntityDescriptionWithLeva />
          </EntityWithLeva>
        </CustomDataSourceWithLeva>

        <CzmlDataSourceWithLeva />
        <ModelWithLeva />

        {/* <Entity position={Cartesian3.fromDegrees(116.395102, 39.868458, 1000)}>
          <EllipseGraphicsWithLeva />
          <EllipsoidGraphicsWithLeva />
          <BoxGraphicsWithLeva />
          <CylinderGraphicsWithLeva />
          <PlaneGraphicsWithLeva />
          <PointGraphicsWithLeva />
          <LabelGraphicsWithLeva />
          <ModelGraphicsWithLeva />
        </Entity>

        <Entity position={Cartesian3.fromDegrees(116.405102, 39.878458, 0)}>
          <RectangleGraphicsWithLeva />
          <PolygonGraphicsWithLeva />
          <PolylineGraphicsWithLeva />
          <PolylineVolumeGraphicsWithLeva />
          <CorridorGraphicsWithLeva />
          <WallGraphicsWithLeva />
          <PathGraphicsWithLeva />
        </Entity> */}

        <PolylineCollectionWithLeva>
          <PolylineWithLeva />
        </PolylineCollectionWithLeva>

        <LabelCollectionWithLeva>
          <LabelWithLeva />
        </LabelCollectionWithLeva>

        <PointPrimitiveCollectionWithLeva>
          <PointPrimitiveWithLeva />
        </PointPrimitiveCollectionWithLeva>
      </ViewerWithLeva>
    </>
  )
}

export default memo(ResiumDebugDemo)
