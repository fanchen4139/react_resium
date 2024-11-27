import "normalize.css"
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import AppGlobal from './AppGlobal.tsx'
import AppDemo from './AppDemo.tsx'
// import "./utils/cesium/PolylineTrailMaterialProperty.js";
// import "./materials/index.ts";
// import "./materials/property/index.ts";

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    {/* <AppDemo /> */}
    {/* <AppGlobal /> */}
  </>,
)
