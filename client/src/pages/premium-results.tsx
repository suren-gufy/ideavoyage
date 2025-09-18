import { useState, useEffect } from "react"
import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { ScoringCards } from "@/components/scoring-cards"
import { MetricsOverview } from "@/components/metrics-overview"
import { SentimentChart } from "@/components/sentiment-chart"
import { PainPointsDisplay } from "@/components/pain-points-display"
import { AppIdeasGenerator } from "@/components/app-ideas-generator"
import { GoogleTrends } from "@/components/google-trends"
import { ICPDisplay } from "@/components/icp-display"
import { ProblemStatements } from "@/components/problem-statements"
import { FinancialRisks } from "@/components/financial-risks"
import { CompetitorsAnalysis } from "@/components/competitors-analysis"
import { RevenueModels } from "@/components/revenue-models"
import { MethodologyModal } from "@/components/methodology-modal"
import { PremiumBadge } from "@/components/premium-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, TrendingUp, Crown } from "lucide-react"
import { usePremium } from "@/contexts/premium-context"
import type { AnalysisResponse } from "@shared/schema"

export default function PremiumResults() {
  const [location, setLocation] = useLocation()
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null)
  const { isPremium, setShowUpgradeModal } = usePremium()

  useEffect(() => {
    // Get results from sessionStorage (set by dashboard after analysis)
    const savedResults = sessionStorage.getItem('analysis-results')
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults)
        setAnalysisResults(parsedResults)
      } catch (error) {
        console.error('Failed to parse analysis results:', error)
        // Keep analysisResults as null to show "no data" state
      }
    } else {
      // Keep analysisResults as null to show "no data" state instead of redirecting
    }
  }, [])

  // Auto-open upgrade modal for non-premium users
  useEffect(() => {
    if (!isPremium) {
      setShowUpgradeModal(true)
    }
  }, [isPremium, setShowUpgradeModal])

  if (!analysisResults) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setLocation('/')}
                  data-testid="button-back-home"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
                <h1 className="text-xl font-semibold">Premium Analysis</h1>
              </div>
            </div>
          </div>
        </div>

        {/* No Data State */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <Crown className="h-16 w-16 text-primary mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Premium Analysis Access</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Complete a startup analysis first, then upgrade to premium to unlock deeper insights and comprehensive market data.
              </p>
            </div>
            <div className="space-y-4">
              <Button onClick={() => setLocation('/')} size="lg" data-testid="button-start-analysis">
                Start New Analysis
              </Button>
              <p className="text-sm text-muted-foreground">
                Once you complete an analysis, you can upgrade to access premium features like competitor analysis, financial projections, and market trends.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleNewAnalysis = () => {
    sessionStorage.removeItem('analysis-results')
    setLocation('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with navigation */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLocation('/')}
                data-testid="button-back-home"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
              <div className="hidden sm:block h-6 border-l border-border"></div>
              <h1 className="text-xl font-semibold" data-testid="premium-results-page-title">
                Premium Validation Report
                <PremiumBadge />
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" data-testid="button-share">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" data-testid="button-download">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleNewAnalysis} size="sm" data-testid="button-analyze-new">
                Analyze New Idea
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Status Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {isPremium ? (
          <Card className="bg-gradient-to-r from-[hsl(var(--neon-green))]/10 to-primary/10 border-[hsl(var(--neon-green))]/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="h-5 w-5 text-[hsl(var(--neon-green))]" />
                <div className="text-center">
                  <h3 className="font-semibold text-[hsl(var(--neon-green))]">🚀 Premium Access Active - All Features Unlocked!</h3>
                  <p className="text-sm text-muted-foreground">Complete market analysis with advanced insights and unlimited reports</p>
                </div>
                <Sparkles className="h-5 w-5 text-[hsl(var(--neon-green))]" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-r from-primary/5 to-[hsl(var(--hot-pink))]/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-3">
                <Crown className="h-5 w-5 text-primary" />
                <div className="text-center">
                  <h3 className="font-semibold">Premium Analysis Preview</h3>
                  <p className="text-sm text-muted-foreground">Complete the upgrade to unlock all premium features and insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="premium-analysis-results">
        <div className="space-y-8">
          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-primary/10 to-[hsl(var(--hot-pink))]/10 rounded-2xl p-6 border border-primary/20">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Executive Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {analysisResults.overall_score}/10
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[hsl(var(--hot-pink))]">
                    {analysisResults.viability_score}/10
                  </div>
                  <div className="text-sm text-muted-foreground">Viability Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[hsl(var(--neon-green))]">
                    {analysisResults.total_posts_analyzed}
                  </div>
                  <div className="text-sm text-muted-foreground">Posts Analyzed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scoring Cards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Market Validation Scores</h2>
            <ScoringCards 
              overallScore={analysisResults.overall_score || 0} 
              viabilityScore={analysisResults.viability_score || 0} 
            />
          </div>

          {/* Metrics Overview */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Key Metrics</h2>
            <MetricsOverview analysisData={analysisResults} />
          </div>

          {/* Sentiment Analysis - Always show in premium page */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Market Sentiment Analysis</h2>
              <PremiumBadge />
            </div>
            <SentimentChart sentimentData={analysisResults.sentiment_data} />
          </div>

          {/* Pain Points */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Pain Points Discovered</h2>
            <PainPointsDisplay painPoints={analysisResults.pain_points} />
          </div>

          {/* App Ideas */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Generated App Ideas</h2>
              <PremiumBadge />
            </div>
            <AppIdeasGenerator appIdeas={analysisResults.app_ideas} />
          </div>

          {/* Google Trends - Always show in premium page */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Google Trends Analysis</h2>
              <PremiumBadge />
            </div>
            <GoogleTrends trends={analysisResults.google_trends} />
          </div>

          {/* Ideal Customer Profile */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Ideal Customer Profile (ICP)</h2>
            <ICPDisplay icp={analysisResults.icp} />
          </div>

          {/* Problem Statements */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Problem Statements</h2>
            <ProblemStatements problemStatements={analysisResults.problem_statements} />
          </div>

          {/* Financial Risks - Always show in premium page */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Financial Risk Assessment</h2>
              <PremiumBadge />
            </div>
            <FinancialRisks risks={analysisResults.financial_risks} />
          </div>

          {/* Competitors Analysis - Always show in premium page */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Competitive Landscape</h2>
              <PremiumBadge />
            </div>
            <CompetitorsAnalysis competitors={analysisResults.competitors} />
          </div>

          {/* Revenue Models - Always show in premium page */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Revenue Strategy & Models</h2>
              <PremiumBadge />
            </div>
            <RevenueModels revenueModels={analysisResults.revenue_models} />
          </div>

          {/* Success Message for Premium Users */}
          {isPremium && (
            <div className="mt-12 mb-8">
              <Card className="bg-gradient-to-r from-[hsl(var(--neon-green))]/10 to-primary/10 border-[hsl(var(--neon-green))]/30">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="h-8 w-8 text-[hsl(var(--neon-green))]" />
                      <h3 className="text-2xl font-bold">Complete Premium Analysis</h3>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                      You now have access to comprehensive market analysis, competitor insights, 
                      and financial projections. Use these insights to validate and refine your startup idea.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <Button onClick={handleNewAnalysis} size="lg" data-testid="button-new-analysis">
                        Analyze Another Idea
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Methodology */}
          <div className="pt-8 border-t">
            <MethodologyModal />
          </div>
        </div>
      </div>
    </div>
  )
}