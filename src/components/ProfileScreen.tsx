import { Settings, ChevronRight, Bell, Shield, CreditCard, HelpCircle, LogOut, Edit2, Star, Trophy, Clock, User } from "lucide-react";

const menuItems = [
  { icon: Bell, label: "Notifications", description: "Manage your alerts" },
  { icon: Shield, label: "Privacy", description: "Control your data" },
  { icon: CreditCard, label: "Subscription", description: "Premium plan active", badge: "PRO" },
  { icon: HelpCircle, label: "Help & Support", description: "Get assistance" },
];

const ProfileScreen = () => {
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
      </div>

      {/* Header */}
      <header className="px-5 lg:px-8 flex items-center justify-between animate-fade-up relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-2xl border border-primary/20"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))',
              boxShadow: '0 0 20px hsl(var(--primary) / 0.1)',
            }}
          >
            <User className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight">Profile</h1>
        </div>
        <button
          aria-label="Open profile settings"
          className="p-2.5 rounded-xl border border-border/30 transition-all duration-300 hover:scale-105 active:scale-95 hover:border-primary/30"
          style={{ background: 'hsl(var(--muted) / 0.3)', backdropFilter: 'blur(20px)' }}
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>
      </header>

      <div className="px-5 lg:px-8 lg:grid lg:grid-cols-3 lg:gap-8 mt-6 relative z-10">
        {/* Profile Card */}
        <div
          className="p-6 lg:p-8 text-center animate-fade-up-delay-1 lg:col-span-1 lg:sticky lg:top-8 lg:self-start rounded-3xl border border-border/30 overflow-hidden"
          style={{
            background: 'hsl(var(--card) / 0.6)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* Card glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 rounded-full opacity-20 blur-[60px]"
              style={{ background: 'hsl(var(--primary))' }}
            />
          </div>

          <div className="relative inline-block">
            <div
              className="mx-auto h-20 w-20 lg:h-28 lg:w-28 rounded-full border-2 border-primary/30 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.2))',
              }}
            >
              <span className="text-2xl lg:text-3xl font-black text-foreground">LM</span>
            </div>
            <button
              aria-label="Edit profile picture"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))',
                boxShadow: '0 4px 15px hsl(var(--primary) / 0.4)',
              }}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-black text-foreground relative z-10">Leo Messi</h2>
          <div className="flex items-center justify-center gap-1.5 mt-1 relative z-10">
            <Star className="h-3 w-3 text-primary fill-primary" />
            <span className="text-xs text-primary font-bold">Premium Member</span>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-3 relative z-10">
            {[
              { value: "12", label: "Teams", icon: Trophy },
              { value: "48", label: "Matches", icon: Star },
              { value: "156h", label: "Watched", icon: Clock },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 py-3 rounded-2xl border border-border/20"
                style={{ background: 'hsl(var(--muted) / 0.2)' }}
              >
                <span className="text-lg font-black text-foreground">{stat.value}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="lg:col-span-2 mt-6 lg:mt-0">
          <div className="space-y-2 animate-fade-up-delay-2">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="w-full rounded-2xl p-4 flex items-center justify-between transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] animate-fade-up border border-border/30 hover:border-primary/30"
                  style={{
                    animationDelay: `${(i + 3) * 80}ms`,
                    background: 'hsl(var(--card) / 0.5)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="h-10 w-10 rounded-xl border border-border/20 flex items-center justify-center"
                      style={{ background: 'hsl(var(--muted) / 0.3)' }}
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground text-sm">{item.label}</p>
                        {item.badge && (
                          <span
                            className="px-1.5 py-0.5 rounded-md border border-primary/20 text-primary text-[9px] font-bold"
                            style={{ background: 'hsl(var(--primary) / 0.1)' }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                </button>
              );
            })}
          </div>

          <button
            className="mt-6 w-full flex items-center justify-center gap-2 py-4 text-destructive font-semibold rounded-2xl transition-all duration-300 animate-fade-up-delay-3 border border-destructive/20 hover:border-destructive/40"
            style={{
              background: 'hsl(var(--destructive) / 0.05)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;