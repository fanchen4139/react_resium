import { Primitive } from "resium";
import * as Cesium from "cesium";
import { memo, useMemo, useState } from "react";
import { Leva, useControls } from "leva";
function WaterPrimitive({ enableDebug = false, polygonHierarchy }: { enableDebug?: boolean, polygonHierarchy: Array<number[]> }) {
    const params = useControls({
        frequency: { // 水浪的波动
            value: 40.0,
            step: 1,
        },
        animationSpeed: { // 水波振幅
            value: 0.003,
            step: 0.001,
        },
        amplitude: { // 水流速度
            value: 10,
            step: 1,
        },
        specularIntensity: { // 镜面反射强度
            value: 0.01,
            step: 0.01,
        },
    })

    const degreesArray = polygonHierarchy.reduce((pre, cur) => {
        pre.push(cur[0] - 0.0061, cur[1] - 0.0015)
        return pre
    }, [])


    // 绘制面的几何实体
    const geometryInstances = useMemo(() => new Cesium.GeometryInstance({
        id: 'river',
        geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(degreesArray)),
            height: 1,
            extrudedHeight: 0,
            ellipsoid: Cesium.Ellipsoid.WGS84
        })
    }), [])
    const appearance = useMemo(() => new Cesium.EllipsoidSurfaceAppearance({
        material: new Cesium.Material({
            fabric: {
                type: "Water",
                uniforms: {
                    // 水的颜色
                    // baseWaterColor: Cesium.Color.RED,
                    // 从水到非水区域混合时使用的rgba颜色
                    // blendColor: Cesium.Color.DARKBLUE 
                    /* 一张黑白图用来作为标识哪里是用水来渲染的贴图
                    如果不指定，则代表使用该material的primitive区域全部都是水，
                    如果指定全黑色的图，则表示该区域没有水，
                    如果是灰色的，则代表水的透明度，
                    这里一般是指定都是要么有水，要么没有水，而且对于不是矩形的primitive区域，最好定义全是白色，
                    不然很难绘制出一张贴图正好能保证需要的地方有水，不需要的地方没有水
                    */
                    // specularMap: "", 
                    // 用来生成起伏效果的法线贴图
                    normalMap: Cesium.buildModuleUrl('Assets/Textures/waterNormals.jpg'),
                    // 水浪的波动
                    frequency: params.frequency,
                    // 水波振幅
                    animationSpeed: params.animationSpeed,
                    // 水流速度
                    amplitude: params.amplitude,
                    // 镜面反射强度
                    specularIntensity: params.specularIntensity,
                }
            }
        }),
        // fragmentShaderSource: fragmentShaderSource
    }), [params])
    return (
        <>
            <Leva hidden={!enableDebug} />
            <Primitive appearance={appearance} geometryInstances={geometryInstances} show />
        </>
    )
}

export default memo(WaterPrimitive)