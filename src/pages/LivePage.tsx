import { useState } from "react";
import LiveMatchesScreen from "@/components/LiveMatchesScreen";
import MatchDetail from "@/components/MatchDetail";
import SEOHead from "@/components/SEOHead";
import AppLayout from "@/components/AppLayout";
import { Match } from "@/data/matches";

const LivePage = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  return (
    <AppLayout activeTab="live">
      <SEOHead
        title="Live Football Scores"
        description="Follow live football scores in real-time. Minute-by-minute updates, goal alerts, and match stats for Premier League, Champions League, La Liga and more."
        path="/live"
        keywords="live football scores, real-time scores, live match updates, goal alerts, premier league live, champions league live"
      />
      {selectedMatch ? (
        <div className="max-w-5xl mx-auto">
          <MatchDetail match={selectedMatch} onBack={() => setSelectedMatch(null)} />
        </div>
      ) : (
        <LiveMatchesScreen onMatchClick={setSelectedMatch} />
      )}
    </AppLayout>
  );
};

export default LivePage;
