import { memo } from "react"
import { Globe } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Color,
  ShadowMode,
  DynamicAtmosphereLightingType,
} from "cesium"
import { folder } from "leva"

/**
 * GlobeWithLeva
 * - 用 Leva 控制 Globe 关键属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const GlobeWithLeva = () => {
  const params = useLevaControls({
    name: "Globe 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          baseColor: { label: "基础颜色", value: "#000000" },
          undergroundColor: { label: "地下颜色", value: "#000000" },
          depthTestAgainstTerrain: {
            label: "地形深度测试",
            value: true,
          },
          enableLighting: { label: "光照 enableLighting", value: true },
          showGroundAtmosphere: {
            label: "地面大气层",
            value: true,
          },
          showWaterEffect: { label: "水面效果", value: true },
        },
        { collapsed: false }
      ),

      atmosphere: folder(
        {
          atmosphereBrightnessShift: {
            label: "亮度偏移",
            value: 0,
            min: -1,
            max: 1,
            step: 0.01,
          },
          atmosphereHueShift: {
            label: "色相偏移",
            value: 0,
            min: -1,
            max: 1,
            step: 0.01,
          },
          atmosphereSaturationShift: {
            label: "饱和度偏移",
            value: 0,
            min: -1,
            max: 1,
            step: 0.01,
          },
          atmosphereLightIntensity: {
            label: "大气光照强度",
            value: 10,
            min: 0,
            max: 50,
            step: 0.1,
          },
          dynamicAtmosphereLighting: {
            label: "动态大气光照",
            options: DynamicAtmosphereLightingType,
            value: DynamicAtmosphereLightingType.NONE,
          },
          dynamicAtmosphereLightingFromSun: {
            label: "从太阳动态光照",
            value: false,
          },
        },
        { collapsed: true }
      ),

      lighting: folder(
        {
          lightingFadeInDistance: {
            label: "光照渐入距离",
            value: 9000000,
            min: 0,
            step: 1000,
          },
          lightingFadeOutDistance: {
            label: "光照渐出距离",
            value: 12000000,
            min: 0,
            step: 1000,
          },
          nightFadeInDistance: {
            label: "夜景渐入距离",
            value: 9000000,
            min: 0,
            step: 1000,
          },
          nightFadeOutDistance: {
            label: "夜景渐出距离",
            value: 12000000,
            min: 0,
            step: 1000,
          },
          lambertDiffuseMultiplier: {
            label: "Lambert 漫反射",
            value: 1,
            min: 0,
            step: 0.1,
          },
          vertexShadowDarkness: {
            label: "顶点阴影暗度",
            value: 0.3,
            min: 0,
            max: 1,
            step: 0.01,
          },
        },
        { collapsed: true }
      ),

      performance: folder(
        {
          maximumScreenSpaceError: {
            label: "最大屏幕误差",
            value: 16,
            min: 0,
            step: 1,
          },
          tileCacheSize: {
            label: "瓦片缓存大小",
            value: 1000,
            min: 0,
            step: 10,
          },
          loadingDescendantLimit: {
            label: "加载后代限制",
            value: 20,
            min: 0,
            step: 1,
          },
          preloadAncestors: { label: "预加载祖先", value: true },
          preloadSiblings: { label: "预加载兄弟", value: true },
        },
        { collapsed: true }
      ),

      shadow: folder(
        {
          shadows: {
            label: "阴影 shadows",
            options: ShadowMode,
            value: ShadowMode.DISABLED,
          },
          showSkirts: { label: "显示裙带", value: true },
        },
        { collapsed: true }
      ),
    },
  })

  return (
    <Globe
      show={params.show}
      baseColor={Color.fromCssColorString(params.baseColor)}
      undergroundColor={Color.fromCssColorString(params.undergroundColor)}
      depthTestAgainstTerrain={params.depthTestAgainstTerrain}
      enableLighting={params.enableLighting}
      showGroundAtmosphere={params.showGroundAtmosphere}
      showWaterEffect={params.showWaterEffect}
      atmosphereBrightnessShift={params.atmosphereBrightnessShift}
      atmosphereHueShift={params.atmosphereHueShift}
      atmosphereSaturationShift={params.atmosphereSaturationShift}
      atmosphereLightIntensity={params.atmosphereLightIntensity}
      dynamicAtmosphereLighting={
        params.dynamicAtmosphereLighting as DynamicAtmosphereLightingType
      }
      dynamicAtmosphereLightingFromSun={params.dynamicAtmosphereLightingFromSun}
      lightingFadeInDistance={params.lightingFadeInDistance}
      lightingFadeOutDistance={params.lightingFadeOutDistance}
      nightFadeInDistance={params.nightFadeInDistance}
      nightFadeOutDistance={params.nightFadeOutDistance}
      lambertDiffuseMultiplier={params.lambertDiffuseMultiplier}
      vertexShadowDarkness={params.vertexShadowDarkness}
      maximumScreenSpaceError={params.maximumScreenSpaceError}
      tileCacheSize={params.tileCacheSize}
      loadingDescendantLimit={params.loadingDescendantLimit}
      preloadAncestors={params.preloadAncestors}
      preloadSiblings={params.preloadSiblings}
      shadows={params.shadows as ShadowMode}
      showSkirts={params.showSkirts}
    />
  )
}

export default memo(GlobeWithLeva)
