import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePremium } from "@/contexts/premium-context";
import { CheckCircle, Sparkles, TrendingUp, Users, Zap } from "lucide-react";

export function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, upgradeToPremium, isDevelopment } = usePremium();

  const handleUpgrade = () => {
    if (!isDevelopment) {
      // In production, would redirect to payment processor
      alert('This would redirect to payment processor in production');
      setShowUpgradeModal(false);
      return;
    }
    
    // For development - bypass payment
    upgradeToPremium();
  };

  return (
    <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-[hsl(var(--hot-pink))]" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] bg-clip-text text-transparent">
                Unlock Premium Features
              </span>
              <Sparkles className="h-6 w-6 text-[hsl(var(--bright-orange))]" />
            </div>
            <p className="text-lg text-muted-foreground">Get the complete startup validation toolkit</p>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price */}
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="text-sm font-medium bg-gradient-to-r from-[hsl(var(--hot-pink))]/10 to-[hsl(var(--bright-orange))]/10 text-[hsl(var(--hot-pink))]">
              ⭐ Most Popular
            </Badge>
            <div className="text-4xl font-bold bg-gradient-to-r from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] bg-clip-text text-transparent">
              $39
            </div>
            <p className="text-muted-foreground">One-time payment • Lifetime access</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[hsl(var(--neon-green))]" />
                <span className="text-sm">Exact search volumes & CPC data</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-[hsl(var(--neon-green))]" />
                <span className="text-sm">24-month trend analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-[hsl(var(--neon-green))]" />
                <span className="text-sm">CAC/LTV simulator</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-[hsl(var(--neon-green))]" />
                <span className="text-sm">Full competitor matrix</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[hsl(var(--neon-green))]" />
                <span className="text-sm">90-day GTM plan</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[hsl(var(--neon-green))]" />
                <span className="text-sm">All sources & exports</span>
              </div>
            </div>
          </div>

          {/* Development Notice - only show in development */}
          {isDevelopment && (
            <div className="bg-[hsl(var(--neon-green))]/10 border border-[hsl(var(--neon-green))]/20 rounded-lg p-4">
              <p className="text-sm text-[hsl(var(--neon-green))] font-medium text-center">
                🚀 Development Mode: Click below for instant premium access!
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => setShowUpgradeModal(false)}
              data-testid="button-cancel-upgrade"
            >
              Continue with Free
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] hover:from-[hsl(var(--hot-pink))]/90 hover:to-[hsl(var(--bright-orange))]/90 text-white font-medium" 
              onClick={handleUpgrade}
              data-testid="button-upgrade-premium"
              disabled={false}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isDevelopment ? 'Upgrade to Premium' : 'Proceed to Payment'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}