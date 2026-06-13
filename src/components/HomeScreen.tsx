import { ChevronRight, Flame, Eye, Play, Radio, Trophy, TrendingUp } from "lucide-react";
import { useState, useRef, useCallback, useEffect, Fragment } from "react";
import { standingsData, Match } from "@/data/matches";
import { fetchLiveMatches, fetchFixturesByDate } from "@/services/footballApi";
import TeamLogo from "./TeamLogo";
import AdsterraBanner from "./AdsterraBanner";

interface HomeScreenProps {
  onMatchClick?: (match: Match) => void;
  onViewAllLive?: () => void;
}

const HomeScreen = ({ onMatchClick, onViewAllLive }: HomeScreenProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const loadData = useCallback(async () => {
    const today = new Date().toISOString().split("T")[0];
    const [live, todays] = await Promise.all([
      fetchLiveMatches(),
      fetchFixturesByDate(today),
    ]);
    const wc = (m: Match) => /world cup|fifa|coupe du monde|mondial/i.test(m.league);
    const sortWC = (a: Match, b: Match) => Number(wc(b)) - Number(wc(a));
    setLiveMatches([...live].sort(sortWC));
    setUpcomingMatches(todays.filter((m) => m.status === "upcoming").sort(sortWC));
  }, []);

  useEffect(() => {
    loadData();
    const t = setInterval(loadData, 60000);
    return () => clearInterval(t);
  }, [loadData]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeSlide < liveMatches.length - 1) {
        setActiveSlide((s) => s + 1);
      } else if (diff < 0 && activeSlide > 0) {
        setActiveSlide((s) => s - 1);
      }
    }
  }, [activeSlide, liveMatches.length]);

  useEffect(() => {
    if (liveMatches.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((s) => (s + 1) % liveMatches.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [liveMatches.length]);

  const featuredMatch = liveMatches[activeSlide];
  const allMatches = [...liveMatches.slice(0, 4), ...upcomingMatches.slice(0, Math.max(0, 4 - liveMatches.length))].slice(0, 4);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-background pb-28 pt-5 lg:pb-8 lg:pt-8 relative overflow-hidden">
      {/* Floating background orbs */}
      <div className="floating-orb floating-orb-1" style={{ top: '-5%', right: '-10%' }} />
      <div className="floating-orb floating-orb-2" style={{ bottom: '20%', left: '-8%' }} />

      {/* Greeting */}
      <div className="px-5 lg:px-8 mb-6 animate-fade-up relative z-10">
        <p className="text-[10px] text-muted-foreground font-bold tracking-[0.3em] uppercase mb-1">{getGreeting()}</p>
        <h1 className="text-[34px] sm:text-4xl font-black text-foreground leading-[0.95] tracking-tight">
          Live Football<br />
          <span className="text-primary">Scores &amp; Fixtures</span>
        </h1>
      </div>

      {/* ── Featured Live Match ── */}
      <div className="px-5 lg:px-8 animate-fade-up-delay-1 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Flame className="h-4 w-4 text-destructive" />
            Live Now
          </h2>
          <button onClick={onViewAllLive} aria-label="View all live football matches" className="text-[11px] text-primary font-semibold flex items-center gap-0.5 hover:underline">
            View All <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {featuredMatch && (
          <div
            className="relative rounded-3xl overflow-hidden cursor-pointer group"
            onClick={() => onMatchClick?.(featuredMatch)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${
              ["from-emerald-900/90 via-teal-800/80 to-cyan-900/90", "from-violet-900/90 via-purple-800/80 to-indigo-900/90", "from-rose-900/90 via-red-800/80 to-orange-900/90"][activeSlide % 3]
            } transition-all duration-700`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/5" />

            {/* Glass refraction effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/4 w-60 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent -rotate-45" />
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/[0.04] blur-3xl animate-float" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/[0.04] blur-3xl" />
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            </div>

            <div className="relative z-10 p-5 pb-5">
              {/* Status bar */}
              <div className="flex items-center justify-between mb-5">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--destructive) / 0.9), hsl(var(--destructive) / 0.7))',
                    color: 'hsl(var(--destructive-foreground))',
                    boxShadow: '0 4px 15px hsl(var(--destructive) / 0.3)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-white/50 text-[10px] font-medium"
                  style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
                >
                  <Eye className="h-3 w-3" />
                  {["24.1k", "18.7k", "31.2k"][activeSlide % 3]}
                </span>
              </div>

              {/* Teams & Score */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/15 group-hover:scale-110 transition-transform duration-500"
                    style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
                  >
                    {featuredMatch.homeLogo ? (
                      <img src={featuredMatch.homeLogo} alt={featuredMatch.homeTeam} className="w-10 h-10 object-contain drop-shadow-lg" />
                    ) : (
                      <span className="text-lg font-black text-white">{featuredMatch.homeShort}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-white/80 text-center leading-tight max-w-[80px] truncate">{featuredMatch.homeTeam}</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-5xl font-black text-white leading-none" style={{ textShadow: '0 0 30px rgba(255,255,255,0.2)' }}>{featuredMatch.homeScore}</span>
                    <span className="text-2xl text-white/20 font-light">:</span>
                    <span className="text-5xl font-black text-white leading-none" style={{ textShadow: '0 0 30px rgba(255,255,255,0.2)' }}>{featuredMatch.awayScore}</span>
                  </div>
                  <span className="text-[10px] font-bold text-white/50 px-3 py-1 rounded-full border border-white/10" style={{ background: 'rgba(255,255,255,0.06)' }}>{featuredMatch.matchTime}</span>
                </div>

                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/15 group-hover:scale-110 transition-transform duration-500"
                    style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
                  >
                    {featuredMatch.awayLogo ? (
                      <img src={featuredMatch.awayLogo} alt={featuredMatch.awayTeam} className="w-10 h-10 object-contain drop-shadow-lg" />
                    ) : (
                      <span className="text-lg font-black text-white">{featuredMatch.awayShort}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-white/80 text-center leading-tight max-w-[80px] truncate">{featuredMatch.awayTeam}</span>
                </div>
              </div>

              {/* League + Watch CTA */}
              <div className="flex flex-col items-center gap-3 mt-6">
                <span className="text-[10px] text-white/35 font-semibold tracking-wider uppercase">{featuredMatch.league}</span>
                <div
                  role="button"
                  aria-label={`Watch live stream of ${featuredMatch.homeTeam} vs ${featuredMatch.awayTeam}`}
                  className="relative flex items-center gap-3 px-8 py-3 rounded-full border border-white/15 overflow-hidden group-hover:border-primary/40 transition-all duration-500 group-hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary) / 0.12), rgba(255,255,255,0.04))',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    boxShadow: '0 0 25px hsl(var(--primary) / 0.08), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.1)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-full pointer-events-none" />
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: '0 0 30px hsl(var(--primary) / 0.25), inset 0 0 20px hsl(var(--primary) / 0.08)' }}
                  />
                  <div className="relative w-9 h-9 rounded-full flex items-center justify-center border border-primary/25"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.25), hsl(var(--primary) / 0.1))', boxShadow: '0 0 12px hsl(var(--primary) / 0.2)' }}
                  >
                    <Play className="h-4 w-4 text-primary ml-0.5" fill="currentColor" />
                  </div>
                  <span className="relative text-[13px] font-black text-white tracking-widest uppercase">Watch Live</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {liveMatches.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              aria-label={`Show featured match ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeSlide
                  ? "w-6 h-1.5 bg-primary"
                  : "w-1.5 h-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Matches Grid ── */}
      <div className="px-5 lg:px-8 mt-8 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            Today's Matches
          </h2>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            {/* Mobile: vertical stacked rows. Tablet+: 2-col grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {allMatches.map((match, i) => {
                const isLive = match.status === "live";
                return (
                  <Fragment key={match.id}>
                    {i === 4 && (
                      <div className="col-span-1 sm:col-span-2">
                        <AdsterraBanner />
                      </div>
                    )}
                  <div
                    className="animate-fade-up cursor-pointer"
                    style={{ animationDelay: `${(i + 2) * 80}ms` }}
                    onClick={() => onMatchClick?.(match)}
                  >
                    {/* Horizontal row layout on mobile (stacked teams left, status right) */}
                    <div className="sm:hidden glass-card-solid rounded-[26px] p-4 flex items-center hover:border-primary/30 transition-all duration-300 active:scale-[0.99]">
                      <div className="flex-1 flex flex-col gap-3 min-w-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <TeamLogo
                            teamName={match.homeTeam}
                            logo={match.homeLogo}
                            shortName={match.homeShort}
                            fallbackColor={match.homeColor}
                          />
                          <span className="text-sm font-bold text-foreground truncate flex-1">{match.homeTeam}</span>
                          <span className={`text-base font-black tabular-nums ${isLive ? "text-primary" : "text-muted-foreground/40"}`}>
                            {isLive ? match.homeScore : "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 min-w-0">
                          <TeamLogo
                            teamName={match.awayTeam}
                            logo={match.awayLogo}
                            shortName={match.awayShort}
                            fallbackColor={match.awayColor}
                          />
                          <span className="text-sm font-bold text-foreground/80 truncate flex-1">{match.awayTeam}</span>
                          <span className={`text-base font-black tabular-nums ${isLive ? "text-foreground" : "text-muted-foreground/40"}`}>
                            {isLive ? match.awayScore : "-"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 pl-4 border-l border-border/40 flex flex-col items-center justify-center min-w-[62px]">
                        {isLive ? (
                          <>
                            <span className="text-[10px] font-black text-destructive tracking-widest uppercase flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                              LIVE
                            </span>
                            <span className="text-base font-black text-foreground mt-1 tabular-nums">{match.matchTime}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] font-bold text-muted-foreground/60 tracking-widest uppercase">{match.date ? "TODAY" : "SOON"}</span>
                            <span className="text-base font-black text-foreground mt-1 tabular-nums">{match.matchTime}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Tablet/Desktop: original 2-col card */}
                    <div className="hidden sm:flex glass-card-solid rounded-2xl p-3.5 sm:p-4 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] h-full flex-col">
                      <div className="flex justify-center mb-3">
                        {isLive ? (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 border border-destructive/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                            <span className="text-destructive text-[10px] font-bold">{match.matchTime}</span>
                          </span>
                        ) : (
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground font-medium">{match.date}</p>
                            <p className="text-sm font-bold text-foreground">{match.matchTime}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-1 flex-1">
                        <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                          <TeamLogo teamName={match.homeTeam} logo={match.homeLogo} shortName={match.homeShort} fallbackColor={match.homeColor} />
                          <span className="text-[10px] font-semibold text-foreground text-center leading-tight truncate w-full">{match.homeTeam}</span>
                        </div>
                        <div className="flex flex-col items-center shrink-0 px-1">
                          {isLive ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xl font-black text-foreground">{match.homeScore}</span>
                              <span className="text-sm text-muted-foreground/30">:</span>
                              <span className="text-xl font-black text-foreground">{match.awayScore}</span>
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-muted-foreground/30">VS</span>
                          )}
                        </div>
                        <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                          <TeamLogo teamName={match.awayTeam} logo={match.awayLogo} shortName={match.awayShort} fallbackColor={match.awayColor} />
                          <span className="text-[10px] font-semibold text-foreground text-center leading-tight truncate w-full">{match.awayTeam}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  </Fragment>
                );
              })}
            </div>
          </div>

          {/* Standings - Desktop */}
          <div className="hidden lg:block animate-fade-up-delay-4">
            <div className="glass-card-solid p-5 rounded-3xl sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  Standings
                </h3>
                <span onClick={onViewAllLive} className="text-[10px] text-primary font-medium cursor-pointer hover:underline">Full Table</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-muted-foreground/60 border-b border-border/30 uppercase tracking-wider">
                    <th className="text-left py-2 font-medium">#</th>
                    <th className="text-left py-2 font-medium">Team</th>
                    <th className="text-center py-2 font-medium">P</th>
                    <th className="text-center py-2 font-medium">GD</th>
                    <th className="text-center py-2 font-medium">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standingsData.map((row, idx) => (
                    <tr key={row.pos} className="border-b border-border/10 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="py-2.5 text-muted-foreground text-xs">{row.pos}</td>
                      <td className="py-2.5 font-medium text-xs">
                        <div className="flex items-center gap-2">
                          {row.logo && <img src={row.logo} alt={row.team} className="team-logo-sm" />}
                          {row.team}
                        </div>
                      </td>
                      <td className="py-2.5 text-center text-muted-foreground text-xs">{row.p}</td>
                      <td className={`py-2.5 text-center text-xs font-medium ${row.gd > 0 ? "text-primary" : "text-muted-foreground"}`}>
                        {row.gd > 0 ? `+${row.gd}` : row.gd}
                      </td>
                      <td className="py-2.5 text-center font-bold text-xs text-foreground">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Standings */}
      <div className="lg:hidden px-5 mt-8 relative z-10 animate-fade-up-delay-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Standings
          </h2>
          <span onClick={onViewAllLive} className="text-[10px] text-primary font-medium cursor-pointer hover:underline">Full Table</span>
        </div>
        <div className="glass-card-solid rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-muted-foreground/60 border-b border-border/30 uppercase tracking-wider">
                <th className="text-left py-2 font-medium">#</th>
                <th className="text-left py-2 font-medium">Team</th>
                <th className="text-center py-2 font-medium">P</th>
                <th className="text-center py-2 font-medium">GD</th>
                <th className="text-center py-2 font-medium">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standingsData.slice(0, 5).map((row) => (
                <tr key={row.pos} className="border-b border-border/10 last:border-0">
                  <td className="py-2 text-muted-foreground text-xs">{row.pos}</td>
                  <td className="py-2 font-medium text-xs">
                    <div className="flex items-center gap-2">
                      {row.logo && <img src={row.logo} alt={row.team} className="team-logo-sm" />}
                      {row.team}
                    </div>
                  </td>
                  <td className="py-2 text-center text-muted-foreground text-xs">{row.p}</td>
                  <td className={`py-2 text-center text-xs font-medium ${row.gd > 0 ? "text-primary" : "text-muted-foreground"}`}>
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="py-2 text-center font-bold text-xs text-foreground">{row.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
