import { memo } from "react"
import { Globe, type GlobeProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Color,
  ShadowMode,
  DynamicAtmosphereLightingType,
} from "cesium"
import { folder } from "leva"
import type { Schema } from "leva/dist/declarations/src/types"

type GlobeWithLevaProps = Omit<
  Partial<GlobeProps>,
  "baseColor" | "undergroundColor"
> & {
  baseColor?: Color | string
  undergroundColor?: Color | string
}

type GlobeLevaParams = {
  show?: boolean
  baseColor?: string
  undergroundColor?: string
  depthTestAgainstTerrain?: boolean
  enableLighting?: boolean
  showGroundAtmosphere?: boolean
  showWaterEffect?: boolean
  atmosphereBrightnessShift?: number
  atmosphereHueShift?: number
  atmosphereSaturationShift?: number
  atmosphereLightIntensity?: number
  dynamicAtmosphereLighting?: DynamicAtmosphereLightingType
  dynamicAtmosphereLightingFromSun?: boolean
  lightingFadeInDistance?: number
  lightingFadeOutDistance?: number
  nightFadeInDistance?: number
  nightFadeOutDistance?: number
  lambertDiffuseMultiplier?: number
  vertexShadowDarkness?: number
  maximumScreenSpaceError?: number
  tileCacheSize?: number
  loadingDescendantLimit?: number
  preloadAncestors?: boolean
  preloadSiblings?: boolean
  shadows?: ShadowMode
  showSkirts?: boolean
}

