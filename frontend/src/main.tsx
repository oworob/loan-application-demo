import App from "@/App.tsx"
import { Toaster } from "@/components/ui/sonner.tsx"
import "@/index.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" />
  </StrictMode>
)
