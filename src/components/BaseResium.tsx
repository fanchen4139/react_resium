import {
    CameraEventType,
    Cartesian3,
    Color,
    DirectionalLight,
    EllipsoidTerrainProvider,
    Rectangle,
    UrlTemplateImageryProvider,
    type Viewer as CesiuimViewer,
} from "cesium";
import * as Cesium from "cesium";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, type ReactNode } from "react";
import {
    Camera,
    CameraFlyTo,
    CameraLookAt,
    Globe,
    ImageryLayer,
    Primitive,
    Scene,
    ScreenSpaceCameraController,
    Viewer,
    type CesiumComponentRef
} from "resium";
import { isDev } from "../utils/common";
import useLevaControls from "../hooks/useLevaControls";
import type { DefaultControllerProps, PartialWithout, WithChildren } from "../types/Common";
import { folder } from "leva";
import useCesium from "../hooks/useCesium";

type BaseResuimType = WithChildren & PartialWithout<DefaultControllerProps, 'enableDebug'>

export interface BaseResiumRef {
    getViewer: () => CesiuimViewer
}

const BaseResuim = forwardRef<BaseResiumRef, BaseResuimType>(({
    children,
    controllerName = "BaseResium",
    enableDebug = false
}, ref) => {

    // 地形瓦片
    const terrainProvider = useMemo(() => new EllipsoidTerrainProvider({}), [])
    // 图形瓦片
    const imageryProvider = useMemo(() => new UrlTemplateImageryProvider({ url: isDev ? 'map/gaodeMap/googleMap/{z}/{x}/{y}.jpg' : 'http://172.18.8.146/map/gaodeMap/googleMap/{z}/{x}/{y}.jpg' }), [])
    // Globe 限制渲染范围
    const cartographicLimitRectangle = useMemo(() => Rectangle.fromDegrees(116.22871, 39.839058, 116.534442, 39.988631), [])

    // 内部的 Dom 引用
    const innerRef = useRef<CesiumComponentRef<CesiuimViewer>>(null)
    // 自定义属性和方法
    useImperativeHandle(ref, () =>
    ({
        getViewer: () => innerRef.current.cesiumElement
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


    const lightParams = useLevaControls({
        name: 'Scene',
        schema: {
            light: folder({
                direction: {
                    label: 'direction【方向】',
                    value: {
                        x: 4,
                        y: -4,
                        z: 2
                    },
                    step: 0.1
                },
                color: {
                    label: 'color【颜色】',
                    value: {
                        r: 255,
                        g: 255,
                        b: 255,
                        a: 1
                    }
                },
                intensity: {
                    label: 'intensity【强度】',
                    value: 5,
                    step: 0.1
                },
            })
        }
    }, enableDebug)

    const light = useMemo(() => {
        const { x, y, z } = lightParams.direction
        let { r, g, b, a } = lightParams.color
        r /= 255
        g /= 255
        b /= 255

        return new DirectionalLight({
            direction: new Cartesian3(x, y, z),
            color: new Color(r, g, b, a),
            intensity: lightParams.intensity
        })
    }, [lightParams])


    const sceneParams = useLevaControls({
        name: 'Scene',
        schema: {
            debugShowFramesPerSecond: {
                label: 'debugShowFramesPerSecond【显示帧率】',
                value: false
            },
            debugShowFrustumPlanes: {
                label: 'debugShowFrustumPlanes【显示摄像机的视锥体】',
                value: false
            },
            debugShowCommands: {
                label: 'debugShowCommands【显示命令】',
                value: false
            },
            debugShowFrustums: {
                label: 'debugShowFrustums【显示视锥体可视范围】',
                value: false
            },
        }
    }, enableDebug)

    const cameraParams = useLevaControls(
        {
            name: "Scene",
            schema: {
                camera: folder({
                    distinate: folder({
                        lng: {
                            label: 'lng【经度】',
                            value: 116.395102,
                            step: 0.00001
                        },
                        lat: {
                            label: 'lat【纬度】',
                            value: 39.868458,
                            step: 0.00001,
                        },
                    }),
                    orientation: folder({
                        heading: {
                            label: 'heading【偏航(弧度)】',
                            value: -1,
                            step: 0.1
                        },
                        pitch: {
                            label: 'pitch【俯仰(弧度)】',
                            value: -60,
                            step: 0.1,
                        },
                    }),
                })
            }
        },
        true
    )

    const destination = useMemo(() => Cartesian3.fromDegrees(cameraParams.lng, cameraParams.lat, 8000), [cameraParams.lng, cameraParams.lat])
    const orientation = useMemo(() => ({
        heading: Cesium.Math.toRadians(cameraParams.heading), // 偏航
        pitch: Cesium.Math.toRadians(cameraParams.pitch), // 俯仰
        range: 3000 // 高度
    }), [cameraParams.heading, cameraParams.pitch])

    return (
        <Viewer
            ref={innerRef}
            full
            shouldAnimate={true} // 是否动画
            infoBox={false} // 点击要素之后显示的信息
            geocoder={false} // 地名查找控件
            homeButton={false} // Home 按钮
            sceneModePicker={false} // 投影方式控件
            projectionPicker={false} //
            baseLayerPicker={false} // 图层选择器
            skyBox={false} // 天空盒
            skyAtmosphere={false} // 大气层
            navigationHelpButton={false} // 辅助导航按钮
            animation={false} // 动画控件
            timeline={false} // 时间线控件
            fullscreenButton={false} // 全屏按钮
            vrButton={false} // VR按钮
            // @ts-expect-error
            imageryProvider={false} // 取消默认图层
            terrainProvider={terrainProvider} // 地形瓦片
        >

            <Globe
                // maximumScreenSpaceError={10}
                depthTestAgainstTerrain={false}
                enableLighting
                cartographicLimitRectangle={cartographicLimitRectangle}
                baseColor={Color.BLACK}
            />

            <Scene
                light={light}
                debugShowCommands={sceneParams.debugShowCommands}
                // debugShowDepthFrustum
                debugShowFramesPerSecond={sceneParams.debugShowFramesPerSecond}
                debugShowFrustumPlanes={sceneParams.debugShowFrustumPlanes}
                debugShowFrustums={sceneParams.debugShowFrustums}
                msaaSamples={200}
                backgroundColor={Color.BLACK}
            />

            <ScreenSpaceCameraController
                // minimumZoomDistance={2000 >> 1} // 最小视距
                maximumZoomDistance={3000 << 3} // 最大视距
                tiltEventTypes={CameraEventType.RIGHT_DRAG}
                zoomEventTypes={[
                    CameraEventType.MIDDLE_DRAG,
                    CameraEventType.WHEEL,
                    CameraEventType.PINCH,
                ]}
                rotateEventTypes={CameraEventType.LEFT_DRAG}
            />

            <CameraFlyTo
                destination={destination}
                orientation={orientation}
                duration={0}
            />

            <ImageryLayer
                imageryProvider={imageryProvider}
            />

            {children}
        </Viewer>
    )
})

export default BaseResuim