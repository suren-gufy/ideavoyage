import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, ArrowRight } from "lucide-react";
import { usePremium } from "@/contexts/premium-context";

interface UpgradeCTAProps {
  variant?: "button" | "card" | "inline";
  text?: string;
  size?: "sm" | "md" | "lg";
  feature?: string;
}

export function UpgradeCTA({ 
  variant = "button", 
  text = "Upgrade to Premium", 
  size = "md",
  feature 
}: UpgradeCTAProps) {
  const { isPremium, isDevelopment, setShowUpgradeModal } = usePremium();

  // In development, show CTA even for premium users (for testing)
  // In production, only show for non-premium users
  if (isPremium && !isDevelopment) return null;

  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  if (variant === "card") {
    return (
      <div className="bg-gradient-to-r from-[hsl(var(--hot-pink))]/5 to-[hsl(var(--bright-orange))]/5 border border-[hsl(var(--hot-pink))]/20 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-[hsl(var(--hot-pink))]" />
          <Badge variant="secondary" className="bg-[hsl(var(--hot-pink))]/10 text-[hsl(var(--hot-pink))]">
            Premium Feature
          </Badge>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {feature ? `Unlock ${feature}` : "Get the complete analysis"}
          </p>
          <p className="text-xs text-muted-foreground">
            Exact numbers, full data, and actionable insights
          </p>
        </div>
        <Button 
          size="sm" 
          className="w-full bg-gradient-to-r from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] hover:from-[hsl(var(--hot-pink))]/90 hover:to-[hsl(var(--bright-orange))]/90 text-white"
          onClick={handleUpgrade}
          data-testid="button-upgrade-card"
        >
          <Sparkles className="h-3 w-3 mr-2" />
          Upgrade for $39
        </Button>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <Button 
        variant="ghost" 
        size="sm"
        className="h-auto p-1 text-[hsl(var(--hot-pink))] hover:text-[hsl(var(--bright-orange))] hover:bg-[hsl(var(--hot-pink))]/5"
        onClick={handleUpgrade}
        data-testid="button-upgrade-inline"
      >
        <Crown className="h-3 w-3 mr-1" />
        <span className="text-xs">Upgrade</span>
        <ArrowRight className="h-3 w-3 ml-1" />
      </Button>
    );
  }

  const buttonSizes = {
    sm: "sm",
    md: "default",
    lg: "lg"
  } as const;

  return (
    <Button 
      size={buttonSizes[size]}
      className="bg-gradient-to-r from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] hover:from-[hsl(var(--hot-pink))]/90 hover:to-[hsl(var(--bright-orange))]/90 text-white font-medium"
      onClick={handleUpgrade}
      data-testid="button-upgrade-primary"
    >
      <Crown className="h-4 w-4 mr-2" />
      {text}
    </Button>
  );
}