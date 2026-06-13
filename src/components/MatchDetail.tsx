import { ArrowLeft, Share2, Bell, Play, Pause, Volume2, VolumeX, Maximize2, Radio, Eye, Trophy, TrendingUp, Timer, Zap } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import SharePopup from "./SharePopup";
import { Match, standingsData } from "@/data/matches";
import TeamLogo from "./TeamLogo";
import ContentLocker from "./ContentLocker";
import LiveStreamPlayer from "./LiveStreamPlayer";

interface MatchDetailProps {
  match: Match;
  onBack: () => void;
}

const MatchDetail = ({ match, onBack }: MatchDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showShare, setShowShare] = useState(false);
  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "live-ticker", label: "Ticker", icon: Zap },
    { id: "line-up", label: "Line Up", icon: Trophy },
  ];

  const isLive = match.status === "live";

  return (
    <div className="min-h-screen bg-background pb-28 lg:pb-8 relative overflow-x-hidden" style={{ maxWidth: "100vw" }}>
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
          style={{ background: 'hsl(var(--primary) / 0.5)' }}
        />
        <div
          className="absolute bottom-20 -left-32 w-72 h-72 rounded-full opacity-10 blur-[100px]"
          style={{ background: 'hsl(var(--accent) / 0.4)' }}
        />
        {isLive && (
          <div
            className="absolute top-1/4 right-0 w-64 h-64 rounded-full opacity-8 blur-[80px]"
            style={{ background: 'hsl(var(--destructive) / 0.2)' }}
          />
        )}
      </div>

      {/* Header - minimal floating */}
      <div className="px-4 pt-3 lg:px-8 lg:pt-6 relative z-10">
        <div className="flex items-center justify-between animate-fade-up">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-border/30 transition-all duration-300 hover:scale-105 active:scale-95 hover:border-primary/30"
            style={{ background: 'hsl(var(--muted) / 0.3)', backdropFilter: 'blur(20px)' }}
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex gap-1.5">
            <button
              className="p-2 rounded-xl border border-border/30 transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ background: 'hsl(var(--muted) / 0.3)', backdropFilter: 'blur(20px)' }}
            >
              <Bell className="h-4.5 w-4.5 text-muted-foreground" />
            </button>
            <button
              onClick={() => setShowShare(true)}
              className="p-2 rounded-xl border border-border/30 transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ background: 'hsl(var(--muted) / 0.3)', backdropFilter: 'blur(20px)' }}
            >
              <Share2 className="h-4.5 w-4.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Score Hero - Premium Card */}
      <div className="px-4 mt-3 lg:px-8 animate-fade-up-delay-1 relative z-10">
        <div
          className="rounded-3xl p-5 relative overflow-hidden border border-border/20"
          style={{
            background: 'linear-gradient(145deg, hsl(var(--card) / 0.8), hsl(var(--card) / 0.4))',
            backdropFilter: 'blur(30px)',
          }}
        >
          {/* Gradient accent */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 rounded-full opacity-20 blur-[60px]"
              style={{ background: isLive ? 'hsl(var(--destructive))' : 'hsl(var(--primary))' }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </div>

          {/* League badge */}
          <div className="flex justify-center mb-4 relative z-10">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-3 py-1 rounded-full border border-border/20"
              style={{ background: 'hsl(var(--muted) / 0.2)' }}
            >
              {match.league}
            </span>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            {/* Home */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-16 h-16 rounded-2xl border border-border/20 flex items-center justify-center transition-transform hover:scale-105"
                style={{ background: 'hsl(var(--muted) / 0.15)' }}
              >
                {match.homeLogo ? (
                  <img src={match.homeLogo} alt={match.homeTeam} className="w-10 h-10 object-contain" />
                ) : (
                  <span className="text-lg font-black text-foreground">{match.homeShort}</span>
                )}
              </div>
              <span className="text-[11px] font-bold text-foreground text-center leading-tight">{match.homeTeam}</span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-1.5 mx-2">
              {isLive && (
                <span
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-destructive/25 mb-0.5"
                  style={{ background: 'hsl(var(--destructive) / 0.12)' }}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-destructive" />
                  </span>
                  <span className="text-destructive text-[10px] font-black">{match.matchTime}</span>
                </span>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-foreground tabular-nums">{match.homeScore}</span>
                <span className="text-lg text-muted-foreground/30 font-bold">–</span>
                <span className="text-5xl font-black text-foreground tabular-nums">{match.awayScore}</span>
              </div>
              {match.status === "finished" && (
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">Full Time</span>
              )}
              {match.status === "upcoming" && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold mt-0.5">
                  <Timer className="h-3 w-3" />
                  {match.matchTime}
                </span>
              )}
            </div>

            {/* Away */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-16 h-16 rounded-2xl border border-border/20 flex items-center justify-center transition-transform hover:scale-105"
                style={{ background: 'hsl(var(--muted) / 0.15)' }}
              >
                {match.awayLogo ? (
                  <img src={match.awayLogo} alt={match.awayTeam} className="w-10 h-10 object-contain" />
                ) : (
                  <span className="text-lg font-black text-foreground">{match.awayShort}</span>
                )}
              </div>
              <span className="text-[11px] font-bold text-foreground text-center leading-tight">{match.awayTeam}</span>
            </div>
          </div>

          {/* Quick goal summary inline */}
          {match.goals && match.goals.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border/10 relative z-10">
              <div className="flex justify-between gap-4">
                <div className="flex-1 space-y-0.5">
                  {match.goals.filter(g => g.team === "home").map((g, i) => (
                    <p key={i} className="text-[10px] text-muted-foreground">
                      <span className="text-foreground font-semibold">{g.player}</span> {g.minute}
                    </p>
                  ))}
                </div>
                <div className="flex-1 space-y-0.5 text-right">
                  {match.goals.filter(g => g.team === "away").map((g, i) => (
                    <p key={i} className="text-[10px] text-muted-foreground">
                      {g.minute} <span className="text-foreground font-semibold">{g.player}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4 lg:px-8 animate-fade-up-delay-2 relative z-10">
        <div
          className="flex gap-1 p-1 rounded-2xl border border-border/20"
          style={{ background: 'hsl(var(--card) / 0.4)', backdropFilter: 'blur(20px)' }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={isActive ? {
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))',
                  boxShadow: '0 4px 16px hsl(var(--primary) / 0.3)',
                } : {}}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 mt-4 lg:px-8 animate-fade-up-delay-3 relative z-10">
        {activeTab === "overview" && <OverviewTab match={match} />}
        {activeTab === "live-ticker" && <LiveTickerTab match={match} />}
        {activeTab === "line-up" && <LineUpTab match={match} />}
      </div>

      {showShare && <SharePopup match={match} onClose={() => setShowShare(false)} />}
    </div>
  );
};

const OverviewTab = ({ match }: { match: Match }) => {
  return (
    <>
      <div className="space-y-3">
        {/* Live Stream — only available while the match is in progress */}
        {match.status === "live" ? (
          <LiveStreamPlayer match={match} />
        ) : (
          <div
            className="rounded-2xl overflow-hidden border border-border/20 w-full"
            style={{ background: 'hsl(var(--card) / 0.4)', backdropFilter: 'blur(20px)' }}
          >
            <div className="relative w-full" style={{ height: 0, paddingBottom: "56.25%" }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  {match.status === "finished" ? "Full Time" : `Kick-off ${match.matchTime}`}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {match.status === "finished"
                    ? "This match has ended — stream is no longer available."
                    : "Live stream will be available once the match kicks off."}
                </div>
              </div>
            </div>
          </div>
        )}




        {/* Statistics */}
        {match.stats && (
          <div
            className="p-4 rounded-2xl border border-border/20"
            style={{ background: 'hsl(var(--card) / 0.4)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                Match Stats
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[9px] text-muted-foreground font-medium">{match.homeShort}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                  <span className="text-[9px] text-muted-foreground font-medium">{match.awayShort}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3.5">
              {[
                { label: "Possession", values: match.stats.possession, suffix: "%" },
                { label: "Shots", values: match.stats.shots },
                { label: "On Target", values: match.stats.shotsOnTarget },
                { label: "Corners", values: match.stats.corners },
                { label: "Fouls", values: match.stats.fouls },
                { label: "Yellow Cards", values: match.stats.yellowCards },
              ].map((stat) => {
                const total = stat.values[0] + stat.values[1];
                const homePct = total > 0 ? (stat.values[0] / total) * 100 : 50;
                return (
                  <div key={stat.label}>
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="font-bold text-foreground tabular-nums w-8">{stat.values[0]}{stat.suffix || ""}</span>
                      <span className="text-muted-foreground font-medium">{stat.label}</span>
                      <span className="font-bold text-foreground tabular-nums w-8 text-right">{stat.values[1]}{stat.suffix || ""}</span>
                    </div>
                    <div className="flex gap-0.5 h-1.5">
                      <div className="flex-1 rounded-full overflow-hidden flex justify-end" style={{ background: 'hsl(var(--muted) / 0.2)' }}>
                        <div
                          className="rounded-full transition-all duration-700"
                          style={{
                            width: `${homePct}%`,
                            background: homePct > 50
                              ? 'linear-gradient(90deg, hsl(var(--primary) / 0.6), hsl(var(--primary)))'
                              : 'hsl(var(--primary) / 0.7)',
                          }}
                        />
                      </div>
                      <div className="flex-1 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted) / 0.2)' }}>
                        <div
                          className="rounded-full transition-all duration-700 bg-muted-foreground/40"
                          style={{
                            width: `${100 - homePct}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Live Table */}
        <div
          className="p-4 rounded-2xl border border-border/20"
          style={{ background: 'hsl(var(--card) / 0.4)', backdropFilter: 'blur(20px)' }}
        >
          <h3 className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            Standings
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[9px] text-muted-foreground border-b border-border/15 uppercase tracking-wider">
                  <th className="text-left py-2 pr-2 w-6">#</th>
                  <th className="text-left py-2">Team</th>
                  <th className="text-center py-2 px-1.5">P</th>
                  <th className="text-center py-2 px-1.5">GD</th>
                  <th className="text-center py-2 pl-1.5">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standingsData.map((row, i) => {
                  const isHighlighted = row.team === match.homeTeam || row.team === match.awayTeam;
                  return (
                    <tr
                      key={row.pos}
                      className={`border-b border-border/8 last:border-0 transition-colors ${
                        isHighlighted ? '' : 'hover:bg-muted/10'
                      }`}
                      style={isHighlighted ? { background: 'hsl(var(--primary) / 0.06)' } : {}}
                    >
                      <td className="py-2 pr-2 text-muted-foreground text-[10px] font-medium">
                        <span
                          className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold ${
                            i < 4 ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          {row.pos}
                        </span>
                      </td>
                      <td className="py-2 font-medium text-[11px]">
                        <div className="flex items-center gap-2">
                          {row.logo && <img src={row.logo} alt={row.team} className="w-4 h-4 object-contain" />}
                          <span className={`${isHighlighted ? 'text-primary font-bold' : 'text-foreground'}`}>{row.team}</span>
                        </div>
                      </td>
                      <td className="py-2 text-center text-muted-foreground text-[10px]">{row.p}</td>
                      <td className={`py-2 text-center text-[10px] font-medium ${row.gd > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                        {row.gd > 0 ? `+${row.gd}` : row.gd}
                      </td>
                      <td className="py-2 text-center font-black text-[11px]">{row.pts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

const LiveTickerTab = ({ match }: { match: Match }) => (
  <div className="space-y-2.5">
    {match.ticker ? match.ticker.map((event, i) => {
      const isGoal = event.event.toLowerCase().includes("goal");
      const isCard = event.event.toLowerCase().includes("card");
      return (
        <div
          key={i}
          className="p-3.5 rounded-2xl flex gap-3 animate-fade-up border border-border/20"
          style={{
            animationDelay: `${i * 60}ms`,
            background: isGoal
              ? 'linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--card) / 0.4))'
              : 'hsl(var(--card) / 0.4)',
            backdropFilter: 'blur(20px)',
            ...(isGoal ? { borderColor: 'hsl(var(--primary) / 0.2)' } : {}),
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                isGoal
                  ? 'text-primary border-primary/20'
                  : isCard
                    ? 'text-yellow-500 border-yellow-500/20'
                    : 'text-muted-foreground border-border/20'
              }`}
              style={{
                background: isGoal
                  ? 'hsl(var(--primary) / 0.1)'
                  : isCard
                    ? 'rgba(234,179,8,0.1)'
                    : 'hsl(var(--muted) / 0.2)',
              }}
            >
              {event.minute}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
              {isGoal && "⚽ "}{event.event}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{event.detail}</p>
          </div>
        </div>
      );
    }) : (
      <div
        className="text-center py-16 rounded-2xl border border-border/20"
        style={{ background: 'hsl(var(--card) / 0.4)', backdropFilter: 'blur(20px)' }}
      >
        <Zap className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground font-medium text-sm">No ticker data yet</p>
        <p className="text-[11px] text-muted-foreground/60 mt-1">Events will appear here in real-time</p>
      </div>
    )}
  </div>
);

const LineUpTab = ({ match }: { match: Match }) => {
  if (!match.lineup) return (
    <div
      className="text-center py-16 rounded-2xl border border-border/20"
      style={{ background: 'hsl(var(--card) / 0.4)', backdropFilter: 'blur(20px)' }}
    >
      <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
      <p className="text-muted-foreground font-medium text-sm">Lineup not available</p>
      <p className="text-[11px] text-muted-foreground/60 mt-1">Check back closer to kick-off</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Pitch View */}
      <div
        className="rounded-2xl p-3 overflow-hidden border border-border/20"
        style={{ background: 'hsl(var(--card) / 0.4)', backdropFilter: 'blur(20px)' }}
      >
        <div className="relative rounded-xl overflow-hidden aspect-[2/3] max-h-[480px]"
          style={{
            background: 'linear-gradient(180deg, hsl(142 40% 12% / 0.6), hsl(142 35% 10% / 0.6))',
          }}
        >
          {/* Pitch lines */}
          <div className="absolute inset-3 border border-white/10 rounded-lg">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[15%] border-b border-l border-r border-white/10 rounded-b-lg" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[15%] border-t border-l border-r border-white/10 rounded-t-lg" />
            <div className="absolute top-1/2 left-0 right-0 border-t border-white/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/10 rounded-full" />
          </div>

          {/* Home players */}
          <div className="absolute inset-0 top-0 bottom-1/2">
            {match.lineup.home.slice(0, 11).map((player, i) => {
              const positions = getPlayerPosition(i, "home");
              return (
                <div key={i} className="absolute flex flex-col items-center" style={{ left: `${positions.x}%`, top: `${positions.y}%`, transform: "translate(-50%, -50%)" }}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-blue-400/40"
                    style={{ background: 'linear-gradient(135deg, hsl(217 80% 50%), hsl(217 80% 35%))' }}
                  >
                    {player.number}
                  </div>
                  <span className="text-[8px] text-white/70 mt-0.5 whitespace-nowrap font-medium">{player.name.split(" ").pop()}</span>
                </div>
              );
            })}
          </div>

          {/* Away players */}
          <div className="absolute inset-0 top-1/2 bottom-0">
            {match.lineup.away.slice(0, 11).map((player, i) => {
              const positions = getPlayerPosition(i, "away");
              return (
                <div key={i} className="absolute flex flex-col items-center" style={{ left: `${positions.x}%`, top: `${positions.y}%`, transform: "translate(-50%, -50%)" }}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground border border-yellow-400/40"
                    style={{ background: 'linear-gradient(135deg, hsl(45 90% 50%), hsl(45 80% 35%))' }}
                  >
                    {player.number}
                  </div>
                  <span className="text-[8px] text-white/70 mt-0.5 whitespace-nowrap font-medium">{player.name.split(" ").pop()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Player Lists */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { team: match.homeTeam, logo: match.homeLogo, short: match.homeShort, color: match.homeColor, players: match.lineup.home },
          { team: match.awayTeam, logo: match.awayLogo, short: match.awayShort, color: match.awayColor, players: match.lineup.away },
        ].map((side) => (
          <div
            key={side.team}
            className="p-3.5 rounded-2xl border border-border/20"
            style={{ background: 'hsl(var(--card) / 0.4)', backdropFilter: 'blur(20px)' }}
          >
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <TeamLogo teamName={side.team} logo={side.logo} size="sm" shortName={side.short} fallbackColor={side.color} />
              {side.team}
            </h4>
            <div className="space-y-1">
              {side.players.map((p, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-muted-foreground w-4 text-[10px] font-medium">{p.number}</span>
                  <span className="font-medium text-foreground truncate">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getPlayerPosition(index: number, team: "home" | "away"): { x: number; y: number } {
  const formations: Record<number, { x: number; y: number }> = {
    0: { x: 50, y: 90 },
    1: { x: 80, y: 70 },
    2: { x: 60, y: 75 },
    3: { x: 40, y: 75 },
    4: { x: 20, y: 70 },
    5: { x: 65, y: 50 },
    6: { x: 35, y: 50 },
    7: { x: 80, y: 25 },
    8: { x: 20, y: 25 },
    9: { x: 50, y: 35 },
    10: { x: 50, y: 15 },
  };

  const pos = formations[index] || { x: 50, y: 50 };
  if (team === "away") {
    return { x: pos.x, y: 100 - pos.y };
  }
  return pos;
}

export default MatchDetail;