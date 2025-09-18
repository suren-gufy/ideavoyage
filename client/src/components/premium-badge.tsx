import { Badge } from "@/components/ui/badge";
import { Crown, Lock, Sparkles } from "lucide-react";
import { usePremium } from "@/contexts/premium-context";

interface PremiumBadgeProps {
  variant?: "lock" | "crown" | "sparkles";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function PremiumBadge({ variant = "crown", size = "sm", showText = true }: PremiumBadgeProps) {
  const { isPremium, isDevelopment } = usePremium();

  // In development, always show premium indicators but with different styling
  // In production, only show for non-premium users
  if (isPremium && !isDevelopment) return null;

  const icons = {
    lock: Lock,
    crown: Crown,
    sparkles: Sparkles
  };

  const Icon = icons[variant];

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2"
  };

  // Different styling for unlocked premium features in development
  const isUnlocked = isPremium && isDevelopment;
  
  return (
    <Badge 
      variant="secondary" 
      className={`
        ${sizeClasses[size]} 
        ${isUnlocked 
          ? "bg-gradient-to-r from-[hsl(var(--neon-green))]/10 to-[hsl(var(--neon-green))]/5 text-[hsl(var(--neon-green))] border-[hsl(var(--neon-green))]/20"
          : "bg-gradient-to-r from-[hsl(var(--hot-pink))]/10 to-[hsl(var(--bright-orange))]/10 text-[hsl(var(--hot-pink))] border-[hsl(var(--hot-pink))]/20"
        }
        hover:from-[hsl(var(--hot-pink))]/20 hover:to-[hsl(var(--bright-orange))]/20
        transition-all duration-200
      `}
      data-testid="premium-badge"
    >
      <Icon className="h-3 w-3 mr-1" />
      {showText && (isUnlocked ? "Unlocked" : "Premium")}
    </Badge>
  );
}