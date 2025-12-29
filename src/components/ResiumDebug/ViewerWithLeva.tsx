import { forwardRef, useMemo, useRef, type PropsWithChildren } from "react"
import { Viewer, type ViewerProps, type CesiumComponentRef } from "resium"
import useLevaControls from "@/hooks/useLevaControls"

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
const ViewerWithLeva = forwardRef<CesiumComponentRef<any>, ViewerWithLevaProps>(function ViewerWithLeva(
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
        fullscreenButton: {
          label: "fullscreenButton【全屏按钮】",
          value: false,
        },
        vrButton: {
          label: "vrButton【VR 按钮】",
          value: false,
        },
        targetFrameRate: {
          label: "targetFrameRate【目标帧率】",
          value: 60,
          min: 1,
          max: 120,
          step: 1,
        },
      },
    },
  )

  // 使用 useMemo 稳定 props 对象，避免每次渲染都创建新对象
  const stableProps = useMemo(() => ({
    infoBox: params.infoBox,
    geocoder: params.geocoder,
    homeButton: params.homeButton,
    sceneModePicker: params.sceneModePicker,
    baseLayerPicker: params.baseLayerPicker,
    navigationHelpButton: params.navigationHelpButton,
    fullscreenButton: params.fullscreenButton,
    vrButton: params.vrButton,
    targetFrameRate: params.targetFrameRate,
  }), [
    params.infoBox,
    params.geocoder,
    params.homeButton,
    params.sceneModePicker,
    params.baseLayerPicker,
    params.navigationHelpButton,
    params.fullscreenButton,
    params.vrButton,
    params.targetFrameRate,
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
      params.fullscreenButton,
      params.vrButton,
    ].join("_")
  }, [
    params.infoBox,
    params.geocoder,
    params.homeButton,
    params.sceneModePicker,
    params.baseLayerPicker,
    params.navigationHelpButton,
    params.fullscreenButton,
    params.vrButton,
  ])
  return (
    <Viewer
      key={viewerKey}
      ref={ref}
      {...viewerProps}
      {...initialPropsRef.current}
    >
      {children}
    </Viewer>
  )
})

export default ViewerWithLeva


