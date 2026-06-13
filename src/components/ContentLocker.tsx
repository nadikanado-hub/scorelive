import { useState, useEffect, useCallback, useRef } from "react";
import { Lock, Shield, Zap, Eye, Star, CheckCircle2, ExternalLink, ArrowLeft, Loader2, Play } from "lucide-react";
import lockerBg from "@/assets/locker-bg.jpg";

interface ContentLockerProps {
  onUnlocked: () => void;
  onClose: () => void;
}

interface Offer {
  anchor: string;
  url: string;
  conversion: string;
}

const OFFER_API_URL = "https://d2dzcaq3bhqk1m.cloudfront.net/public/offers/feed.php?user_id=321842&api_key=cfe031daa224cb470f9d4c9a7a531982&s1=&s2=&callback=?";
const LEAD_CHECK_URL = "https://d2dzcaq3bhqk1m.cloudfront.net/public/external/check2.php?testing=0&callback=?";

const ContentLocker = ({ onUnlocked, onClose }: ContentLockerProps) => {
  const [mounted, setMounted] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [viewerCount, setViewerCount] = useState(() => {
    const bases = [3, 4, 5, 6, 7, 8, 9, 10, 12, 15];
    return bases[Math.floor(Math.random() * bases.length)] * 1000 + Math.floor(Math.random() * 900);
  });
  const leadCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    const viewerInterval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 300) + 50);
    }, 4000);
    return () => {
      if (leadCheckRef.current) clearInterval(leadCheckRef.current);
      clearInterval(viewerInterval);
    };
  }, []);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const callbackName = `offerCb_${Date.now()}`;
      const promise = new Promise<Offer[]>((resolve) => {
        (window as any)[callbackName] = (data: Offer[]) => {
          resolve(data);
          delete (window as any)[callbackName];
        };
        const script = document.createElement("script");
        script.src = OFFER_API_URL.replace("callback=?", `callback=${callbackName}`);
        document.head.appendChild(script);
        script.onload = () => script.remove();
        script.onerror = () => { resolve([]); script.remove(); };
      });
      const data = await promise;
      setOffers(data.slice(0, 5));
    } catch {
      setOffers([]);
    }
    setLoading(false);
  }, []);

  const startLeadCheck = useCallback(() => {
    if (leadCheckRef.current) return;
    leadCheckRef.current = setInterval(() => {
      const callbackName = `leadCb_${Date.now()}`;
      (window as any)[callbackName] = (leads: any[]) => {
        delete (window as any)[callbackName];
        if (leads && leads.length > 0) {
          setUnlocked(true);
          if (leadCheckRef.current) clearInterval(leadCheckRef.current);
          setTimeout(() => onUnlocked(), 1500);
        }
      };
      const script = document.createElement("script");
      script.src = LEAD_CHECK_URL.replace("callback=?", `callback=${callbackName}`);
      document.head.appendChild(script);
      script.onload = () => script.remove();
    }, 15000);
  }, [onUnlocked]);

  const handleContinue = () => {
    setShowOffers(true);
    fetchOffers();
    startLeadCheck();
  };

  if (!showOffers) {
    return (
      <div className={`fixed inset-0 z-[100] flex items-start justify-center pt-4 lg:pt-12 overflow-y-auto transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
        <div className="absolute inset-0 bg-background" />
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-20 blur-[80px]" style={{ background: "hsl(var(--primary))" }} />
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full opacity-10 blur-[100px]" style={{ background: "hsl(var(--accent))" }} />

        <div className={`relative z-10 w-full max-w-md mx-3 lg:max-w-lg rounded-3xl overflow-hidden transition-all duration-700 ${mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            boxShadow: "var(--glass-shadow)",
            backdropFilter: `blur(var(--glass-blur))`,
          }}>

          {/* Hero image */}
          <div className="relative h-48 lg:h-64 overflow-hidden">
            <img src={lockerBg} alt="" className="w-full h-full object-cover" style={{ filter: "blur(1px) brightness(0.5)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, hsl(var(--background) / 0.6) 60%, hsl(var(--background)) 100%)" }} />
            {/* LIVE badge */}
            <div className="absolute top-4 right-4">
              <span className="px-4 py-1.5 text-[10px] font-bold tracking-[2px] rounded-full inline-flex items-center gap-1.5 bg-card/60 text-foreground border border-border backdrop-blur-lg">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" /> LIVE
              </span>
            </div>
            {/* Lock icon */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-8 lg:bottom-12">
              <div className="absolute inset-0 -m-10 rounded-full opacity-[0.08]" style={{ border: "1px solid hsl(var(--primary) / 0.5)", animation: "ping 3s cubic-bezier(0,0,0.2,1) infinite" }} />
              <div className="absolute inset-0 -m-6 rounded-full opacity-[0.12]" style={{ border: "1px solid hsl(var(--primary) / 0.4)", animation: "ping 3s cubic-bezier(0,0,0.2,1) infinite 0.5s" }} />
              <div className="absolute inset-0 -m-3 rounded-full opacity-[0.2]" style={{ border: "1px solid hsl(var(--primary) / 0.3)", animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }} />
              <div className="rounded-full flex items-center justify-center w-14 h-14 bg-card/80 backdrop-blur-xl border border-primary/20" style={{ boxShadow: "0 0 30px hsl(var(--primary) / 0.2)" }}>
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="px-5 pb-5 pt-2 lg:px-8 lg:pb-8 flex flex-col items-center">
            {/* Badge */}
            <span className="px-4 py-1.5 rounded-full text-[10px] lg:text-[11px] font-bold tracking-[2px] mb-3 bg-primary/10 text-primary border border-primary/25">
              <Shield className="inline h-3 w-3 mr-1.5 -mt-0.5" />
              VERIFICATION REQUIRED
            </span>

            <h2 className="text-3xl lg:text-4xl font-black tracking-wide mb-1 text-foreground"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "3px" }}>
              YOU'RE ALMOST IN
            </h2>
            <p className="text-xs lg:text-sm text-center mb-4 max-w-xs text-muted-foreground">
              The match is <strong className="text-foreground/70">LIVE right now</strong> — verify to start streaming in HD
            </p>

            {/* Features */}
            <div className="flex gap-2 lg:gap-3 mb-4 flex-wrap justify-center">
              {[
                { icon: <Zap className="h-3 w-3" />, label: "4K HDR" },
                { icon: <Star className="h-3 w-3" />, label: "Instant" },
                { icon: <Eye className="h-3 w-3" />, label: "Ad-Free" },
              ].map((f, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] lg:text-[11px] font-semibold bg-secondary/50 text-muted-foreground border border-border">
                  {f.icon} {f.label}
                </span>
              ))}
            </div>

            {/* Viewer count */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-muted-foreground bg-secondary">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                <strong className="text-foreground/60">{viewerCount >= 1000 ? `${(viewerCount / 1000).toFixed(1)}k+` : viewerCount}</strong> watching now
              </span>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleContinue}
              className="w-full py-4 lg:py-5 rounded-2xl text-sm lg:text-base font-bold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-primary text-primary-foreground"
              style={{ boxShadow: "var(--shadow-button)" }}>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Play className="h-4 w-4" />
                Continue to Watch
              </span>
            </button>

            <div className="flex items-center gap-1.5 mt-3">
              <Shield className="h-3 w-3 text-muted-foreground/50" />
              <span className="text-[9px] lg:text-[10px] text-muted-foreground/50">
                Quick & secure · Less than 60 seconds
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Offers view
  return (
    <div className={`fixed inset-0 z-[100] flex items-start justify-center pt-4 lg:pt-12 overflow-y-auto transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-20 right-10 w-40 h-40 rounded-full opacity-15 blur-[80px]" style={{ background: "hsl(var(--primary))" }} />

      {/* Unlocked overlay */}
      {unlocked && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="animate-scale-in flex flex-col items-center gap-3">
            <CheckCircle2 className="h-16 w-16 text-primary" />
            <h3 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "2px" }}>
              VERIFIED!
            </h3>
            <p className="text-sm text-muted-foreground">Starting stream...</p>
          </div>
        </div>
      )}

      <div className={`relative z-10 w-full max-w-md mx-3 lg:max-w-lg rounded-3xl overflow-hidden transition-all duration-700 ${
        unlocked ? "scale-105 opacity-0 blur-sm" : "scale-100 opacity-100"
      }`}
        style={{
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--glass-shadow)",
          backdropFilter: `blur(var(--glass-blur))`,
        }}>

        {/* Header */}
        <div className="relative h-28 lg:h-36 overflow-hidden">
          <img src={lockerBg} alt="" className="w-full h-full object-cover" style={{ filter: "blur(2px) brightness(0.35)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, hsl(var(--background)) 100%)" }} />
          <button onClick={() => setShowOffers(false)} className="absolute top-4 left-4 p-2 rounded-full transition-colors hover:bg-secondary text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <h2 className="text-2xl lg:text-3xl font-black flex items-center justify-center gap-2 text-foreground" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "2px" }}>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
              </span>
              STREAM IS LIVE NOW
            </h2>
            <p className="text-[10px] lg:text-xs mt-1 text-muted-foreground">
              🎯 Complete just 1 free offer below to unlock your stream
            </p>
          </div>
        </div>

        {/* Offers list */}
        <div className="px-4 pb-5 pt-2 lg:px-6 lg:pb-8 space-y-2.5">
          {loading ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Loading offers...</span>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-muted-foreground">No offers available right now. Try again later.</p>
              <button onClick={fetchOffers} className="mt-3 text-xs font-semibold px-4 py-2 rounded-full text-primary border border-primary/30 hover:bg-primary/10 transition-colors">
                Retry
              </button>
            </div>
          ) : (
            offers.map((offer, i) => (
              <a
                key={i}
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 lg:p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group/offer bg-secondary/30 border border-border hover:border-primary/20 hover:bg-secondary/50"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold bg-primary/15 text-primary border border-primary/20">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs lg:text-sm font-medium text-foreground/80 truncate">{offer.anchor}</p>
                  <p className="text-[10px] mt-0.5 truncate text-muted-foreground">{offer.conversion}</p>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 transition-transform group-hover/offer:translate-x-0.5 text-muted-foreground/40" />
              </a>
            ))
          )}

          {offers.length > 0 && (
            <div className="flex items-center justify-center gap-2 pt-3">
              <div className="w-2 h-2 rounded-full animate-pulse bg-primary" />
              <span className="text-[10px] text-muted-foreground">
                Waiting for completion — auto-detects in seconds
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentLocker;
