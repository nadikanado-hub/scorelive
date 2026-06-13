import SEOHead from "@/components/SEOHead";
import AppLayout from "@/components/AppLayout";
import { standingsData } from "@/data/matches";
import { Trophy } from "lucide-react";

const StandingsPage = () => {
  return (
    <AppLayout activeTab="standings">
      <SEOHead
        title="Football League Standings"
        description="View complete football league standings and tables. Track team positions, points, wins, draws, losses and goal difference for all major leagues."
        path="/standings"
        keywords="football standings, league table, premier league standings, la liga table, champions league standings, football rankings"
      />
      <div className="p-4 pb-32 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), transparent)" }}>
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Standings</h1>
            <p className="text-sm text-muted-foreground">League tables & rankings</p>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/30">
            <h2 className="text-lg font-bold text-foreground">Premier League 2025/26</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border/20">
                  <th className="text-left p-3 w-8">#</th>
                  <th className="text-left p-3">Team</th>
                  <th className="text-center p-3">MP</th>
                  <th className="text-center p-3">W</th>
                  <th className="text-center p-3">D</th>
                  <th className="text-center p-3">L</th>
                  <th className="text-center p-3">GD</th>
                  <th className="text-center p-3 font-bold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standingsData.map((team, idx) => (
                  <tr
                    key={team.team}
                    className="border-b border-border/10 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3 text-muted-foreground font-medium">{idx + 1}</td>
                    <td className="p-3 font-semibold text-foreground">{team.team}</td>
                    <td className="text-center p-3 text-muted-foreground">{team.p}</td>
                    <td className="text-center p-3 text-muted-foreground">-</td>
                    <td className="text-center p-3 text-muted-foreground">-</td>
                    <td className="text-center p-3 text-muted-foreground">-</td>
                    <td className="text-center p-3 text-muted-foreground">{team.gd}</td>
                    <td className="text-center p-3 font-bold text-foreground">{team.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StandingsPage;
