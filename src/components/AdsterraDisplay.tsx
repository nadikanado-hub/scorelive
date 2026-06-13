import { useEffect, useRef } from "react";

export default function AdsterraDisplay() {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !ref.current) return;
    loaded.current = true;
    const optScript = document.createElement("script");
    optScript.text = `atOptions={'key':'4e38fe0aa2b18a222a1df7577eb4df82','format':'iframe','height':50,'width':320,'params':{}};`;
    ref.current.appendChild(optScript);
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://www.highperformanceformat.com/4e38fe0aa2b18a222a1df7577eb4df82/invoke.js";
    ref.current.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center my-2">
      <div ref={ref} style={{ minHeight: 50, width: 320 }} />
    </div>
  );
}