/**
 * GlobeWithLeva
 * - 用 Leva 控制 Globe 关键属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const GlobeWithLeva = (props: GlobeWithLevaProps) => {
  const {
    show,
    baseColor,
    undergroundColor,
    depthTestAgainstTerrain,
    enableLighting,
    showGroundAtmosphere,
    showWaterEffect,
    atmosphereBrightnessShift,
    atmosphereHueShift,
    atmosphereSaturationShift,
    atmosphereLightIntensity,
    dynamicAtmosphereLighting,
    dynamicAtmosphereLightingFromSun,
    lightingFadeInDistance,
    lightingFadeOutDistance,
    nightFadeInDistance,
    nightFadeOutDistance,
    lambertDiffuseMultiplier,
    vertexShadowDarkness,
    maximumScreenSpaceError,
    tileCacheSize,
    loadingDescendantLimit,
    preloadAncestors,
    preloadSiblings,
    shadows,
    showSkirts,
  } = props

  const toCssColorString = (value?: Color | string) =>
    value instanceof Color ? value.toCssColorString() : value

  const schema: Schema = {}
  const basic: Schema = {}
  const atmosphere: Schema = {}
  const lighting: Schema = {}
  const performance: Schema = {}
  const shadow: Schema = {}

  if (show !== undefined) {
    basic.show = { label: "显示 show", value: show }
  }
  if (baseColor !== undefined) {
    basic.baseColor = {
      label: "基础颜色",
      value: toCssColorString(baseColor),
    }
  }
  if (undergroundColor !== undefined) {
    basic.undergroundColor = {
      label: "地下颜色",
      value: toCssColorString(undergroundColor),
    }
  }
  if (depthTestAgainstTerrain !== undefined) {
    basic.depthTestAgainstTerrain = {
      label: "地形深度测试",
      value: depthTestAgainstTerrain,
    }
  }
  if (enableLighting !== undefined) {
    basic.enableLighting = {
      label: "光照 enableLighting",
      value: enableLighting,
    }
  }
  if (showGroundAtmosphere !== undefined) {
    basic.showGroundAtmosphere = {
      label: "地面大气层",
      value: showGroundAtmosphere,
    }
  }
  if (showWaterEffect !== undefined) {
    basic.showWaterEffect = { label: "水面效果", value: showWaterEffect }
  }
  if (Object.keys(basic).length > 0) {
    schema.basic = folder(basic, { collapsed: false })
  }

  if (atmosphereBrightnessShift !== undefined) {
    atmosphere.atmosphereBrightnessShift = {
      label: "亮度偏移",
      value: atmosphereBrightnessShift,
      min: -1,
      max: 1,
      step: 0.01,
    }
  }
  if (atmosphereHueShift !== undefined) {
    atmosphere.atmosphereHueShift = {
      label: "色相偏移",
      value: atmosphereHueShift,
      min: -1,
      max: 1,
      step: 0.01,
    }
  }
  if (atmosphereSaturationShift !== undefined) {
    atmosphere.atmosphereSaturationShift = {
      label: "饱和度偏移",
      value: atmosphereSaturationShift,
      min: -1,
      max: 1,
      step: 0.01,
    }
  }
  if (atmosphereLightIntensity !== undefined) {
    atmosphere.atmosphereLightIntensity = {
      label: "大气光照强度",
      value: atmosphereLightIntensity,
      min: 0,
      max: 50,
      step: 0.1,
    }
  }
  if (dynamicAtmosphereLighting !== undefined) {
    atmosphere.dynamicAtmosphereLighting = {
      label: "动态大气光照",
      options: DynamicAtmosphereLightingType,
      value: dynamicAtmosphereLighting,
    }
  }
  if (dynamicAtmosphereLightingFromSun !== undefined) {
    atmosphere.dynamicAtmosphereLightingFromSun = {
      label: "从太阳动态光照",
      value: dynamicAtmosphereLightingFromSun,
    }
  }
  if (Object.keys(atmosphere).length > 0) {
    schema.atmosphere = folder(atmosphere, { collapsed: true })
  }

  if (lightingFadeInDistance !== undefined) {
    lighting.lightingFadeInDistance = {
      label: "光照渐入距离",
      value: lightingFadeInDistance,
      min: 0,
      step: 1000,
    }
  }
  if (lightingFadeOutDistance !== undefined) {
    lighting.lightingFadeOutDistance = {
      label: "光照渐出距离",
      value: lightingFadeOutDistance,
      min: 0,
      step: 1000,
    }
  }
  if (nightFadeInDistance !== undefined) {
    lighting.nightFadeInDistance = {
      label: "夜景渐入距离",
      value: nightFadeInDistance,
      min: 0,
      step: 1000,
    }
  }
  if (nightFadeOutDistance !== undefined) {
    lighting.nightFadeOutDistance = {
      label: "夜景渐出距离",
      value: nightFadeOutDistance,
      min: 0,
      step: 1000,
    }
  }
  if (lambertDiffuseMultiplier !== undefined) {
    lighting.lambertDiffuseMultiplier = {
      label: "Lambert 漫反射",
      value: lambertDiffuseMultiplier,
      min: 0,
      step: 0.1,
    }
  }
  if (vertexShadowDarkness !== undefined) {
    lighting.vertexShadowDarkness = {
      label: "顶点阴影暗度",
      value: vertexShadowDarkness,
      min: 0,
      max: 1,
      step: 0.01,
    }
  }
  if (Object.keys(lighting).length > 0) {
    schema.lighting = folder(lighting, { collapsed: true })
  }

  if (maximumScreenSpaceError !== undefined) {
    performance.maximumScreenSpaceError = {
      label: "最大屏幕误差",
      value: maximumScreenSpaceError,
      min: 0,
      step: 1,
    }
  }
  if (tileCacheSize !== undefined) {
    performance.tileCacheSize = {
      label: "瓦片缓存大小",
      value: tileCacheSize,
      min: 0,
      step: 10,
    }
  }
  if (loadingDescendantLimit !== undefined) {
    performance.loadingDescendantLimit = {
      label: "加载后代限制",
      value: loadingDescendantLimit,
      min: 0,
      step: 1,
    }
  }
  if (preloadAncestors !== undefined) {
    performance.preloadAncestors = {
      label: "预加载祖先",
      value: preloadAncestors,
    }
  }
  if (preloadSiblings !== undefined) {
    performance.preloadSiblings = {
      label: "预加载兄弟",
      value: preloadSiblings,
    }
  }
  if (Object.keys(performance).length > 0) {
    schema.performance = folder(performance, { collapsed: true })
  }

  if (shadows !== undefined) {
    shadow.shadows = {
      label: "阴影 shadows",
      options: ShadowMode,
      value: shadows,
    }
  }
  if (showSkirts !== undefined) {
    shadow.showSkirts = { label: "显示裙带", value: showSkirts }
  }
  if (Object.keys(shadow).length > 0) {
    schema.shadow = folder(shadow, { collapsed: true })
  }

  const params = useLevaControls({
    name: "Globe 控制",
    schema,
  }) as GlobeLevaParams

  const { baseColor: baseColorProp, undergroundColor: undergroundColorProp, ...restProps } =
    props
  const globeProps: GlobeProps = { ...(restProps as GlobeProps) }
  if (show !== undefined) {
    globeProps.show = params.show
    console.log("show", globeProps.show);
  }

  if (baseColorProp !== undefined) {
    globeProps.baseColor = Color.fromCssColorString(params.baseColor)
  }
  if (undergroundColorProp !== undefined) {
    globeProps.undergroundColor = Color.fromCssColorString(
      params.undergroundColor
    )
  }
  if (depthTestAgainstTerrain !== undefined) {
    globeProps.depthTestAgainstTerrain = params.depthTestAgainstTerrain
  }
  if (enableLighting !== undefined) {
    globeProps.enableLighting = params.enableLighting
    console.log("enableLighting", globeProps.enableLighting);
  }
  if (showGroundAtmosphere !== undefined) {
    globeProps.showGroundAtmosphere = params.showGroundAtmosphere
  }
  if (showWaterEffect !== undefined) {
    globeProps.showWaterEffect = params.showWaterEffect
  }
  if (atmosphereBrightnessShift !== undefined) {
    globeProps.atmosphereBrightnessShift = params.atmosphereBrightnessShift
  }
  if (atmosphereHueShift !== undefined) {
    globeProps.atmosphereHueShift = params.atmosphereHueShift
  }
  if (atmosphereSaturationShift !== undefined) {
    globeProps.atmosphereSaturationShift = params.atmosphereSaturationShift
  }
  if (atmosphereLightIntensity !== undefined) {
    globeProps.atmosphereLightIntensity = params.atmosphereLightIntensity
    console.log("atmosphereLightIntensity", globeProps.atmosphereLightIntensity);
  }
  if (dynamicAtmosphereLighting !== undefined) {
    globeProps.dynamicAtmosphereLighting = !!params.dynamicAtmosphereLighting
    console.log("enableLighting", globeProps.enableLighting);
  }
  if (dynamicAtmosphereLightingFromSun !== undefined) {
    globeProps.dynamicAtmosphereLightingFromSun =
      params.dynamicAtmosphereLightingFromSun
  }
  if (lightingFadeInDistance !== undefined) {
    globeProps.lightingFadeInDistance = params.lightingFadeInDistance
  }
  if (lightingFadeOutDistance !== undefined) {
    globeProps.lightingFadeOutDistance = params.lightingFadeOutDistance
  }
  if (nightFadeInDistance !== undefined) {
    globeProps.nightFadeInDistance = params.nightFadeInDistance
  }
  if (nightFadeOutDistance !== undefined) {
    globeProps.nightFadeOutDistance = params.nightFadeOutDistance
  }
  if (lambertDiffuseMultiplier !== undefined) {
    globeProps.lambertDiffuseMultiplier = params.lambertDiffuseMultiplier
  }
  if (vertexShadowDarkness !== undefined) {
    globeProps.vertexShadowDarkness = params.vertexShadowDarkness
  }
  if (maximumScreenSpaceError !== undefined) {
    globeProps.maximumScreenSpaceError = params.maximumScreenSpaceError
  }
  if (tileCacheSize !== undefined) {
    globeProps.tileCacheSize = params.tileCacheSize
  }
  if (loadingDescendantLimit !== undefined) {
    globeProps.loadingDescendantLimit = params.loadingDescendantLimit
  }
  if (preloadAncestors !== undefined) {
    globeProps.preloadAncestors = params.preloadAncestors
  }
  if (preloadSiblings !== undefined) {
    globeProps.preloadSiblings = params.preloadSiblings
  }
  if (shadows !== undefined) {
    globeProps.shadows = params.shadows as ShadowMode
  }
  if (showSkirts !== undefined) {
    globeProps.showSkirts = params.showSkirts
  }

  return (
    <Globe key={"Globe" + JSON.stringify(globeProps)} {...globeProps} />
  )
}

export default memo(GlobeWithLeva)
