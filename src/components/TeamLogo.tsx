import { getTeamLogo } from "@/data/matches";

interface TeamLogoProps {
  teamName: string;
  logo?: string;
  shortName?: string;
  fallbackColor?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-7 w-7",
  md: "h-12 w-12 sm:h-14 sm:w-14",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
};

const TeamLogo = ({ teamName, logo, shortName, fallbackColor, size = "md", className = "" }: TeamLogoProps) => {
  const resolvedLogo = logo || getTeamLogo(teamName);

  if (resolvedLogo) {
    return (
      <img
        src={resolvedLogo}
        alt={teamName}
        className={`${sizeClasses[size]} team-logo ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${fallbackColor || "from-muted to-secondary"} flex items-center justify-center text-xs font-bold border border-border/30 ${className}`}
    >
      {shortName || teamName.substring(0, 3).toUpperCase()}
    </div>
  );
};

export default TeamLogo;
