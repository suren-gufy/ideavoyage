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
    <div className="space-y-8 p-6">
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight" data-testid="page-title">
            Stop guessing. Validate your startup idea with real user evidence.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            AI mines Reddit + public reviews and search trends to surface real pains, demand signals, competitors, and a go-to-market plan. Generate a <strong>FREE report</strong> now; upgrade for the full numbers & playbook.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg font-semibold text-lg"
            data-testid="cta-primary"
          >
            Generate my free report
          </button>
          <button 
            className="border border-border hover:bg-muted px-8 py-3 rounded-lg font-medium"
            data-testid="cta-secondary"
          >
            See a sample report
          </button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Uses public data • Links to sources • Built on Lean/YC principles • No spam
        </p>
      </div>

      <SearchInterface onAnalysisComplete={handleAnalysisComplete} />
      
      {/* What you'll get section */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">What you'll get</h2>
          <p className="text-muted-foreground">Real insights from actual user discussions and market data</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Evidence chips */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="space-y-2">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-medium">Evidence chips</h3>
              <p className="text-sm text-muted-foreground">
                e.g., 23 Reddit threads • 12 reviews • 41 keywords
              </p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Unlock the full numbers & playbook → <span className="font-semibold">$39</span>
              </p>
            </div>
          </div>

          {/* Problem clusters */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="space-y-2">
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-medium">Problem clusters</h3>
              <p className="text-sm text-muted-foreground">
                Top pains & solution requests (with 2 linked quotes)
              </p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Unlock the full numbers & playbook → <span className="font-semibold">$39</span>
              </p>
            </div>
          </div>

          {/* Market signals */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="space-y-2">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-medium">Market signals</h3>
              <p className="text-sm text-muted-foreground">
                12-month trend sparkline (24 months in paid)
              </p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Unlock the full numbers & playbook → <span className="font-semibold">$39</span>
              </p>
            </div>
          </div>

          {/* Action plan */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="space-y-2">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="font-medium">Action plan</h3>
              <p className="text-sm text-muted-foreground">
                90-day GTM + risks (full in paid)
              </p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Unlock the full numbers & playbook → <span className="font-semibold">$39</span>
              </p>
            </div>
          </div>
        </div>

        {/* Social proof row */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-sm font-medium">Trusted by founders at</div>
            <div className="flex items-center gap-6">
              <div className="px-3 py-1 border rounded text-xs font-medium">YC Startups</div>
              <div className="px-3 py-1 border rounded text-xs font-medium">Indie Hackers</div>
              <div className="px-3 py-1 border rounded text-xs font-medium">Product Hunt</div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">How it works</h2>
          <p className="text-muted-foreground">Get validated insights in three simple steps</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-medium">Enter your idea</h3>
            <p className="text-sm text-muted-foreground">
              Describe your startup concept in 1-3 sentences
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-medium">We mine Reddit + reviews + trends</h3>
            <p className="text-sm text-muted-foreground">
              AI analyzes thousands of real user discussions and market signals
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-medium">You get a free report</h3>
            <p className="text-sm text-muted-foreground">
              Upgrade for exact volumes, CPC, CAC/LTV simulator, 24-mo trends, full sources
            </p>
          </div>
        </div>
      </div>

      {/* Free vs Paid comparison */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Free vs Paid</h2>
          <p className="text-muted-foreground">Make the value gap obvious</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free column */}
          <div className="border rounded-lg p-6 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Free</h3>
              <p className="text-2xl font-bold">$0</p>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                2–3 full pain clusters (with 2 linked quotes)
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Trend sparkline (bands, no exact numbers)
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                1 competitor row (features summary)
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Personas light + roadmap headings
              </li>
            </ul>
          </div>

          {/* Paid column */}
          <div className="border-2 border-primary rounded-lg p-6 space-y-4 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                Most Popular
              </span>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Paid</h3>
              <p className="text-2xl font-bold">$39</p>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Exact search volumes, CPC, difficulty + 24-mo trend
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                CAC/LTV simulator + payback estimate
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Full competitor matrix (pricing, sentiment, differentiators)
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                90-day GTM plan + risks & kill-criteria
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                All sources & exports
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know</p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium">Why not show all numbers for free?</h3>
            <p className="text-sm text-muted-foreground">
              We keep costly data pulls for paid; free still shows real quotes & trend signals.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium">What sources?</h3>
            <p className="text-sm text-muted-foreground">
              Reddit + public reviews + Trends; links included.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium">Is my idea private?</h3>
            <p className="text-sm text-muted-foreground">
              We don't share your prompt; excerpts are public-source quotes only.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium">Refunds?</h3>
            <p className="text-sm text-muted-foreground">
              If the paid report lacks enough data to decide, we'll make it right.
            </p>
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