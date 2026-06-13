import { ArrowRight, Zap, Trophy, Tv } from "lucide-react";

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

const features = [
  { icon: Zap, label: "Real-Time Scores" },
  { icon: Trophy, label: "Live Standings" },
  { icon: Tv, label: "Watch Streams" },
];

const OnboardingScreen = ({ onGetStarted }: OnboardingScreenProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[10%] right-[-5%] w-80 h-80 rounded-full opacity-25 blur-[100px]"
          style={{ background: 'hsl(var(--primary) / 0.5)' }}
        />
        <div
          className="absolute bottom-[30%] left-[-10%] w-72 h-72 rounded-full opacity-15 blur-[100px]"
          style={{ background: 'hsl(var(--accent) / 0.4)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10 blur-[120px]"
          style={{ background: 'hsl(var(--destructive) / 0.2)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background via-background/90 to-transparent" />
      </div>

      <div className="lg:flex lg:min-h-screen">
        {/* Left - Hero */}
        <div className="relative lg:w-1/2 xl:w-3/5 h-[55vh] lg:h-screen">
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), transparent, hsl(var(--accent) / 0.05))' }}>
            <div className="text-center relative z-10">
              <div
                className="w-36 h-36 rounded-full border-2 border-primary/20 flex items-center justify-center mx-auto animate-float"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.03))',
                  boxShadow: '0 0 60px hsl(var(--primary) / 0.15)',
                }}
              >
                <span className="text-6xl">⚽</span>
              </div>

              {/* Feature pills */}
              <div className="flex gap-2 justify-center mt-6 flex-wrap px-4">
                {features.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-foreground/80 border border-border/30"
                    style={{
                      background: 'hsl(var(--card) / 0.5)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <f.icon className="h-3.5 w-3.5 text-primary" />
                    {f.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute left-4 top-20 lg:left-8 lg:top-32 text-[100px] sm:text-[140px] lg:text-[180px] font-black leading-none text-foreground/[0.02] select-none">
            LIVE
          </div>
        </div>

        {/* Right - Content */}
        <div className="relative flex flex-col justify-end lg:justify-center lg:w-1/2 xl:w-2/5 px-6 pb-12 lg:px-12 xl:px-20 lg:pb-0 -mt-20 lg:mt-0">
          <div className="absolute inset-0 lg:hidden bg-gradient-to-t from-background via-background/95 to-transparent" />

          <div className="relative z-10">
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black leading-tight animate-fade-up">
              Real-Time
              <br />
              Football{" "}
              <span className="text-gradient">Scores</span>
              <br />
              <span className="text-muted-foreground text-2xl lg:text-3xl font-bold">Anytime, Anywhere ⚽🏆</span>
            </h1>

            <p className="animate-fade-up-delay-1 mt-4 text-sm lg:text-base text-muted-foreground max-w-md leading-relaxed">
              Follow every match with real-time scores, quick updates, and live stats — your ultimate football companion.
            </p>

            <button
              onClick={onGetStarted}
              className="glow-button animate-fade-up-delay-2 mt-8 flex w-full lg:w-auto items-center justify-center gap-2 py-4 lg:px-12 text-base font-bold rounded-2xl"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;