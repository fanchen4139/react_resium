import * as Cesium from "cesium";
import { memo, useMemo, type FC } from "react";
import { Primitive } from "resium";
import useLevaControls from "../hooks/useLevaControls";
import type { DefaultControllerProps } from "../types/Common";
import { GCJ02_2_WGS84 } from "../utils/coordinate";

type WallPrimitiveType = FC<{
  enableTransformCoordinate?: boolean
  polygonHierarchy: Array<number[]>
} & DefaultControllerProps>

/** 
 * @description 创建动态水面
 * @param {Object} props - 配置选项
 * @param {string} [props.controllerName] - 调试器折叠面板 name
 * @param {boolean} [props.enableDebug=false] - 是否启用调试模式
 * @param {PolygonHierarchy} props.polygonHierarchy - 多边形层次结构，定义了多边形的形状
 * @param {boolean} [props.enableTransformCoordinate=true] - 默认使用 GCJ02 高德坐标系, 设为 false 则是 WGS84 谷歌坐标系
 */
const WallPrimitive: WallPrimitiveType = ({
  controllerName,
  enableDebug = false,
  enableTransformCoordinate = true,
  polygonHierarchy }) => {

  // 获取控制面板参数
  const params = useLevaControls(
    {
      name: `Wall_${controllerName}`,
      schema: { // 控制面板配置
        frequency: {
          label: 'frequency【水浪的波动】',
          value: 40.0,
          step: 1,
        },
        animationSpeed: {
          label: 'animationSpeed【水波振幅】',
          value: 0.003,
          step: 0.001,
        },
        amplitude: {
          label: 'amplitude【水流速度】',
          value: 10,
          step: 1,
        },
        specularIntensity: {
          label: 'specularIntensity【镜面反射强度】',
          value: 0.01,
          step: 0.01,
        },
      }
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
    id: 'Wall',
    geometry: Cesium.WallGeometry.fromConstantHeights({
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
        type: "Wall",
        uniforms: {
          // 水的颜色
          // baseWallColor: Cesium.Color.RED,
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
          normalMap: Cesium.buildModuleUrl('Assets/Textures/WallNormals.jpg'),
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

export default memo(WallPrimitive)