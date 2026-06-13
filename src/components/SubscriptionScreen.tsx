import { Check, Crown, Zap, Shield, Star, ChevronRight } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Basic access to scores",
    features: ["Live scores", "Basic match stats", "3 favorite teams"],
    current: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$4.99",
    period: "/month",
    description: "Everything you need",
    features: [
      "All live scores & stats",
      "Unlimited favorites",
      "Ad-free experience",
      "Push notifications",
      "Match highlights",
    ],
    current: true,
    popular: true,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: "$9.99",
    period: "/month",
    description: "For the true fan",
    features: [
      "Everything in Pro",
      "Exclusive analysis",
      "Early access features",
      "Priority support",
      "Custom alerts",
      "Multi-device sync",
    ],
    current: false,
  },
];

const SubscriptionScreen = () => {
  return (
    <div className="min-h-screen bg-background pb-28 pt-4 lg:pb-8 lg:pt-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-20 blur-[100px]"
          style={{ background: "hsl(var(--primary) / 0.4)" }}
        />
        <div
          className="absolute bottom-20 -left-32 w-72 h-72 rounded-full opacity-15 blur-[100px]"
          style={{ background: "hsl(var(--accent) / 0.4)" }}
        />
      </div>

      {/* Header */}
      <header className="px-5 lg:px-8 flex items-center gap-3 animate-fade-up relative z-10">
        <div
          className="p-2.5 rounded-2xl border border-primary/20"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))",
            boxShadow: "0 0 20px hsl(var(--primary) / 0.1)",
          }}
        >
          <Crown className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight">Subscription</h1>
          <p className="text-xs text-muted-foreground">Choose your plan</p>
        </div>
      </header>

      <div className="px-5 lg:px-8 mt-6 relative z-10 space-y-4">
        {/* Current Plan Banner */}
        <div
          className="p-4 rounded-2xl border border-primary/30 animate-fade-up-delay-1"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.03))",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))",
                  boxShadow: "0 4px 15px hsl(var(--primary) / 0.3)",
                }}
              >
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Pro Plan Active</p>
                <p className="text-[11px] text-muted-foreground">Renews on May 14, 2026</p>
              </div>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold text-primary border border-primary/20"
              style={{ background: "hsl(var(--primary) / 0.1)" }}
            >
              ACTIVE
            </span>
          </div>
        </div>

        {/* Plans */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-4 space-y-3 lg:space-y-0">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-5 transition-all duration-300 animate-fade-up ${
                plan.popular
                  ? "border-primary/40"
                  : "border-border/30 hover:border-border/50"
              }`}
              style={{
                animationDelay: `${(i + 2) * 80}ms`,
                background: plan.popular
                  ? "linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--card) / 0.8))"
                  : "hsl(var(--card) / 0.5)",
                backdropFilter: "blur(20px)",
                boxShadow: plan.popular ? "0 4px 20px hsl(var(--primary) / 0.1)" : undefined,
              }}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-bold text-primary-foreground"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))",
                      boxShadow: "0 2px 10px hsl(var(--primary) / 0.4)",
                    }}
                  >
                    POPULAR
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-foreground">{plan.price}</span>
                <span className="text-xs text-muted-foreground">{plan.period}</span>
              </div>
              <h3 className="font-bold text-foreground text-sm mt-1">{plan.name}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{plan.description}</p>

              <div className="mt-4 space-y-2.5">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <div
                      className="h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: plan.popular
                          ? "hsl(var(--primary) / 0.2)"
                          : "hsl(var(--muted) / 0.4)",
                      }}
                    >
                      <Check
                        className={`h-2.5 w-2.5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`}
                        strokeWidth={3}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full mt-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  plan.current
                    ? "text-primary border border-primary/30 hover:border-primary/50"
                    : "text-foreground border border-border/30 hover:border-border/50"
                }`}
                style={{
                  background: plan.current
                    ? "hsl(var(--primary) / 0.1)"
                    : "hsl(var(--muted) / 0.2)",
                }}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>

        {/* Manage Section */}
        <div className="space-y-2 animate-fade-up-delay-3">
          {[
            { icon: Shield, label: "Payment Method", desc: "Visa •••• 4242" },
            { icon: Star, label: "Billing History", desc: "View past invoices" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="w-full rounded-2xl p-4 flex items-center justify-between transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border border-border/30 hover:border-primary/30"
                style={{
                  background: "hsl(var(--card) / 0.5)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-xl border border-border/20 flex items-center justify-center"
                    style={{ background: "hsl(var(--muted) / 0.3)" }}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionScreen;
