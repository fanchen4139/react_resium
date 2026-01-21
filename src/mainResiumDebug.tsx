import "normalize.css"
import { createRoot } from "react-dom/client"
import ResiumDebugDemo from "./ResiumDebugDemo"
import "@/engine/Source/Scene/Materials"

createRoot(document.getElementById("root")!).render(
  <ResiumDebugDemo />
)
