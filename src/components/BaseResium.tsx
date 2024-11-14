import {
    CameraFlyTo,
    CesiumContext,
    Globe,
    ImageryLayer,
    Scene,
    ScreenSpaceCameraController,
    Viewer,
    type CesiumComponentRef
} from "resium";
import {
    CameraEventType,
    Cartesian3,
    Color,
    EllipsoidTerrainProvider,
    UrlTemplateImageryProvider,
    Rectangle,
    type Viewer as CesiuimViewer,
} from "cesium";
import { forwardRef, useImperativeHandle, useMemo, useRef, useState, type ReactNode, } from "react";
import { isDev } from "../utils/common";

type BaseResuimType = {
    children: ReactNode
}

const BaseResuim = forwardRef<CesiumComponentRef<CesiuimViewer>, BaseResuimType>(({ children }, ref) => {

    // 地形瓦片
    const terrainProvider = useMemo(() => new EllipsoidTerrainProvider({}), [])
    // 图形瓦片
    const imageryProvider = useMemo(() => new UrlTemplateImageryProvider({ url: isDev ? 'map/gaodeMap/googleMap/{z}/{x}/{y}.jpg' : 'http://172.18.8.146/map/gaodeMap/googleMap/{z}/{x}/{y}.jpg' }), [])
    // Globe 限制渲染范围
    const cartographicLimitRectangle = useMemo(() => Rectangle.fromDegrees(116.22871, 39.839058, 116.534442, 39.988631), [])

    // 内部的 Dom 引用
    const innerRef = useRef(null)
    // 自定义属性和方法
    useImperativeHandle(ref, () => ({
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
    }))

    const [showCamera, setShowCamera] = useState(true)

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
                cartographicLimitRectangle={cartographicLimitRectangle}
                baseColor={Color.BLACK}
            />
            <Scene backgroundColor={Color.BLACK} />
            <ScreenSpaceCameraController
                minimumZoomDistance={2000 >> 1} // 最小视距
                maximumZoomDistance={2000 << 3.5} // 最大视距
                tiltEventTypes={CameraEventType.RIGHT_DRAG}
                zoomEventTypes={[
                    CameraEventType.MIDDLE_DRAG,
                    CameraEventType.WHEEL,
                    CameraEventType.PINCH,
                ]}
                rotateEventTypes={CameraEventType.LEFT_DRAG}
            />
            {showCamera && <CameraFlyTo destination={Cartesian3.fromDegrees(116.398312, 39.907038, 8000)} duration={0} onComplete={() => setShowCamera(false)} />}
            <ImageryLayer
                imageryProvider={imageryProvider}
            />
            {children}
        </Viewer>
    )
})

export default BaseResuim