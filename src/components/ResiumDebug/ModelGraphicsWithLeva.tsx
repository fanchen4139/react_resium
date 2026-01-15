import { memo, useMemo } from "react"
import { ModelGraphics } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Color,
  DistanceDisplayCondition,
  HeightReference,
  ShadowMode,
  ColorBlendMode,
} from "cesium"
import { folder } from "leva"

/**
 * ModelGraphicsWithLeva
 * - 用 Leva 控制 ModelGraphics 关键属性
 * - 必须作为 <Entity> 子组件使用
 */
const ModelGraphicsWithLeva = () => {
  const params = useLevaControls({
    name: "ModelGraphics 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          uri: { label: "模型 URI", value: "" },
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
        },
        { collapsed: false }
      ),

      animation: folder(
        {
          runAnimations: { label: "播放动画", value: true },
          clampAnimations: { label: "动画钳制", value: false },
          incrementallyLoadTextures: {
            label: "增量加载纹理",
            value: true,
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

  const distanceDisplayCondition = useMemo(() => {
    return new DistanceDisplayCondition(
      params.distanceDisplayCondition[0],
      params.distanceDisplayCondition[1]
    )
  }, [params.distanceDisplayCondition[0], params.distanceDisplayCondition[1]])

  return (
    <ModelGraphics
      show={params.show}
      uri={params.uri || undefined}
      scale={params.scale}
      minimumPixelSize={params.minimumPixelSize}
      maximumScale={params.maximumScale}
      incrementallyLoadTextures={params.incrementallyLoadTextures}
      runAnimations={params.runAnimations}
      clampAnimations={params.clampAnimations}
      shadows={params.shadows as ShadowMode}
      heightReference={params.heightReference as HeightReference}
      color={color}
      colorBlendMode={params.colorBlendMode as ColorBlendMode}
      colorBlendAmount={params.colorBlendAmount}
      silhouetteColor={silhouetteColor}
      silhouetteSize={params.silhouetteSize}
      distanceDisplayCondition={
        params.distanceDisplayCondition ? distanceDisplayCondition : undefined
      }
    />
  )
}

export default memo(ModelGraphicsWithLeva)
