import "normalize.css"
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import AppGlobal from './AppGlobal.tsx'
// import "./utils/cesium/PolylineTrailMaterialProperty.js";
createRoot(document.getElementById('root')!).render(
  <>
    {/* <App /> */}
    <AppGlobal />
  </>,
)
