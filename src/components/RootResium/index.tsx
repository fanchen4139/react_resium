import {
  CameraEventType,
  Color,
  EllipsoidTerrainProvider,
  ShadowMode,
  type Viewer as CesiumViewer
} from "cesium";
import { forwardRef, memo, useImperativeHandle, useMemo, useRef } from "react";
import {
  BrightnessStage,
  Fog,
  Globe,
  Moon,
  Scene,
  ScreenSpaceCameraController,
  ScreenSpaceEventHandler,
  SkyAtmosphere,
  SkyBox,
  Sun,
  type CesiumComponentRef,
  type EventProps,
  type RootEventTarget
} from "resium";
import type { DefaultControllerProps, PartialWithout, WithChildren } from "../../types/Common";
import { CameraFlyToWithLeva, ImageryLayerWithLeva, SceneWithLeva, ViewerWithLeva } from "@/components/ResiumDebug";
import Init from "./Init";
import useLevaControls from "@/hooks/useLevaControls";

type RootResiumType = WithChildren & PartialWithout<DefaultControllerProps, 'enableDebug'> & EventProps<RootEventTarget>
export interface BaseResiumRef {
  getViewer: () => CesiumViewer
}

const RootResuim = forwardRef<BaseResiumRef, RootResiumType>(({
  children,
  controllerName = "BaseResium",
  enableDebug = false, // 是否开启调试 UI（Leva）
  onClick
}, ref) => {

  // 地形瓦片提供者
  const terrainProvider = useMemo(() => new EllipsoidTerrainProvider({}), [])

  // 内部的 Dom 引用
  const innerRef = useRef<CesiumComponentRef<CesiumViewer>>(null)

  // 暴露给父组件的实例方法
  useImperativeHandle(ref, () =>
  ({
    getViewer: () => innerRef.current.cesiumElement,
    // focus: () => {
    //     innerRef.current?.focus();
    // },
    // scrollToTop: () => {
    //     innerRef.current?.scrollTo(0, 0);
    // },
    // getInnerText: () => {
    //     return innerRef.current?.innerText;
    // },
    // 还可以定义其他方法或属性
  })
  )

  // 全局场景调试参数（使用 Leva）
  const params = useLevaControls({
    name: 'Scene',
    schema: {
      brightness: {
        label: 'brightness【光照强度】',
        value: 1.3,
        step: 0.01
      }
    }
  }, true)

  return (
    // 使用 ViewerWithLeva，将 Viewer 的 UI 控制暴露给 Leva 调试面板
    <ViewerWithLeva
      ref={innerRef}
      
      full
      shouldAnimate={true} // 是否动画
      selectionIndicator={false} // 关闭选择指示器
      // @ts-expect-error resium 类型中缺少 imageryProvider，但 Cesium Viewer 支持
      imageryProvider={false} // 取消默认图层
      terrainProvider={terrainProvider} // 地形瓦片
      onClick={onClick}
    >
      {/* 雾 */}
      <Fog enabled={true} />
      {/* 太阳 */}
      <Sun show={false} />
      {/* 月亮 */}
      <Moon show={false} />
      {/* 大气层 */}
      <SkyAtmosphere show={true} brightnessShift={0} atmosphereLightIntensity={15} />
      {/* 天空盒 */}
      <SkyBox show={false} />
      {/* 地球 */}
      <Globe
        // backFaceCulling={true} // 背面剔除
        // maximumScreenSpaceError={10}
        shadows={ShadowMode.DISABLED} // 阴影
        depthTestAgainstTerrain={true} // 深度测试
        enableLighting={true} // 启用光照
        undergroundColor={Color.TRANSPARENT}
        baseColor={Color.BLACK} // 基础颜色
      />
      <ScreenSpaceCameraController
        // minimumZoomDistance={2000 >> 1} // 最小视距
        // maximumZoomDistance={3000 << 4} // 最大视距
        tiltEventTypes={CameraEventType.RIGHT_DRAG}
        zoomEventTypes={[
          CameraEventType.MIDDLE_DRAG,
          CameraEventType.WHEEL,
          CameraEventType.PINCH,
        ]}
        rotateEventTypes={CameraEventType.LEFT_DRAG}
      />

      <SceneWithLeva  />

      <CameraFlyToWithLeva  />

      <ImageryLayerWithLeva  />

      <Init />

      {children}
      
      <BrightnessStage brightness={params.brightness} />

    </ViewerWithLeva>
  )
})

export default memo(RootResuim)