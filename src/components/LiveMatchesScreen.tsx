import { Search, SlidersHorizontal, RefreshCw, Zap, Trophy, TrendingUp, Flame, Calendar, Clock, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import LiveMatchCard from "./LiveMatchCard";
import AdsterraBanner from "./AdsterraBanner";
import { Match } from "@/data/matches";
import { fetchSportSRCLive, fetchSportSRCMatchesByDate } from "@/services/sportsrcApi";

const dateTabs = [
  { id: "Yesterday", label: "Yesterday", icon: Calendar },
  { id: "Today", label: "Today", icon: Flame },
  { id: "Tomorrow", label: "Tomorrow", icon: Clock },
];

function getDateString(tab: string): string {
  const d = new Date();
  if (tab === "Yesterday") d.setDate(d.getDate() - 1);
  if (tab === "Tomorrow") d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

interface LiveMatchesScreenProps {
  onMatchClick?: (match: Match) => void;
}

const LiveMatchesScreen = ({ onMatchClick }: LiveMatchesScreenProps) => {
  const [activeTab, setActiveTab] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [usingApi, setUsingApi] = useState(false);

  const loadMatches = useCallback(async (tab: string) => {
    setLoading(true);
    try {
      let data: Match[] = [];
      if (tab === "Today") {
        const [live, todays] = await Promise.all([
          fetchSportSRCLive(),
          fetchSportSRCMatchesByDate(getDateString("Today"), "notstarted"),
        ]);
        const ids = new Set(live.map((m) => m.id));
        data = [...live, ...todays.filter((m) => !ids.has(m.id))];
      } else {
        data = await fetchSportSRCMatchesByDate(getDateString(tab));
      }
      setMatches(data);
      setUsingApi(data.length > 0);
    } catch {
      setMatches([]);
      setUsingApi(false);
    }
    setLoading(false);
  }, []);


  useEffect(() => {
    loadMatches(activeTab);
  }, [activeTab, loadMatches]);

  useEffect(() => {
    if (activeTab !== "Today") return;
    const interval = setInterval(() => loadMatches("Today"), 60000);
    return () => clearInterval(interval);
  }, [activeTab, loadMatches]);

  const isWorldCup = (m: Match) => /world cup|fifa|coupe du monde|mondial/i.test(m.league);
  const filteredMatches = matches
    .filter(
      (m) =>
        m.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.league.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => Number(isWorldCup(b)) - Number(isWorldCup(a)));

  const liveCount = filteredMatches.filter((m) => m.status === "live").length;

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

      {/* Search Bar */}
      <div className="px-5 lg:px-8 mt-4 animate-fade-up relative z-10">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border/40 transition-all duration-300 focus-within:border-primary/40"
          style={{
            background: 'hsl(var(--muted) / 0.3)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search teams, leagues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </div>

      {/* Date Tabs */}
      <div className="px-5 lg:px-8 mt-5 animate-fade-up-delay-1 relative z-10">
        <div className="flex gap-2 p-1 rounded-2xl glass-card-solid">
          {dateTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-400 ${
                  isActive
                    ? "text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={isActive ? {
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))',
                  boxShadow: '0 4px 20px hsl(var(--primary) / 0.3)',
                } : {}}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.id === "Today" && liveCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-60" />
                    <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-destructive text-[8px] font-black text-destructive-foreground">
                      {liveCount}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* API Status */}
      {usingApi && (
        <div className="px-5 lg:px-8 mt-3 flex items-center gap-2 animate-fade-up relative z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-muted-foreground font-medium tracking-wide">Live data · Real-time API</span>
        </div>
      )}

      {/* Stats Bar */}
      <div className="px-5 lg:px-8 mt-5 animate-fade-up-delay-2 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-black text-foreground flex items-center gap-2">
              {activeTab === "Today" ? (
                <>
                  <Flame className="h-5 w-5 text-orange-500" />
                  Live Now
                </>
              ) : activeTab === "Tomorrow" ? (
                <>
                  <Zap className="h-5 w-5 text-primary" />
                  Upcoming
                </>
              ) : (
                <>
                  <Trophy className="h-5 w-5 text-primary" />
                  Results
                </>
              )}
            </h2>
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold text-primary border border-primary/20"
              style={{ background: 'hsl(var(--primary) / 0.1)' }}
            >
              {filteredMatches.length}
            </span>
          </div>
          <button aria-label="View all live football matches" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Match List */}
      <div className="px-5 lg:px-8 mt-4 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div
              className="p-5 rounded-3xl border border-primary/20"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.03))',
              }}
            >
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Loading matches</p>
              <p className="text-xs text-muted-foreground mt-1">Fetching the latest scores...</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMatches.map((match, i) => (
              <>
                {i === 4 && (
                  <div key="ad-live" className="col-span-1 sm:col-span-2 xl:col-span-3">
                    <AdsterraBanner />
                  </div>
                )}
              <div
                key={match.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <LiveMatchCard
                  match={match}
                  onClick={() => onMatchClick?.(match)}
                />
              </div>
              </>
            ))}
          </div>
        )}

        {!loading && filteredMatches.length === 0 && (
          <div
            className="text-center py-20 rounded-3xl border border-border/30"
            style={{
              background: 'hsl(var(--muted) / 0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div
              className="p-4 rounded-2xl w-fit mx-auto mb-4 border border-border/20"
              style={{ background: 'hsl(var(--muted) / 0.3)' }}
            >
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-bold">No matches found</p>
            <p className="text-xs text-muted-foreground mt-1.5">Try a different search or date</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatchesScreen;