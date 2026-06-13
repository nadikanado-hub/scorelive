import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Trophy, User, Settings, BarChart3, Crown } from "lucide-react";
import BottomNavigation from "./BottomNavigation";

const sidebarItems = [
  { id: "home", label: "Home", path: "/", icon: Home },
  { id: "live", label: "Live Games", path: "/live", icon: Trophy },
  { id: "standings", label: "Standings", path: "/standings", icon: BarChart3 },
  { id: "subscription", label: "Subscription", path: "/subscription", icon: Crown },
  { id: "profile", label: "Profile", path: "/profile", icon: User },
];

interface AppLayoutProps {
  activeTab: string;
  children: ReactNode;
}

const AppLayout = ({ activeTab, children }: AppLayoutProps) => {
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    const item = sidebarItems.find((i) => i.id === tab);
    if (item) navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="flex min-h-screen">
        <aside
          className="hidden lg:flex flex-col w-64 xl:w-72 border-r border-border/50 fixed left-0 top-0 h-full z-40"
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
                  onClick={() => navigate(item.path)}
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
            <button aria-label="Open settings" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
              <Settings className="h-5 w-5" />
              <span className="font-medium text-sm">Settings</span>
            </button>
          </div>
        </aside>
        <main className="flex-1 lg:ml-64 xl:ml-72">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default AppLayout;
