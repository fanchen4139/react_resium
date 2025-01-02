import {
    CameraEventType,
    Cartesian3,
    Color,
    EllipsoidTerrainProvider,
    Rectangle,
    Transforms,
    UrlTemplateImageryProvider,
    type Viewer as CesiuimViewer
} from "cesium";
import { forwardRef, memo, useImperativeHandle, useMemo, useRef } from "react";
import {
    Globe,
    ImageryLayer,
    Polyline,
    PolylineCollection,
    ScreenSpaceCameraController,
    Viewer,
    type CesiumComponentRef,
    type EventProps,
    type RootEventTarget
} from "resium";
import type { DefaultControllerProps, PartialWithout, WithChildren } from "@/types/Common";
import { isDev } from "@/utils/common";
import CameraFlyToWithLeva from "./RootResium/CameraFlyTo";
import SceneWithLeva from "./RootResium/Scene";
import Init from "./RootResium/Init";
import WallFlowMaterialProperty from "@/engine/Source/DataSource/WallMaterialProperty";

type RootResuimType = WithChildren & PartialWithout<DefaultControllerProps, 'enableDebug'> & EventProps<RootEventTarget>
export interface BaseResiumRef {
    getViewer: () => CesiuimViewer
}

const RootResuim = forwardRef<BaseResiumRef, RootResuimType>(({
    children,
    controllerName = "BaseResium",
    enableDebug = false,
    onClick
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
            // imageryProvider={false} // 取消默认图层
            // terrainProvider={terrainProvider} // 地形瓦片
            onClick={onClick}
        >

            <Globe
                // maximumScreenSpaceError={10}
                depthTestAgainstTerrain={false}
                enableLighting
                // cartographicLimitRectangle={cartographicLimitRectangle}
                baseColor={Color.BLACK}
            />

            <ScreenSpaceCameraController
                // minimumZoomDistance={2000 >> 1} // 最小视距
                // maximumZoomDistance={3000 << 3} // 最大视距
                tiltEventTypes={CameraEventType.RIGHT_DRAG}
                zoomEventTypes={[
                    CameraEventType.MIDDLE_DRAG,
                    CameraEventType.WHEEL,
                    CameraEventType.PINCH,
                ]}
                rotateEventTypes={CameraEventType.LEFT_DRAG}
            />

            <SceneWithLeva enableDebug={enableDebug} />

            {/* <CameraFlyToWithLeva enableDebug={enableDebug} /> */}

            {/* <ImageryLayer
          imageryProvider={imageryProvider}
        /> */}

            <Init />

            <PolylineCollection modelMatrix={Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(0, 0))} >
                <Polyline positions={[Cartesian3.ZERO, new Cartesian3(0, 0, 2 << 123)]} width={5} />
                <Polyline positions={[Cartesian3.ZERO, new Cartesian3(2 << 123, 0, 0)]} width={5} />
                <Polyline positions={[Cartesian3.ZERO, new Cartesian3(0, 2 << 123, 0)]} width={5} />
            </PolylineCollection>

            {children}

        </Viewer>
    )
})

export default memo(RootResuim)