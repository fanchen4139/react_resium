// import { memo, useMemo } from "react"
// import { CesiumWidget } from "resium"
// import useLevaControls from "@/hooks/useLevaControls"
// import Cesium, {
//   TerrainProvider,
//   ShadowMode,
//   MapMode2D,
//   CreditDisplay,
// } from "cesium"

// /**
//  * CesiumWidgetWithLeva
//  * - 支持 Leva 面板调试 CesiumWidget 所有可设置属性
//  * - 需要放在 React 渲染中
//  */
// const CesiumWidgetWithLeva = () => {
//   const params = useLevaControls({
//     name: "CesiumWidget 控制",
//     schema: {
//       // 渲染控制
//       resolutionScale: {
//         label: "渲染分辨率 scale",
//         value: 1,
//         min: 0.1,
//         max: 2,
//         step: 0.1,
//       },
//       useDefaultRenderLoop: {
//         label: "默认渲染循环",
//         value: true,
//       },
//       targetFrameRate: {
//         label: "目标帧率",
//         value: 60,
//         min: 0,
//         step: 1,
//       },
//       useBrowserRecommendedResolution: {
//         label: "浏览器建议分辨率",
//         value: true,
//       },

//       // 动画 / 数据源
//       allowDataSourcesToSuspendAnimation: {
//         label: "允许暂停 DataSource 动画",
//         value: false,
//       },

//       // 根场景配置
//       // TerrainProvider 示例：可根据需要引入其它 Provider
//       terrainProviderUrl: {
//         label: "TerrainProvider URL【地形提供者 URL】",
//         value: "",
//       },

//       // CreditDisplay
//       showCreditDisplay: {
//         label: "显示积分 CreditDisplay",
//         value: true,
//       },

//       // 阴影/模式
//       shadows: {
//         label: "阴影模式",
//         value: false,
//       },
//       mapMode2D: {
//         label: "2D 模式 MapMode2D",
//         value: MapMode2D.INFINITE_SCROLL,
//       },

//       // requestRenderMode
//       requestRenderMode: {
//         label: "按需渲染模式",
//         value: false,
//       },
//       maximumRenderTimeChange: {
//         label: "最大渲染时间变化",
//         value: 0,
//         min: 0,
//         step: 0.1,
//       },

//       // blurActiveElementOnCanvasFocus
//       blurActiveElementOnCanvasFocus: {
//         label: "Canvas 点击失焦处理",
//         value: true,
//       },
//     },
//   })
// // 如果提供了 terrainProviderUrl，则创建对应实例
// const terrainProvider = useMemo(() => {
//   if (params.terrainProviderUrl) {
//     // 假设你有一个 Ion 资产 ID
//     return Cesium.CesiumTerrainProvider.fromIonAssetId(3956, {
//       requestVertexNormals: true
//     });
//   }
//   return null;
// }, [params.terrainProviderUrl]);


  

//   return (
//     <CesiumWidget
//       resolutionScale={params.resolutionScale}
//       useDefaultRenderLoop={params.useDefaultRenderLoop}
//       targetFrameRate={
//         params.targetFrameRate > 0 ? params.targetFrameRate : undefined
//       }
//       useBrowserRecommendedResolution={params.useBrowserRecommendedResolution}
//       allowDataSourcesToSuspendAnimation={
//         params.allowDataSourcesToSuspendAnimation
//       }
//       terrainProvider={terrainProvider}
//       creditDisplay={
//         params.showCreditDisplay ? new CreditDisplay() : undefined
//       }
//       shadows={params.shadows}
//       mapMode2D={params.mapMode2D}
//       requestRenderMode={params.requestRenderMode}
//       maximumRenderTimeChange={params.maximumRenderTimeChange}
//       blurActiveElementOnCanvasFocus={
//         params.blurActiveElementOnCanvasFocus
//       }
//       // 你可以继续添加其它可控属性
//     />
//   )
// }

// export default memo(CesiumWidgetWithLeva)
