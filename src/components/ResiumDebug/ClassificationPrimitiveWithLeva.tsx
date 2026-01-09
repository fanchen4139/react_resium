import { memo, useMemo } from "react"
import { ClassificationPrimitive } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  ClassificationType,
  GeometryInstance,
  ColorGeometryInstanceAttribute,
  PerInstanceColorAppearance,
  Cartesian3,
  BoxGeometry,
  Color,
} from "cesium"

/**
 * ClassificationPrimitiveWithLeva
 * Leva 面板动态控制 ClassificationPrimitive 关键属性
 * 放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const ClassificationPrimitiveWithLeva = () => {
  const params = useLevaControls({
    name: "ClassificationPrimitive 控制",
    schema: {
      show: { label: "显示 show", value: true },

      // classificationType: TERRAIN, CESIUM_3D_TILE, 或 BOTH
      classificationType: {
        label: "分类类型",
        value: ClassificationType.BOTH,
      },

      debugShowBoundingVolume: {
        label: "调试 显示包围体",
        value: false,
      },
      debugShowShadowVolume: {
        label: "调试 显示阴影体积",
        value: false,
      },
    },
  })

  // 示例几何实例 — 你可以根据业务需求传入自定义 GeometryInstance 数组
  const geometryInstances = useMemo(() => {
    // 示例：创建一个带颜色的几何实例
    const instance = new GeometryInstance({
      // id 必须唯一
      id: "example-instance",
      // geometry 可由 Cesium.BoxGeometry 等构建
      geometry: new BoxGeometry({
        vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
        maximum: new Cartesian3(5000, 5000, 5000),
        minimum: new Cartesian3(-5000, -5000, 0),
      }),
      attributes: {
        color: ColorGeometryInstanceAttribute.fromColor(
          Color.RED.withAlpha(0.5)
        ),
      },
    })
    return [instance]
  }, [])

  // Appearance：若不传，Cesium 默认使用 PerInstanceColorAppearance
  const appearance = useMemo(
    () => new PerInstanceColorAppearance(),
    []
  )

  return (
    <ClassificationPrimitive
      show={params.show}
      geometryInstances={geometryInstances}
      appearance={appearance}
      classificationType={params.classificationType}
      debugShowBoundingVolume={params.debugShowBoundingVolume}
      debugShowShadowVolume={params.debugShowShadowVolume}
    />
  )
}

export default memo(ClassificationPrimitiveWithLeva)
