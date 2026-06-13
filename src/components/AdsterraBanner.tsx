import { useEffect, useRef } from "react";

export default function AdsterraBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !ref.current) return;
    loaded.current = true;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://pl29736793.effectivecpmnetwork.com/919d7ef5bb4a3700e01c52eaff94c0ac/invoke.js";
    ref.current.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center my-3">
      <div ref={ref}>
        <div id="container-919d7ef5bb4a3700e01c52eaff94c0ac"></div>
      </div>
    </div>
  );
}
