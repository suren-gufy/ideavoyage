import { useState } from "react"
import { SearchInterface } from "@/components/search-interface"
import { ScoringCards } from "@/components/scoring-cards"
import { MetricsOverview } from "@/components/metrics-overview"
import { SentimentChart } from "@/components/sentiment-chart"
import { PainPointsDisplay } from "@/components/pain-points-display"
import { AppIdeasGenerator } from "@/components/app-ideas-generator"
import type { AnalysisResponse } from "@shared/schema"

export default function Dashboard() {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null)

  const handleAnalysisComplete = (results: AnalysisResponse) => {
    setAnalysisResults(results)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-[hsl(var(--hot-pink))/10] py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))/5] to-[hsl(var(--neon-green))/5]"></div>
        <div className="relative max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight" data-testid="page-title">
              Stop guessing.{" "}
              <span className="bg-gradient-to-r from-primary via-[hsl(var(--hot-pink))] to-[hsl(var(--neon-green))] bg-clip-text text-transparent">
                Validate your startup idea
              </span>{" "}
              with real user evidence.
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              AI mines Reddit + public reviews and search trends to surface real pains, demand signals, competitors, and a go-to-market plan.{" "}
              <strong className="text-[hsl(var(--neon-green))]">Generate a FREE report</strong> now; upgrade for the full numbers & playbook.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              ✅ Uses public data
            </span>
            <span className="flex items-center gap-2">
              🔗 Links to sources
            </span>
            <span className="flex items-center gap-2">
              🏆 Built on Lean/YC principles
            </span>
            <span className="flex items-center gap-2">
              🚫 No spam
            </span>
          </div>
        </div>
      </div>

      <SearchInterface onAnalysisComplete={handleAnalysisComplete} />
      
      {/* Social proof - positioned for optimal credibility building */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center items-center gap-8 opacity-80">
            <div className="text-sm font-medium text-muted-foreground">Trusted by founders at</div>
            <div className="flex items-center gap-6">
              <div className="px-3 py-1 border border-primary/20 rounded text-xs font-medium bg-primary/5">YC Startups</div>
              <div className="px-3 py-1 border border-[hsl(var(--neon-green))/20] rounded text-xs font-medium bg-[hsl(var(--neon-green))/5]">Indie Hackers</div>
              <div className="px-3 py-1 border border-[hsl(var(--hot-pink))/20] rounded text-xs font-medium bg-[hsl(var(--hot-pink))/5]">Product Hunt</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* What you'll get section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-primary/5">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-[hsl(var(--hot-pink))] bg-clip-text text-transparent">
              What you'll get
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real insights from actual user discussions and market data
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Evidence chips */}
            <div className="relative group bg-card border-2 border-primary/20 hover:border-primary/50 rounded-2xl p-6 space-y-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-4 right-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="h-16 w-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold">Evidence chips</h3>
                <p className="text-muted-foreground">
                  e.g., <span className="text-primary font-semibold">23 Reddit threads</span> • <span className="text-[hsl(var(--neon-green))] font-semibold">12 reviews</span> • <span className="text-[hsl(var(--hot-pink))] font-semibold">41 keywords</span>
                </p>
              </div>
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm font-medium text-[hsl(var(--bright-orange))]">
                  Unlock the full numbers & playbook → <span className="font-bold text-lg">$39</span>
                </p>
              </div>
            </div>

            {/* Problem clusters */}
            <div className="relative group bg-card border-2 border-[hsl(var(--hot-pink))/20] hover:border-[hsl(var(--hot-pink))/50] rounded-2xl p-6 space-y-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-4 right-4">
                <div className="w-2 h-2 bg-[hsl(var(--hot-pink))] rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="h-16 w-16 bg-gradient-to-br from-[hsl(var(--hot-pink))] to-[hsl(var(--hot-pink))/70] rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-bold">Problem clusters</h3>
                <p className="text-muted-foreground">
                  Top pains & solution requests (with <span className="text-[hsl(var(--hot-pink))] font-semibold">2 linked quotes</span>)
                </p>
              </div>
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm font-medium text-[hsl(var(--bright-orange))]">
                  Unlock the full numbers & playbook → <span className="font-bold text-lg">$39</span>
                </p>
              </div>
            </div>

            {/* Market signals */}
            <div className="relative group bg-card border-2 border-[hsl(var(--neon-green))/20] hover:border-[hsl(var(--neon-green))/50] rounded-2xl p-6 space-y-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-4 right-4">
                <div className="w-2 h-2 bg-[hsl(var(--neon-green))] rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="h-16 w-16 bg-gradient-to-br from-[hsl(var(--neon-green))] to-[hsl(var(--neon-green))/70] rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-bold">Market signals</h3>
                <p className="text-muted-foreground">
                  <span className="text-[hsl(var(--neon-green))] font-semibold">12-month</span> trend sparkline (<span className="text-primary font-semibold">24 months</span> in paid)
                </p>
              </div>
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm font-medium text-[hsl(var(--bright-orange))]">
                  Unlock the full numbers & playbook → <span className="font-bold text-lg">$39</span>
                </p>
              </div>
            </div>

            {/* Action plan */}
            <div className="relative group bg-card border-2 border-[hsl(var(--bright-orange))/20] hover:border-[hsl(var(--bright-orange))/50] rounded-2xl p-6 space-y-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-4 right-4">
                <div className="w-2 h-2 bg-[hsl(var(--bright-orange))] rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="h-16 w-16 bg-gradient-to-br from-[hsl(var(--bright-orange))] to-[hsl(var(--bright-orange))/70] rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold">Action plan</h3>
                <p className="text-muted-foreground">
                  <span className="text-[hsl(var(--bright-orange))] font-semibold">90-day GTM</span> + risks (full in paid)
                </p>
              </div>
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm font-medium text-[hsl(var(--bright-orange))]">
                  Unlock the full numbers & playbook → <span className="font-bold text-lg">$39</span>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* How it works - VIBRANT REDESIGN */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[hsl(var(--neon-green))/5] via-background to-[hsl(var(--hot-pink))/5]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-[hsl(var(--hot-pink))] bg-clip-text text-transparent">
              How it works
            </h2>
            <p className="text-xl text-muted-foreground">Get validated insights in three simple steps</p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-6 group">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-[hsl(var(--neon-green))] text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold">💡 Enter your idea</h3>
                <p className="text-muted-foreground">
                  Describe your startup concept in 1-3 sentences
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-6 group">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold">🤖 We mine Reddit + reviews + trends</h3>
                <p className="text-muted-foreground">
                  AI analyzes thousands of real user discussions and market signals
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-6 group">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[hsl(var(--neon-green))] to-primary text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold">📊 You get a free report</h3>
                <p className="text-muted-foreground">
                  Upgrade for exact volumes, CPC, CAC/LTV simulator, 24-mo trends, full sources
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Free vs Paid comparison - VIBRANT REDESIGN */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-[hsl(var(--bright-orange))/5] to-background">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground via-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] bg-clip-text text-transparent">
              Free vs Paid
            </h2>
            <p className="text-xl text-muted-foreground">Make the value gap obvious</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Free column - VIBRANT */}
            <div className="relative bg-card border-2 border-muted-foreground/20 rounded-2xl p-8 space-y-6 hover:shadow-2xl transition-all duration-300">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-muted-foreground">Free</h3>
                <p className="text-4xl font-bold">$0</p>
              </div>
              <ul className="space-y-4 text-base">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[hsl(var(--neon-green))] to-[hsl(var(--neon-green))/70] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  2–3 full pain clusters (with 2 linked quotes)
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[hsl(var(--neon-green))] to-[hsl(var(--neon-green))/70] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Trend sparkline (bands, no exact numbers)
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[hsl(var(--neon-green))] to-[hsl(var(--neon-green))/70] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  1 competitor row (features summary)
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[hsl(var(--neon-green))] to-[hsl(var(--neon-green))/70] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Personas light + roadmap headings
                </li>
              </ul>
            </div>

            {/* Paid column - VIBRANT PREMIUM */}
            <div className="relative bg-gradient-to-br from-card to-primary/5 border-4 border-primary rounded-2xl p-8 space-y-6 shadow-2xl hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-all duration-300 transform hover:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                  ⭐ Most Popular
                </div>
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--neon-green))] bg-clip-text text-transparent">Paid</h3>
                <p className="text-5xl font-bold bg-gradient-to-r from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] bg-clip-text text-transparent">$39</p>
              </div>
              <ul className="space-y-4 text-base">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Exact search volumes, CPC, difficulty + 24-mo trend</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">CAC/LTV simulator + payback estimate</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Full competitor matrix (pricing, sentiment, differentiators)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">90-day GTM plan + risks & kill-criteria</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">All sources & exports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - VIBRANT REDESIGN */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[hsl(var(--hot-pink))/5] via-background to-[hsl(var(--neon-green))/5]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground via-[hsl(var(--neon-green))] to-[hsl(var(--hot-pink))] bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">Everything you need to know</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-card border-2 border-primary/20 rounded-xl p-6 space-y-4 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-primary to-[hsl(var(--neon-green))] rounded-full flex items-center justify-center text-white font-bold text-sm">?</span>
                Why not show all numbers for free?
              </h3>
              <p className="text-muted-foreground pl-11">
                We keep costly data pulls for paid; free still shows real quotes & trend signals.
              </p>
            </div>
            
            <div className="bg-card border-2 border-[hsl(var(--hot-pink))/20] rounded-xl p-6 space-y-4 hover:border-[hsl(var(--hot-pink))]/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] rounded-full flex items-center justify-center text-white font-bold text-sm">📊</span>
                What sources?
              </h3>
              <p className="text-muted-foreground pl-11">
                Reddit + public reviews + Trends; links included.
              </p>
            </div>
            
            <div className="bg-card border-2 border-[hsl(var(--neon-green))]/20 rounded-xl p-6 space-y-4 hover:border-[hsl(var(--neon-green))]/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--neon-green))] to-primary rounded-full flex items-center justify-center text-white font-bold text-sm">🔒</span>
                Is my idea private?
              </h3>
              <p className="text-muted-foreground pl-11">
                We don't share your prompt; excerpts are public-source quotes only.
              </p>
            </div>
            
            <div className="bg-card border-2 border-[hsl(var(--bright-orange))]/20 rounded-xl p-6 space-y-4 hover:border-[hsl(var(--bright-orange))]/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--bright-orange))] to-[hsl(var(--hot-pink))] rounded-full flex items-center justify-center text-white font-bold text-sm">💰</span>
                Refunds?
              </h3>
              <p className="text-muted-foreground pl-11">
                If the paid report lacks enough data to decide, we'll make it right.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer trust & compliance */}
      <div className="max-w-4xl mx-auto text-center space-y-4 py-8 border-t">
        <p className="text-sm text-muted-foreground">
          Stripe-secure checkout, wallets supported
        </p>
        <div className="flex justify-center gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
      </div>
      
      {analysisResults && (
        <>
          <div className="space-y-6">
            <h2 className="text-xl font-medium">Startup Idea Scores</h2>
            <ScoringCards 
              overallScore={analysisResults.overall_score} 
              viabilityScore={analysisResults.viability_score} 
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-medium">Analysis Overview</h2>
            <MetricsOverview analysisData={analysisResults} />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-medium">Sentiment Analysis</h2>
            <SentimentChart sentimentData={analysisResults.sentiment_data} />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-medium">Pain Points</h2>
            <PainPointsDisplay painPoints={analysisResults.pain_points} />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-medium">Generated App Ideas</h2>
            <AppIdeasGenerator appIdeas={analysisResults.app_ideas} />
          </div>
        </>
      )}

      {!analysisResults && (
        <div className="text-center py-12">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-muted-foreground">Ready to analyze your startup idea?</h3>
            <p className="text-sm text-muted-foreground">
              Describe your idea above and we'll research Reddit to find insights, pain points, and opportunities.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}