import { Brain, Database, TrendingUp, Users, BarChart3 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface MethodologyModalProps {
  trigger?: React.ReactNode
}

export function MethodologyModal({ trigger }: MethodologyModalProps) {
  const defaultTrigger = (
    <button 
      className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium text-sm transition-colors duration-200"
      data-testid="link-methodology"
    >
      Learn about our methodology →
    </button>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" data-testid="modal-methodology">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-[hsl(var(--hot-pink))] to-[hsl(var(--neon-green))] bg-clip-text text-transparent">
            Our AI-Powered Analysis Methodology
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 pt-4">
          {/* Overview */}
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our startup validation tool combines advanced AI with comprehensive data mining to provide evidence-based insights. 
              Here's exactly how we analyze your startup idea:
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid gap-6">
            {/* Step 1: Data Collection */}
            <div className="flex gap-4 p-6 border border-border/50 rounded-lg bg-gradient-to-r from-primary/5 to-[hsl(var(--neon-green))/5]">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-[hsl(var(--neon-green))] rounded-xl flex items-center justify-center">
                  <Database className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">1. Multi-Source Data Mining</h3>
                <p className="text-muted-foreground">
                  We systematically collect data from Reddit discussions, online reviews, search trends, and public forums 
                  related to your startup domain. Our AI identifies relevant conversations, pain points, and market signals 
                  across thousands of data points.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Reddit Posts & Comments</span>
                  <span className="px-2 py-1 bg-[hsl(var(--neon-green))/10] text-[hsl(var(--neon-green))] text-xs rounded">Product Reviews</span>
                  <span className="px-2 py-1 bg-[hsl(var(--hot-pink))/10] text-[hsl(var(--hot-pink))] text-xs rounded">Search Trends</span>
                </div>
              </div>
            </div>

            {/* Step 2: AI Analysis */}
            <div className="flex gap-4 p-6 border border-border/50 rounded-lg bg-gradient-to-r from-[hsl(var(--hot-pink))/5] to-[hsl(var(--bright-orange))/5]">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">2. Advanced AI Processing</h3>
                <p className="text-muted-foreground">
                  Using OpenAI's latest models, we perform sentiment analysis, extract key themes, identify pain points, 
                  and analyze market demand patterns. Our AI understands context, emotion, and user intent to provide 
                  meaningful insights rather than just keyword matching.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 bg-[hsl(var(--hot-pink))/10] text-[hsl(var(--hot-pink))] text-xs rounded">Sentiment Analysis</span>
                  <span className="px-2 py-1 bg-[hsl(var(--bright-orange))/10] text-[hsl(var(--bright-orange))] text-xs rounded">Theme Extraction</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Context Understanding</span>
                </div>
              </div>
            </div>

            {/* Step 3: Market Intelligence */}
            <div className="flex gap-4 p-6 border border-border/50 rounded-lg bg-gradient-to-r from-[hsl(var(--neon-green))/5] to-primary/5">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--neon-green))] to-primary rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">3. Market Signal Analysis</h3>
                <p className="text-muted-foreground">
                  We analyze 12-month trends to identify growing demand, seasonal patterns, and competitive landscape. 
                  Our system correlates discussion volume, sentiment changes, and user engagement to predict market timing 
                  and opportunity size.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 bg-[hsl(var(--neon-green))/10] text-[hsl(var(--neon-green))] text-xs rounded">Demand Trends</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Competitive Analysis</span>
                  <span className="px-2 py-1 bg-[hsl(var(--bright-orange))/10] text-[hsl(var(--bright-orange))] text-xs rounded">Market Timing</span>
                </div>
              </div>
            </div>

            {/* Step 4: Insight Generation */}
            <div className="flex gap-4 p-6 border border-border/50 rounded-lg bg-gradient-to-r from-[hsl(var(--bright-orange))/5] to-[hsl(var(--hot-pink))/5]">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--bright-orange))] to-[hsl(var(--hot-pink))] rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">4. Actionable Insights & Recommendations</h3>
                <p className="text-muted-foreground">
                  Finally, we synthesize all findings into concrete recommendations including pain point clusters, 
                  market entry strategies, feature priorities, and go-to-market plans. Each insight is backed by 
                  specific evidence and linked to source discussions.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 bg-[hsl(var(--bright-orange))/10] text-[hsl(var(--bright-orange))] text-xs rounded">GTM Strategy</span>
                  <span className="px-2 py-1 bg-[hsl(var(--hot-pink))/10] text-[hsl(var(--hot-pink))] text-xs rounded">Feature Prioritization</span>
                  <span className="px-2 py-1 bg-[hsl(var(--neon-green))/10] text-[hsl(var(--neon-green))] text-xs rounded">Evidence Links</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Assurance */}
          <div className="border-t border-border/50 pt-6">
            <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
              <Users className="h-8 w-8 text-primary flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold">Quality & Reliability</h4>
                <p className="text-sm text-muted-foreground">
                  All analysis is based on real user discussions and validated market data. We focus on authentic signals 
                  rather than vanity metrics, ensuring actionable insights for startup founders making critical decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}