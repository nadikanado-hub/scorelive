import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Prevent iOS Safari pinch / double-tap / gesture zoom which gets triggered
// by some embedded video iframes (e.g. SportStreaming) and makes the page
// look "zoomed in" / desktop-mode after the player loads.
if (typeof window !== "undefined") {
  const prevent = (e: Event) => e.preventDefault();
  document.addEventListener("gesturestart", prevent);
  document.addEventListener("gesturechange", prevent);
  document.addEventListener("gestureend", prevent);
  document.addEventListener("dblclick", prevent);

  // If the visual viewport ever ends up scaled (>1), force a reset by
  // re-applying the viewport meta tag.
  const vv = (window as unknown as { visualViewport?: VisualViewport }).visualViewport;
  if (vv) {
    const resetZoom = () => {
      if (vv.scale && vv.scale !== 1) {
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
          const original = meta.getAttribute("content") || "";
          meta.setAttribute(
            "content",
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
          );
          // toggle to force re-evaluation
          setTimeout(() => meta.setAttribute("content", original), 50);
        }
        window.scrollTo(0, window.scrollY);
      }
    };
    vv.addEventListener("resize", resetZoom);
    vv.addEventListener("scroll", resetZoom);
  }
}

createRoot(document.getElementById("root")!).render(<App />);
