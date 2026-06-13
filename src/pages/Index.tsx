import { useState } from "react";
import { Home, Trophy, User, Settings } from "lucide-react";
import OnboardingScreen from "@/components/OnboardingScreen";
import HomeScreen from "@/components/HomeScreen";
import LiveMatchesScreen from "@/components/LiveMatchesScreen";

import ProfileScreen from "@/components/ProfileScreen";

import MatchDetail from "@/components/MatchDetail";
import BottomNavigation from "@/components/BottomNavigation";
import { Match } from "@/data/matches";

const sidebarItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "live", label: "Live Games", icon: Trophy },
  { id: "profile", label: "Profile", icon: User },
];

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState("live");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  if (showOnboarding) {
    return <OnboardingScreen onGetStarted={() => setShowOnboarding(false)} />;
  }

  const renderSidebar = (onMatchBack?: () => void) => (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-r border-border/50 fixed left-0 top-0 h-full z-40"
      style={{
        background: "linear-gradient(180deg, hsl(120 10% 8% / 0.85) 0%, hsl(120 8% 5% / 0.9) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div className="p-6 border-b border-border/50">
        <h1 className="text-xl font-black text-gradient">⚽ SCORELIVE</h1>
        <p className="text-xs text-muted-foreground mt-1">Live Football Scores</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (onMatchBack) setSelectedMatch(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              style={isActive ? { boxShadow: "0 4px 15px hsl(72 100% 62% / 0.3)" } : undefined}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border/50">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
          <Settings className="h-5 w-5" />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );

  if (selectedMatch) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="flex min-h-screen">
          {renderSidebar(() => setSelectedMatch(null))}
          <main className="flex-1 lg:ml-64 xl:ml-72">
            <div className="max-w-5xl mx-auto">
              <MatchDetail match={selectedMatch} onBack={() => setSelectedMatch(null)} />
            </div>
          </main>
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setSelectedMatch(null); }} />
      </div>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onMatchClick={setSelectedMatch} onViewAllLive={() => setActiveTab("live")} />;
      case "live":
        return <LiveMatchesScreen onMatchClick={setSelectedMatch} />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen onMatchClick={setSelectedMatch} onViewAllLive={() => setActiveTab("live")} />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="flex min-h-screen">
        {renderSidebar()}
        <main className="flex-1 lg:ml-64 xl:ml-72">
          <div className="max-w-7xl mx-auto">
            {renderScreen()}
          </div>
        </main>
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
