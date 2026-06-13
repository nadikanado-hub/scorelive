import { Play, Clock, ChevronRight, Tv, Radio, Eye, Flame, Star } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { liveMatches, upcomingMatches, Match } from "@/data/matches";
import TeamLogo from "./TeamLogo";

interface WatchScreenProps {
  onMatchClick?: (match: Match) => void;
}

const gradients = [
  "from-emerald-800 via-teal-700 to-cyan-900",
  "from-violet-800 via-purple-700 to-indigo-900",
  "from-rose-800 via-red-700 to-orange-900",
];

const venues = ["Stamford Bridge", "San Siro", "Allianz Arena"];

const WatchScreen = ({ onMatchClick }: WatchScreenProps) => {
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIdx((s) => (s + 1) % liveMatches.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setFeaturedIdx((s) => (s + 1) % liveMatches.length);
      else setFeaturedIdx((s) => (s - 1 + liveMatches.length) % liveMatches.length);
    }
  }, []);

  const featured = liveMatches[featuredIdx];
  const viewerCounts = ["24.1k", "18.7k", "31.2k"];

  return (
    <div className="min-h-screen bg-background pb-28 pt-4 lg:pb-8 lg:pt-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-20 blur-[100px]"
          style={{ background: 'hsl(var(--primary) / 0.4)' }}
        />
        <div
          className="absolute bottom-20 -left-32 w-72 h-72 rounded-full opacity-15 blur-[100px]"
          style={{ background: 'hsl(var(--accent) / 0.4)' }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full opacity-10 blur-[80px]"
          style={{ background: 'hsl(var(--destructive) / 0.3)' }}
        />
      </div>

      {/* Header */}
      <header className="px-5 lg:px-8 animate-fade-up relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-2xl border border-primary/20"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))',
                boxShadow: '0 0 20px hsl(var(--primary) / 0.1)',
              }}
            >
              <Tv className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight">Watch</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">Live Streams</p>
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-destructive/20"
            style={{ background: 'hsl(var(--destructive) / 0.1)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
            </span>
            <span className="text-[10px] text-destructive font-bold">{liveMatches.length} LIVE</span>
          </div>
        </div>
      </header>

      {/* Featured Stream */}
      <section className="px-5 lg:px-8 mt-6 animate-fade-up-delay-1 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Featured Stream
          </h2>
        </div>

        <div
          className="relative rounded-3xl overflow-hidden cursor-pointer group"
          onClick={() => onMatchClick?.(featured)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${gradients[featuredIdx % gradients.length]} transition-all duration-700`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

          {/* Decorative */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/4 w-60 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -rotate-45" />
            <div className="absolute top-1/3 right-1/3 w-40 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent rotate-12" />
            <div className="absolute bottom-1/4 left-1/2 w-32 h-32 rounded-full bg-white/[0.02] blur-2xl" />
          </div>

          <div className="relative z-10 p-5">
            {/* Top row */}
            <div className="flex items-center justify-between mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/90 text-white text-[10px] font-bold shadow-lg shadow-destructive/30">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/70 text-[10px] font-medium">
                  <Eye className="h-3 w-3" />
                  {viewerCounts[featuredIdx % viewerCounts.length]}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-primary text-[10px] font-bold">
                  HD
                </span>
              </div>
            </div>

            {/* Teams & Score */}
            <div className="flex items-center justify-center gap-6 my-2">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
                  {featured.homeLogo ? (
                    <img src={featured.homeLogo} alt={featured.homeTeam} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                  ) : (
                    <span className="text-xl font-black text-white">{featured.homeShort}</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-white/80">{featured.homeTeam}</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black text-white drop-shadow-lg">{featured.homeScore}</span>
                  <span className="text-2xl text-white/30">:</span>
                  <span className="text-5xl font-black text-white drop-shadow-lg">{featured.awayScore}</span>
                </div>
                <span className="text-[10px] font-bold text-white/50 bg-white/10 px-2.5 py-0.5 rounded-full">{featured.matchTime}</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
                  {featured.awayLogo ? (
                    <img src={featured.awayLogo} alt={featured.awayTeam} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                  ) : (
                    <span className="text-xl font-black text-white">{featured.awayShort}</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-white/80">{featured.awayTeam}</span>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] text-white/40 font-medium">{venues[featuredIdx % venues.length]}</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">{featured.league}</span>
            </div>

            {/* Watch CTA */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 group-hover:bg-white/25 transition-all duration-300">
                <Play className="h-4 w-4 text-white" fill="currentColor" />
                <span className="text-xs font-bold text-white">Watch Now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {liveMatches.map((_, i) => (
            <button
              key={i}
              onClick={() => setFeaturedIdx(i)}
              className={`rounded-full transition-all duration-300 ${
                i === featuredIdx
                  ? "w-6 h-1.5 bg-foreground/80"
                  : "w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* All Live */}
      <section className="px-5 lg:px-8 mt-8 relative z-10">
        <div className="flex items-center justify-between mb-4 animate-fade-up-delay-2">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            All Live
          </h2>
          <button className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {liveMatches.map((match, i) => (
            <div
              key={match.id}
              onClick={() => onMatchClick?.(match)}
              className="rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-fade-up border border-border/30 hover:border-primary/30"
              style={{
                animationDelay: `${i * 80}ms`,
                background: 'hsl(var(--card) / 0.5)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-destructive/20" style={{ background: 'hsl(var(--destructive) / 0.1)' }}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-destructive" />
                  </span>
                  <span className="text-destructive text-[10px] font-bold">{match.matchTime}</span>
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  {viewerCounts[i % viewerCounts.length]}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <TeamLogo teamName={match.homeTeam} logo={match.homeLogo} shortName={match.homeShort} fallbackColor={match.homeColor} />
                  <span className="text-[10px] font-semibold text-foreground text-center leading-tight">{match.homeTeam}</span>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                  style={{ background: 'hsl(var(--destructive) / 0.08)' }}
                >
                  <span className="text-2xl font-black text-foreground">{match.homeScore}</span>
                  <span className="text-muted-foreground/30">:</span>
                  <span className="text-2xl font-black text-foreground">{match.awayScore}</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <TeamLogo teamName={match.awayTeam} logo={match.awayLogo} shortName={match.awayShort} fallbackColor={match.awayColor} />
                  <span className="text-[10px] font-semibold text-foreground text-center leading-tight">{match.awayTeam}</span>
                </div>
              </div>

              <div className="flex justify-center mt-3 pt-3 border-t border-border/10">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{match.league}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Up */}
      <section className="px-5 lg:px-8 mt-8 animate-fade-up-delay-2 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Coming Up
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {upcomingMatches.map((match, i) => (
            <div
              key={match.id}
              onClick={() => onMatchClick?.(match)}
              className="rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-fade-up border border-border/30 hover:border-primary/30"
              style={{
                animationDelay: `${(i + 3) * 80}ms`,
                background: 'hsl(var(--card) / 0.5)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <TeamLogo teamName={match.homeTeam} logo={match.homeLogo} shortName={match.homeShort} fallbackColor={match.homeColor} size="sm" />
                  <span className="text-sm font-semibold text-foreground">{match.homeTeam}</span>
                </div>
                <span className="text-xs text-muted-foreground/50 font-bold">VS</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-semibold text-foreground">{match.awayTeam}</span>
                  <TeamLogo teamName={match.awayTeam} logo={match.awayLogo} shortName={match.awayShort} fallbackColor={match.awayColor} size="sm" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/10">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground font-medium">{match.date} · {match.matchTime}</span>
                </div>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20 text-primary text-[10px] font-bold transition-colors"
                  style={{ background: 'hsl(var(--primary) / 0.1)' }}
                >
                  <Play className="h-3 w-3" /> Watch
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WatchScreen;