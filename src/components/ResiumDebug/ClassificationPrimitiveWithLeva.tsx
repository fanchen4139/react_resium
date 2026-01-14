import { memo, useMemo } from "react"
import { ClassificationPrimitive, type ClassificationPrimitiveProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"
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
type ClassificationPrimitiveWithLevaProps = Omit<
  ClassificationPrimitiveProps,
  "show" | "classificationType" | "debugShowBoundingVolume" | "debugShowShadowVolume"
>

const ClassificationPrimitiveWithLeva = ({
  geometryInstances: geometryInstancesProp,
  appearance: appearanceProp,
  ...props
}: ClassificationPrimitiveWithLevaProps) => {
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
      readonly: folder({
        allowPicking: { label: "allowPicking【允许拾取】", value: true },
        asynchronous: { label: "asynchronous【异步】", value: true },
        compressVertices: { label: "compressVertices【压缩顶点】", value: true },
        interleave: { label: "interleave【交错】", value: false },
        releaseGeometryInstances: { label: "releaseGeometryInstances【释放几何实例】", value: true },
        vertexCacheOptimize: { label: "vertexCacheOptimize【顶点缓存优化】", value: false },
      }),
    },
  })

  // 示例几何实例 — 你可以根据业务需求传入自定义 GeometryInstance 数组
  const defaultGeometryInstances = useMemo(() => {
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
  const defaultAppearance = useMemo(
    () => new PerInstanceColorAppearance(),
    []
  )

  return (
    <ClassificationPrimitive
      {...props}
      show={params.show}
      allowPicking={params.allowPicking}
      asynchronous={params.asynchronous}
      compressVertices={params.compressVertices}
      interleave={params.interleave}
      releaseGeometryInstances={params.releaseGeometryInstances}
      vertexCacheOptimize={params.vertexCacheOptimize}
      geometryInstances={geometryInstancesProp ?? defaultGeometryInstances}
      appearance={appearanceProp ?? defaultAppearance}
      classificationType={params.classificationType}
      debugShowBoundingVolume={params.debugShowBoundingVolume}
      debugShowShadowVolume={params.debugShowShadowVolume}
    />
  )
}

export default memo(ClassificationPrimitiveWithLeva)
