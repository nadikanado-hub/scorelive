import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeScreen from "@/components/HomeScreen";
import MatchDetail from "@/components/MatchDetail";
import SEOHead from "@/components/SEOHead";
import AppLayout from "@/components/AppLayout";
import { Match } from "@/data/matches";

const HomePage = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const navigate = useNavigate();

  return (
    <AppLayout activeTab="home">
      <SEOHead
        title="ScoreLive - Live Football Scores, Results & Fixtures 2026"
        description="Track live football scores, real-time match results, fixtures & standings. Watch live streams, get instant goal alerts and full match stats for every league."
        path="/"
        keywords="live football scores, football results today, live match scores, football fixtures, premier league scores, champions league live"
      />
      {selectedMatch ? (
        <div className="max-w-5xl mx-auto">
          <MatchDetail match={selectedMatch} onBack={() => setSelectedMatch(null)} />
        </div>
      ) : (
        <HomeScreen onMatchClick={setSelectedMatch} onViewAllLive={() => navigate("/live")} />
      )}
    </AppLayout>
  );
};

export default HomePage;
