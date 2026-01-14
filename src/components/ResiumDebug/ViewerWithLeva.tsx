import { forwardRef, useMemo, useRef, type PropsWithChildren } from "react"
import { Viewer, type ViewerProps, type CesiumComponentRef } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"
import { MapMode2D, SceneMode, ShadowMode, Viewer as CesiumViewer } from "cesium"

type ViewerWithLevaProps = PropsWithChildren<
  ViewerProps & {
    /** 是否启用 Leva 调试面板 */
    enableDebug?: boolean
  }
>

/**
 * 使用 Leva 控制面板包装的 Viewer 组件
 * - 将常用 UI 开关（infoBox / geocoder 等）和帧率暴露到调试面板
 * - 其余 props 透传给原始 Viewer
 */
const ViewerWithLeva = forwardRef<CesiumComponentRef<CesiumViewer>, ViewerWithLevaProps>(function ViewerWithLeva(
  {
    enableDebug = false,
    children,
    ...viewerProps
  },
  ref,
) {
  const params = useLevaControls(
    {
      name: "Viewer",
      schema: {
        ui: folder({
          infoBox: {
            label: "infoBox【信息框】",
            value: false,
          },
          geocoder: {
            label: "geocoder【地名查找】",
            value: false,
          },
          homeButton: {
            label: "homeButton【Home 按钮】",
            value: false,
          },
          sceneModePicker: {
            label: "sceneModePicker【视图模式切换】",
            value: false,
          },
          baseLayerPicker: {
            label: "baseLayerPicker【底图选择器】",
            value: false,
          },
          navigationHelpButton: {
            label: "navigationHelpButton【导航帮助】",
            value: false,
          },
          navigationInstructionsInitiallyVisible: {
            label: "navigationInstructionsInitiallyVisible【导航说明初始可见】",
            value: false,
          },
          fullscreenButton: {
            label: "fullscreenButton【全屏按钮】",
            value: false,
          },
          vrButton: {
            label: "vrButton【VR 按钮】",
            value: false,
          },
          animation: {
            label: "animation【动画】",
            value: false,
          },
          timeline: {
            label: "timeline【时间线】",
            value: false,
          },
          selectionIndicator: {
            label: "selectionIndicator【选择指示器】",
            value: false,
          },
          projectionPicker: {
            label: "projectionPicker【投影选择器】",
            value: false,
          },
        }),
        render: folder({
          targetFrameRate: {
            label: "targetFrameRate【目标帧率】",
            value: 60,
            min: 1,
            max: 120,
            step: 1,
          },
          useDefaultRenderLoop: {
            label: "useDefaultRenderLoop【默认渲染循环】",
            value: true,
          },
          resolutionScale: {
            label: "resolutionScale【分辨率缩放】",
            value: 1,
            min: 0.1,
            max: 2,
            step: 0.1,
          },
          useBrowserRecommendedResolution: {
            label: "useBrowserRecommendedResolution【使用浏览器推荐分辨率】",
            value: true,
          },
          requestRenderMode: {
            label: "requestRenderMode【请求渲染模式】",
            value: false,
          },
          maximumRenderTimeChange: {
            label: "maximumRenderTimeChange【最大渲染时间变化】",
            value: 0,
            min: 0,
            step: 0.1,
          },
          showRenderLoopErrors: {
            label: "showRenderLoopErrors【显示渲染循环错误】",
            value: true,
          },
          msaaSamples: {
            label: "msaaSamples【MSAA 样本数】",
            value: 1,
            min: 1,
            max: 8,
            step: 1,
          },
        }),
        scene: folder({
          sceneMode: {
            label: "sceneMode【场景模式】",
            value: SceneMode.SCENE3D,
            options: {
              SCENE3D: SceneMode.SCENE3D,
              SCENE2D: SceneMode.SCENE2D,
              COLUMBUS_VIEW: SceneMode.COLUMBUS_VIEW,
            },
          },
          mapMode2D: {
            label: "mapMode2D【2D 地图模式】",
            value: MapMode2D.INFINITE_SCROLL,
            options: {
              INFINITE_SCROLL: MapMode2D.INFINITE_SCROLL,
              ROTATE: MapMode2D.ROTATE,
            },
          },
          scene3DOnly: {
            label: "scene3DOnly【仅 3D 场景】",
            value: false,
          },
          shouldAnimate: {
            label: "shouldAnimate【是否启用动画】",
            value: false,
          },
          orderIndependentTranslucency: {
            label: "orderIndependentTranslucency【无序透明度】",
            value: true,
          },
          depthPlaneEllipsoidOffset: {
            label: "depthPlaneEllipsoidOffset【深度平面椭球偏移】",
            value: 0,
            step: 1,
          },
          automaticallyTrackDataSourceClocks: {
            label: "automaticallyTrackDataSourceClocks【自动追踪数据源时钟】",
            value: true,
          },
          allowDataSourcesToSuspendAnimation: {
            label: "allowDataSourcesToSuspendAnimation【允许数据源暂停动画】",
            value: true,
          },
          blurActiveElementOnCanvasFocus: {
            label: "blurActiveElementOnCanvasFocus【Canvas 失焦模糊】",
            value: true,
          },
        }),
        shadows: folder({
          shadows: {
            label: "shadows【阴影】",
            value: false,
          },
          terrainShadows: {
            label: "terrainShadows【地形阴影】",
            value: ShadowMode.DISABLED,
            options: {
              DISABLED: ShadowMode.DISABLED,
              ENABLED: ShadowMode.ENABLED,
              CAST_ONLY: ShadowMode.CAST_ONLY,
              RECEIVE_ONLY: ShadowMode.RECEIVE_ONLY,
            },
          },
        }),
        baseLayer: folder({
          disableBaseLayer: { label: "baseLayer【底图】", value: false },
        }),
      },
      folderSettings: { collapsed: !enableDebug },
    },
  )

  const baseLayer = params.disableBaseLayer ? (false as const) : undefined

  // 使用 useMemo 稳定 props 对象，避免每次渲染都创建新对象
  const stableProps = useMemo(() => ({
    infoBox: params.infoBox,
    geocoder: params.geocoder,
    homeButton: params.homeButton,
    sceneModePicker: params.sceneModePicker,
    baseLayerPicker: params.baseLayerPicker,
    navigationHelpButton: params.navigationHelpButton,
    navigationInstructionsInitiallyVisible: params.navigationInstructionsInitiallyVisible,
    fullscreenButton: params.fullscreenButton,
    vrButton: params.vrButton,
    animation: params.animation,
    timeline: params.timeline,
    selectionIndicator: params.selectionIndicator,
    projectionPicker: params.projectionPicker,
    sceneMode: params.sceneMode,
    mapMode2D: params.mapMode2D,
    scene3DOnly: params.scene3DOnly,
    shouldAnimate: params.shouldAnimate,
    orderIndependentTranslucency: params.orderIndependentTranslucency,
    showRenderLoopErrors: params.showRenderLoopErrors,
    automaticallyTrackDataSourceClocks: params.automaticallyTrackDataSourceClocks,
    blurActiveElementOnCanvasFocus: params.blurActiveElementOnCanvasFocus,
    requestRenderMode: params.requestRenderMode,
    maximumRenderTimeChange: params.maximumRenderTimeChange,
    depthPlaneEllipsoidOffset: params.depthPlaneEllipsoidOffset,
    msaaSamples: params.msaaSamples,
    baseLayer,
  }), [
    params.infoBox,
    params.geocoder,
    params.homeButton,
    params.sceneModePicker,
    params.baseLayerPicker,
    params.navigationHelpButton,
    params.navigationInstructionsInitiallyVisible,
    params.fullscreenButton,
    params.vrButton,
    params.animation,
    params.timeline,
    params.selectionIndicator,
    params.projectionPicker,
    params.sceneMode,
    params.mapMode2D,
    params.scene3DOnly,
    params.shouldAnimate,
    params.orderIndependentTranslucency,
    params.showRenderLoopErrors,
    params.automaticallyTrackDataSourceClocks,
    params.blurActiveElementOnCanvasFocus,
    params.requestRenderMode,
    params.maximumRenderTimeChange,
    params.depthPlaneEllipsoidOffset,
    params.msaaSamples,
    baseLayer,
  ])
  const initialPropsRef = useRef(stableProps)
  const viewerKey = useMemo(() => {
    return [
      params.infoBox,
      params.geocoder,
      params.homeButton,
      params.sceneModePicker,
      params.baseLayerPicker,
      params.navigationHelpButton,
      params.navigationInstructionsInitiallyVisible,
      params.fullscreenButton,
      params.vrButton,
      params.animation,
      params.timeline,
      params.selectionIndicator,
      params.projectionPicker,
      params.sceneMode,
      params.mapMode2D,
      params.scene3DOnly,
      params.shouldAnimate,
      params.orderIndependentTranslucency,
      params.showRenderLoopErrors,
      params.automaticallyTrackDataSourceClocks,
      params.blurActiveElementOnCanvasFocus,
      params.requestRenderMode,
      params.maximumRenderTimeChange,
      params.depthPlaneEllipsoidOffset,
      params.msaaSamples,
      params.disableBaseLayer,
    ].join("_")
  }, [
    params.infoBox,
    params.geocoder,
    params.homeButton,
    params.sceneModePicker,
    params.baseLayerPicker,
    params.navigationHelpButton,
    params.navigationInstructionsInitiallyVisible,
    params.fullscreenButton,
    params.vrButton,
    params.animation,
    params.timeline,
    params.selectionIndicator,
    params.projectionPicker,
    params.sceneMode,
    params.mapMode2D,
    params.scene3DOnly,
    params.shouldAnimate,
    params.orderIndependentTranslucency,
    params.showRenderLoopErrors,
    params.automaticallyTrackDataSourceClocks,
    params.blurActiveElementOnCanvasFocus,
    params.requestRenderMode,
    params.maximumRenderTimeChange,
    params.depthPlaneEllipsoidOffset,
    params.msaaSamples,
    params.disableBaseLayer,
  ])
  // Complex Viewer props (baseLayer, clockViewModel, imageryProviderViewModels, skyBox, etc.) remain passthrough-only.
  return (
    <Viewer
      full
      key={viewerKey}
      ref={ref}
      {...viewerProps}
      targetFrameRate={params.targetFrameRate}
      useDefaultRenderLoop={params.useDefaultRenderLoop}
      resolutionScale={params.resolutionScale}
      useBrowserRecommendedResolution={params.useBrowserRecommendedResolution}
      allowDataSourcesToSuspendAnimation={params.allowDataSourcesToSuspendAnimation}
      shadows={params.shadows}
      terrainShadows={params.terrainShadows}
      {...initialPropsRef.current}
    >
      {children}
    </Viewer>
  )
})

export default ViewerWithLeva
