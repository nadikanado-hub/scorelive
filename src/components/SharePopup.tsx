import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Match } from "@/data/matches";

interface SharePopupProps {
  match: Match;
  onClose: () => void;
}

const socials = [
  {
    name: "WhatsApp",
    color: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    getUrl: (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`,
  },
  {
    name: "Twitter",
    color: "#000000",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    getUrl: (text: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
  },
  {
    name: "Telegram",
    color: "#0088cc",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    getUrl: (text: string) => `https://t.me/share/url?url=${encodeURIComponent(text)}`,
  },
  {
    name: "Facebook",
    color: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    getUrl: (text: string) => `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`,
  },
];

const SharePopup = ({ match, onClose }: SharePopupProps) => {
  const [copied, setCopied] = useState(false);
  const shareText = `${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam} | ${match.league} ${match.status === "live" ? "🔴 LIVE" : ""}`;
  const shareUrl = window.location.href;
  const fullText = `${shareText}\n${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (getUrl: (text: string) => string) => {
    window.open(getUrl(fullText), "_blank", "noopener,noreferrer,width=600,height=400");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-up" style={{ animationDuration: '200ms' }} />

      {/* Popup */}
      <div
        className="relative w-full max-w-[340px] mx-4 rounded-3xl border border-border/40 overflow-hidden animate-slide-in"
        style={{
          background: 'hsl(var(--card) / 0.95)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3">
          <h3 className="text-base font-bold text-foreground">Share Match</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-border/30 hover:bg-muted/50 transition-all active:scale-90"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Match preview */}
        <div className="mx-5 p-3.5 rounded-2xl border border-border/20 mb-5" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm font-bold text-foreground">{match.homeShort}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-foreground">{match.homeScore}</span>
              <span className="text-xs text-muted-foreground">:</span>
              <span className="text-lg font-black text-foreground">{match.awayScore}</span>
            </div>
            <span className="text-sm font-bold text-foreground">{match.awayShort}</span>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-1">{match.league}</p>
        </div>

        {/* Social grid */}
        <div className="grid grid-cols-4 gap-3 px-5 mb-5">
          {socials.map((s) => (
            <button
              key={s.name}
              onClick={() => handleShare(s.getUrl)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-border/20 hover:border-primary/30 hover:scale-105 active:scale-95 transition-all duration-200"
              style={{ background: 'hsl(var(--muted) / 0.2)' }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: s.color }}
              >
                {s.icon}
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{s.name}</span>
            </button>
          ))}
        </div>

        {/* Copy link */}
        <div className="px-5 pb-6">
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border/30 hover:border-primary/30 transition-all active:scale-[0.98] font-semibold text-sm"
            style={{ background: 'hsl(var(--muted) / 0.3)' }}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-primary" />
                <span className="text-primary">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;
