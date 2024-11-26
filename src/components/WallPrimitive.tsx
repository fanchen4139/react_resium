import * as Cesium from "cesium";
import { memo, useEffect, useMemo, useRef, type FC } from "react";
import { Entity, Primitive, WallGraphics } from "resium";
import useLevaControls from "../hooks/useLevaControls";
import type { DefaultControllerProps, PartialWithout } from "../types/Common";
import { GCJ02_2_WGS84 } from "../utils/coordinate";
// import { PolylineTrailMaterialProperty } from "../utils/cesium/PolylineTrailMaterialProperty.js"

type WallPrimitiveType = FC<{
  enableTransformCoordinate?: boolean
  polygonHierarchy?: Array<number[]>
} & PartialWithout<DefaultControllerProps, 'enableDebug'>
>

/** 
 * @description 创建动态水面
 * @param {Object} props - 配置选项
 * @param {string} [props.controllerName] - 调试器折叠面板 name
 * @param {boolean} [props.enableDebug=false] - 是否启用调试模式
 * @param {PolygonHierarchy} props.polygonHierarchy - 多边形层次结构，定义了多边形的形状
 * @param {boolean} [props.enableTransformCoordinate=true] - 默认使用 GCJ02 高德坐标系, 设为 false 则是 WGS84 谷歌坐标系
 */
const WallPrimitive: WallPrimitiveType = ({
  controllerName = '',
  enableDebug = false,
  enableTransformCoordinate = false,
  polygonHierarchy = [
    [116.386378, 39.920743],
    [116.386806, 39.91238],
    [116.395126, 39.912604],
    [116.39469, 39.920937],
    [116.386378, 39.920743],
  ] }) => {

  // 获取控制面板参数
  const params = useLevaControls(
    {
      name: `Wall_${controllerName}`,
      schema: { // 控制面板配置
        minimumHeights: {
          label: 'minimumHeights【最小高度】',
          value: 0,
          step: 1,
        },
        maximumHeights: {
          label: 'maximumHeights【最大高度】',
          value: 300,
          step: 1,
        },
        granularity: {
          label: 'granularity【粒度】',
          value: 0.1,
          step: 0.001,
          min: 0.001,
          max: 1
        },
        fill: {
          label: 'fill【是否填满】',
          value: false
        },
      },
      folderSettings: {
        collapsed: false
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
    geometry: Cesium.WallGeometry.fromConstantHeights({
      positions: Cesium.Cartesian3.fromDegreesArray(degreesArray),
      maximumHeight: 200.0,
      // vertexFormat: Cesium.MaterialAppearance.VERTEX_FORMAT,
    }),
  }), [])

  const image = '/colors1.png', //选择自己的动态材质图片
    color = Cesium.Color.fromCssColorString('rgba(0, 255, 255, 1)'),
    speed = 1,
    source =
      'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
        {\n\
            czm_material material = czm_getDefaultMaterial(materialInput);\n\
            vec2 st = materialInput.st * scale;\n\
            vec4 colorImage = texture(image, vec2(fract((st.t - speed*czm_frameNumber*0.005)), st.t));\n\
            vec4 fragColor;\n\
            fragColor.rgb = color.rgb / 1.0;\n\
            fragColor = czm_gammaCorrect(fragColor);\n\
            material.alpha = colorImage.a * color.a;\n\
            material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
            material.emission = fragColor.rgb;\n\
            return material;\n\
        }'

  /** // 纵向运动
   'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
  {\n\
      czm_material material = czm_getDefaultMaterial(materialInput);\n\
      vec2 st = materialInput.st * scale;\n\
      vec4 colorImage = texture(image, vec2(fract((st.t - speed*czm_frameNumber*0.005)), st.t));\n\
      vec4 fragColor;\n\
      fragColor.rgb = color.rgb / 1.0;\n\
      fragColor = czm_gammaCorrect(fragColor);\n\
      material.alpha = colorImage.a * color.a;\n\
      material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
      material.emission = fragColor.rgb;\n\
      return material;\n\
  }'
   */

  /** // 横向移动
  'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
        {\n\
            czm_material material = czm_getDefaultMaterial(materialInput);\n\
            vec2 st = materialInput.st;\n\
            vec4 colorImage = texture(image, vec2(fract(st.s + speed * czm_frameNumber * 0.005), st.t));\n\
            vec4 fragColor;\n\
            fragColor.rgb = color.rgb / 1.0;\n\
            fragColor = czm_gammaCorrect(fragColor);\n\
            material.alpha = colorImage.a * color.a;\n\
            material.diffuse = (colorImage.rgb + color.rgb) / 2.0;\n\
            material.emission = fragColor.rgb;\n\
            return material;\n\
        }'
   */
  /** // 扩散运动
'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    // 将纹理坐标调整为以中心 (0.5, 0.5) 为基点\n\
    vec2 st = materialInput.st - vec2(0.5);\n\
\n\
    // 通过 sin 函数生成动态缩放比例\n\
    float time = czm_frameNumber * speed * 0.005; // 动态时间参数\n\
    float scale = 1.0 + 0.3 * sin(time); // 缩放比例在 [0.7, 1.3] 之间循环变化\n\
    float angle = sin(time) * 3.14159; // 动态旋转角度\n\
mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));\n\
st = rotation * st;\n\
\n\
    // 应用缩放比例\n\
    st *= scale;\n\
\n\
    // 恢复纹理坐标范围到 [0, 1]\n\
    st += vec2(0.5);\n\
\n\
    // 采样纹理图像\n\
    vec4 colorImage = texture(image, fract(st));\n\
\n\
    // 材质属性设置\n\
    material.alpha = colorImage.a * color.a;\n\
    material.diffuse = (colorImage.rgb + color.rgb) / 2.0;\n\
    material.emission = colorImage.rgb;\n\
\n\
    return material;\n\
}'
   */


  // 设置外观
  const appearance = useMemo(() => new Cesium.EllipsoidSurfaceAppearance({
    material: new Cesium.Material({
      fabric: {
        type: 'PolylinePulseLink',
        uniforms: {
          color: color, // png 材质的实际着色
          image: image, // png 格式的材质
          speed: speed, // 流速
          scale: 1, // 重复次数
          // minificationFilter: Cesium.TextureMinificationFilter.LINEAR,
          // magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
        },
        source: source,
      },
      translucent: true,
    }),
    translucent: false,
    renderState: {
      cull: {
        enabled: false, // 禁用剔除，正反面都可见
      },
    },
  }), [params])

  return (
    <Primitive
      appearance={appearance}
      geometryInstances={geometryInstances}
    />
  )
}

export default memo(WallPrimitive)