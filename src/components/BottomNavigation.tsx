import { Home, Radio, User, BarChart3, Crown } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "live", icon: Radio, label: "LIVE" },
  { id: "standings", icon: BarChart3, label: "Table" },
  { id: "subscription", icon: Crown, label: "Pro" },
  { id: "profile", icon: User, label: "Profile" },
];

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-2 lg:hidden">
      <div
        className="mx-auto flex max-w-md items-center justify-around rounded-[28px] px-2 py-2"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative transition-all duration-500 ease-out"
            >
              {isActive ? (
                <div
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-500"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.05)",
                  }}
                >
                  <Icon className="h-[18px] w-[18px] text-foreground" strokeWidth={2.5} />
                  <span className="text-xs font-semibold text-foreground tracking-wide">{item.label}</span>
                </div>
              ) : (
                <div className="p-3 rounded-full text-muted-foreground/60 hover:text-muted-foreground transition-all duration-300 hover:scale-105 active:scale-95">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
