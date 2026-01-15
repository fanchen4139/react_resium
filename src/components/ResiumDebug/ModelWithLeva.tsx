import { memo, useMemo } from "react"
import { Model, type ModelProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Cartesian3,
  Color,
  ColorBlendMode,
  DistanceDisplayCondition,
  HeightReference,
  ShadowMode,
  SplitDirection,
  Transforms,
  type Matrix4,
} from "cesium"
import { folder } from "leva"

type ModelWithLevaProps = Omit<
  ModelProps,
  | "url"
  | "show"
  | "scale"
  | "minimumPixelSize"
  | "maximumScale"
  | "color"
  | "colorBlendMode"
  | "colorBlendAmount"
  | "silhouetteColor"
  | "silhouetteSize"
  | "shadows"
  | "heightReference"
  | "distanceDisplayCondition"
  | "modelMatrix"
  | "splitDirection"
> & {
  modelMatrix?: Matrix4
}

/**
 * ModelWithLeva
 * - 用 Leva 控制 Model 关键属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const ModelWithLeva = ({
  modelMatrix: modelMatrixProp,
  ...props
}: ModelWithLevaProps) => {
  const params = useLevaControls({
    name: "Model 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          url: { label: "模型 URL", value: "" },
          scale: { label: "缩放 scale", value: 1, min: 0, step: 0.1 },
          minimumPixelSize: {
            label: "最小像素 minimumPixelSize",
            value: 0,
            min: 0,
            step: 1,
          },
          maximumScale: {
            label: "最大缩放 maximumScale",
            value: 200,
            min: 0,
            step: 1,
          },
        },
        { collapsed: false }
      ),

      appearance: folder(
        {
          color: { label: "颜色", value: "#ffffff" },
          colorBlendMode: {
            label: "颜色混合模式",
            options: ColorBlendMode,
            value: ColorBlendMode.HIGHLIGHT,
          },
          colorBlendAmount: {
            label: "颜色混合量",
            value: 0.5,
            min: 0,
            max: 1,
            step: 0.01,
          },
          silhouetteColor: { label: "轮廓颜色", value: "#000000" },
          silhouetteSize: {
            label: "轮廓宽度",
            value: 0,
            min: 0,
            step: 0.1,
          },
          splitDirection: {
            label: "分屏 splitDirection",
            options: SplitDirection,
            value: SplitDirection.NONE,
          },
        },
        { collapsed: false }
      ),

      transform: folder(
        {
          useCustomMatrix: {
            label: "启用自定义 modelMatrix",
            value: false,
          },
          lng: {
            label: "中心经度",
            value: 116.395102,
            step: 0.00001,
          },
          lat: {
            label: "中心纬度",
            value: 39.868458,
            step: 0.00001,
          },
          height: {
            label: "中心高度",
            value: 0,
            step: 100,
          },
        },
        { collapsed: true }
      ),

      advanced: folder(
        {
          shadows: {
            label: "阴影 shadows",
            options: ShadowMode,
            value: ShadowMode.DISABLED,
          },
          heightReference: {
            label: "高度参考",
            options: HeightReference,
            value: HeightReference.NONE,
          },
          distanceDisplayCondition: {
            label: "距离显示条件 [near, far]",
            value: [0, 1e7],
          },
        },
        { collapsed: true }
      ),
    },
  })

  const color = useMemo(
    () => Color.fromCssColorString(params.color),
    [params.color]
  )

  const silhouetteColor = useMemo(
    () => Color.fromCssColorString(params.silhouetteColor),
    [params.silhouetteColor]
  )

  const modelMatrix = useMemo(() => {
    if (!params.useCustomMatrix) return modelMatrixProp
    const center = Cartesian3.fromDegrees(
      params.lng,
      params.lat,
      params.height
    )
    return Transforms.eastNorthUpToFixedFrame(center)
  }, [
    params.useCustomMatrix,
    params.lng,
    params.lat,
    params.height,
    modelMatrixProp,
  ])

  const distanceDisplayCondition = useMemo(() => {
    return new DistanceDisplayCondition(
      params.distanceDisplayCondition[0],
      params.distanceDisplayCondition[1]
    )
  }, [params.distanceDisplayCondition[0], params.distanceDisplayCondition[1]])

  return (
    <Model
      {...props}
      url={params.url || (props as ModelProps).url}
      show={params.show}
      scale={params.scale}
      minimumPixelSize={params.minimumPixelSize}
      maximumScale={params.maximumScale}
      color={color}
      colorBlendMode={params.colorBlendMode as ColorBlendMode}
      colorBlendAmount={params.colorBlendAmount}
      silhouetteColor={silhouetteColor}
      silhouetteSize={params.silhouetteSize}
      splitDirection={params.splitDirection as SplitDirection}
      modelMatrix={modelMatrix}
      shadows={params.shadows as ShadowMode}
      heightReference={params.heightReference as HeightReference}
      distanceDisplayCondition={
        params.distanceDisplayCondition ? distanceDisplayCondition : undefined
      }
    />
  )
}

export default memo(ModelWithLeva)
