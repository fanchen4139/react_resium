import { Primitive } from "resium";
import * as Cesium from "cesium";
import { memo, useMemo, useState, type FC } from "react";
import { Leva, useControls } from "leva";
import { GCJ02_2_WGS84 } from "../utils/coordinate";
import getControlsParams from "../utils/leva";
import type { ExtractSchema } from "../types/utils";

type WaterPrimitiveType = FC<{
    name: string,
    enableDebug?: boolean,
    enableTransformCoordinate?: boolean
    polygonHierarchy: Array<number[]>
}>

/** 
 * @description 创建动态水面
 * @param {Object} options - 配置选项
 * @param {string} [options.name] - 调试器折叠面板 name
 * @param {boolean} [options.enableDebug=false] - 是否启用调试模式
 * @param {PolygonHierarchy} options.polygonHierarchy - 多边形层次结构，定义了多边形的形状
 * @param {boolean} [options.enableTransformCoordinate=true] - 是否启用坐标转换，GCJ02 ==> WGS84
 */
const WaterPrimitive: WaterPrimitiveType = ({
    name,
    enableDebug = false,
    polygonHierarchy,
    enableTransformCoordinate = true,
}) => {

    // 声明调试面板控件配置
    const schema = {
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
    }

    // 获取控制面板参数
    const params = getControlsParams<typeof schema>(
        {
            name,
            schema
        },
        enableDebug
    )

    // 处理坐标
    const degreesArray = polygonHierarchy.reduce((pre, cur) => {
        if (enableTransformCoordinate) {
            pre.push(...GCJ02_2_WGS84(cur[0], cur[1]))
        } else {
            pre.push(cur[0], cur[1])
        }
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

    // 设置外观
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
            {/* <Leva hidden={!enableDebug} /> */}
            <Primitive appearance={appearance} allowPicking geometryInstances={geometryInstances} show />
        </>
    )
}

export default memo(WaterPrimitive)