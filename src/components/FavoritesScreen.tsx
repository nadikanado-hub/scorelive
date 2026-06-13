import { Search, Check, Heart, Sparkles, X, Filter } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { teams } from "@/data/matches";
import TeamLogo from "./TeamLogo";
import { toast } from "sonner";

const STORAGE_KEY = "scorelive_favorites";

const leagues = ["All", "Premier League", "La Liga", "Serie A", "Ligue 1", "Bundesliga", "MLS"];

const teamLeagueMap: Record<string, string> = {
  psg: "Ligue 1",
  alnassr: "Other",
  arsenal: "Premier League",
  barcelona: "La Liga",
  realmadrid: "La Liga",
  intermiami: "MLS",
  chelsea: "Premier League",
  liverpool: "Premier League",
  bayern: "Bundesliga",
  mancity: "Premier League",
  juventus: "Serie A",
  milan: "Serie A",
};

const FavoritesScreen = () => {
  const [selectedTeams, setSelectedTeams] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLeague, setActiveLeague] = useState("All");
  const [justToggled, setJustToggled] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedTeams));
  }, [selectedTeams]);

  const toggleTeam = useCallback((id: string) => {
    setSelectedTeams((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
    setJustToggled(id);
    setTimeout(() => setJustToggled(null), 400);
  }, []);

  const clearAll = useCallback(() => {
    setSelectedTeams([]);
    toast("All favorites cleared");
  }, []);

  const filteredTeams = teams.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLeague = activeLeague === "All" || teamLeagueMap[t.id] === activeLeague;
    return matchesSearch && matchesLeague;
  });

  const selectedTeamObjects = teams.filter((t) => selectedTeams.includes(t.id));

  return (
    <div className="min-h-screen bg-background pb-28 pt-4 lg:pb-8 lg:pt-6 relative overflow-x-hidden">
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
          className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full opacity-10 blur-[80px]"
          style={{ background: 'hsl(var(--destructive) / 0.2)' }}
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
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight">Favorites</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">Follow your teams</p>
            </div>
          </div>
          {selectedTeams.length > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20"
              style={{ background: 'hsl(var(--primary) / 0.1)' }}
            >
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-xs font-bold text-primary">{selectedTeams.length}</span>
            </div>
          )}
        </div>
      </header>

      {/* Selected Teams Strip */}
      {selectedTeams.length > 0 && (
        <div className="px-5 lg:px-8 mt-5 animate-fade-up relative z-10">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your picks</span>
            <button
              onClick={clearAll}
              className="text-[10px] text-destructive font-semibold hover:underline"
            >
              Clear all
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {selectedTeamObjects.map((team) => (
              <div
                key={team.id}
                className="flex-shrink-0 flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-full border border-primary/25 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.03))',
                }}
              >
                <TeamLogo teamName={team.name} logo={team.logo} shortName={team.short} fallbackColor={team.color} size="sm" />
                <span className="text-[11px] font-semibold text-foreground whitespace-nowrap">{team.name}</span>
                <button
                  onClick={() => toggleTeam(team.id)}
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-colors hover:bg-destructive/20"
                  style={{ background: 'hsl(var(--muted) / 0.3)' }}
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-5 lg:px-8 mt-5 animate-fade-up relative z-10">
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
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* League Filter */}
      <div className="px-5 lg:px-8 mt-4 animate-fade-up relative z-10">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {leagues.map((league) => (
            <button
              key={league}
              onClick={() => setActiveLeague(league)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 border whitespace-nowrap ${
                activeLeague === league
                  ? "text-primary-foreground border-transparent"
                  : "text-muted-foreground border-border/30 hover:text-foreground hover:border-border/50"
              }`}
              style={activeLeague === league ? {
                background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))',
                boxShadow: '0 2px 12px hsl(var(--primary) / 0.3)',
              } : {
                background: 'hsl(var(--card) / 0.4)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {league}
            </button>
          ))}
        </div>
      </div>

      {/* Teams Grid */}
      <div className="px-4 lg:px-8 mt-5 relative z-10">
        {filteredTeams.length === 0 ? (
          <div
            className="text-center py-16 rounded-3xl border border-border/30 animate-fade-up"
            style={{ background: 'hsl(var(--muted) / 0.2)', backdropFilter: 'blur(20px)' }}
          >
            <Filter className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-bold">No teams found</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
            {filteredTeams.map((team, i) => {
              const isSelected = selectedTeams.includes(team.id);
              const wasJustToggled = justToggled === team.id;
              return (
                <button
                  key={team.id}
                  onClick={() => toggleTeam(team.id)}
                  className={`relative p-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 animate-fade-up border ${
                    isSelected
                      ? "border-primary/40"
                      : "border-border/20 hover:border-border/40"
                  } ${wasJustToggled ? "scale-95" : "hover:scale-[1.04] active:scale-[0.96]"}`}
                  style={{
                    animationDelay: `${i * 40}ms`,
                    background: isSelected
                      ? 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.03))'
                      : 'hsl(var(--card) / 0.4)',
                    backdropFilter: 'blur(16px)',
                    ...(isSelected ? { boxShadow: '0 4px 20px hsl(var(--primary) / 0.12)' } : {}),
                  }}
                >
                  {/* Check badge */}
                  {isSelected && (
                    <div
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))',
                        boxShadow: '0 2px 8px hsl(var(--primary) / 0.4)',
                      }}
                    >
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}

                  <TeamLogo teamName={team.name} logo={team.logo} shortName={team.short} fallbackColor={team.color} size="md" />
                  <span className="text-[11px] font-semibold text-foreground leading-tight text-center truncate w-full">{team.name}</span>
                  <span className="text-[9px] text-muted-foreground font-medium">{teamLeagueMap[team.id]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesScreen;