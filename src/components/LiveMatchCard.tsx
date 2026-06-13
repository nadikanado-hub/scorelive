import { Match } from "@/data/matches";
import TeamLogo from "./TeamLogo";
import { Timer, Trophy } from "lucide-react";

interface LiveMatchCardProps {
  match: Match;
  onClick?: () => void;
}

const LiveMatchCard = ({ match, onClick }: LiveMatchCardProps) => {
  const isLive = match.status === "live";
  const isUpcoming = match.status === "upcoming";

  return (
    <div
      className="relative rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-border/30 overflow-hidden group"
      onClick={onClick}
      style={{
        background: 'hsl(var(--card) / 0.6)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* Live glow effect */}
      {isLive && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-24 rounded-full blur-[50px] opacity-30"
            style={{ background: 'hsl(var(--destructive))' }}
          />
        </div>
      )}

      {/* Top row: league + status */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.15em] flex items-center gap-1.5">
          <Trophy className="h-3 w-3" />
          {match.league}
        </span>
        {isLive ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/15 border border-destructive/25">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
            </span>
            <span className="text-[10px] font-black text-destructive uppercase tracking-wider">
              {match.matchTime}
            </span>
          </span>
        ) : isUpcoming ? (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-muted-foreground border border-border/30"
            style={{ background: 'hsl(var(--muted) / 0.3)' }}
          >
            <Timer className="h-3 w-3" />
            {match.matchTime}
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-muted-foreground border border-border/30"
            style={{ background: 'hsl(var(--muted) / 0.3)' }}
          >
            FT
          </span>
        )}
      </div>

      {/* Teams and Score */}
      <div className="flex items-center gap-3 relative z-10">
        {/* Home Team */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <TeamLogo
            teamName={match.homeTeam}
            logo={match.homeLogo}
            shortName={match.homeShort}
            fallbackColor={match.homeColor}
          />
          <span className="text-sm font-bold text-foreground truncate">
            {match.homeTeam}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{
            background: isLive
              ? 'hsl(var(--destructive) / 0.08)'
              : 'hsl(var(--muted) / 0.3)',
          }}
        >
          <span className={`text-xl font-black ${isLive ? "text-foreground" : "text-foreground"}`}>
            {match.homeScore}
          </span>
          <span className="text-sm text-muted-foreground/50 font-bold">-</span>
          <span className={`text-xl font-black ${isLive ? "text-foreground" : "text-foreground"}`}>
            {match.awayScore}
          </span>
        </div>
      </div>

      {/* Away Team - second row */}
      <div className="flex items-center gap-2.5 mt-3 relative z-10">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <TeamLogo
            teamName={match.awayTeam}
            logo={match.awayLogo}
            shortName={match.awayShort}
            fallbackColor={match.awayColor}
          />
          <span className="text-sm font-bold text-foreground truncate">
            {match.awayTeam}
          </span>
        </div>
      </div>

      {/* Bottom accent line for live */}
      {isLive && (
        <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-destructive/40 to-transparent" />
      )}
    </div>
  );
};

export default LiveMatchCard;