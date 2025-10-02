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
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { TrendingUp, AlertTriangle, Info, CheckCircle } from "lucide-react"
import type { AnalysisResponse } from "@shared/schema"

export default function Results() {
  const [location, setLocation] = useLocation()
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null)

  useEffect(() => {
    console.log('📄 Results page loading...')
    
    // Get results from sessionStorage (set by dashboard after analysis)
    const savedResults = sessionStorage.getItem('analysis-results')
    console.log('📄 Raw sessionStorage data:', savedResults?.substring(0, 200) + '...')
    
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults)
        console.log('🔍 Analysis results loaded for idea:', parsedResults.idea)
        console.log('🔍 Data source:', parsedResults.data_source)
        console.log('🔍 Analysis confidence:', parsedResults.analysis_confidence)
        console.log('🔍 Subreddits (first 3):', parsedResults.subreddits?.slice(0, 3))
        console.log('🔍 Pain points raw:', parsedResults.pain_points)
        console.log('🔍 Pain points type:', typeof parsedResults.pain_points)
        console.log('🔍 Pain points array length:', Array.isArray(parsedResults.pain_points) ? parsedResults.pain_points.length : 'not array')
        if (parsedResults.pain_points && Array.isArray(parsedResults.pain_points) && parsedResults.pain_points.length > 0) {
          console.log('🔍 First pain point structure:', parsedResults.pain_points[0])
        }
        console.log('🔍 Timestamp check - Debug info:', parsedResults.debug)
        setAnalysisResults(parsedResults)
      } catch (error) {
        console.error('❌ Failed to parse analysis results:', error)
        // Redirect back to dashboard if no valid results
        setLocation('/')
      }
    } else {
      console.log('❌ No results found in sessionStorage, redirecting to dashboard')
      // Redirect to dashboard if no results found
      setLocation('/')
    }
  }, [setLocation])

  if (!analysisResults) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading your analysis results...</p>
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
              <h1 className="text-xl font-semibold" data-testid="results-page-title">
                Startup Validation Report
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

      {/* Free Report Banner */}


      {/* Results content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="analysis-results">
        {/* Data Source Indicator */}
        {/* Premium experience: Real Reddit + AI */}
        {analysisResults.data_source === 'reddit_plus_ai' && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-emerald-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-purple-600" />
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold text-purple-800">Premium Analysis - Reddit OAuth + AI</span>
            </div>
            <p className="text-sm text-purple-800">
              {analysisResults.notes || 'Ultimate market validation combining real Reddit discussions with GPT-4o-mini intelligence.'}
            </p>
            <p className="text-xs mt-2 text-purple-700">
              ⭐ <strong>Gold Standard:</strong> {analysisResults.upgrade_message || 'You\'re getting the most accurate market insights possible!'}
            </p>
          </div>
        )}

        {/* AI-Enhanced Analysis */}
        {(() => {
          const debugMode = (analysisResults as any).debug?.mode as string | undefined;
          const isAIEnhanced = (
            analysisResults.data_source === 'ai_synthetic' ||
            analysisResults.analysis_confidence === 'ai_enhanced' ||
            analysisResults.analysis_confidence === 'premium_enhanced' ||
            (debugMode ? debugMode.startsWith('ai_enhanced') : false)
          );
          // Don't show if already showing premium banner
          if (analysisResults.data_source === 'reddit_plus_ai' || !isAIEnhanced) return null;
          return (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-800">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold">AI-Enhanced Analysis</span>
            </div>
            <p className="text-sm">
              {analysisResults.notes || 'Using GPT-4o-mini for sophisticated market validation with realistic business insights.'}
            </p>
            <p className="text-xs mt-2 text-emerald-700">
              🚀 <strong>Powered by AI:</strong> {analysisResults.upgrade_message || 'Add Reddit OAuth for the ultimate analysis experience!'}
            </p>
            {analysisResults.data_source === 'synthetic_only' && analysisResults.analysis_confidence === 'ai_enhanced' && (
              <p className="text-[10px] mt-2 text-emerald-600 italic">
                (Frontend override: backend reported demo data_source but confidence=ai_enhanced. Showing AI banner.)
              </p>
            )}
          </div>
          )
        })()}
        
        {analysisResults.data_source === 'synthetic_only' && analysisResults.analysis_confidence !== 'ai_enhanced' && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="font-semibold">Demo Mode - Synthetic Data</span>
            </div>
            <p className="text-sm">
              {analysisResults.notes || 'Reddit access is currently blocked. Results are generated using AI-powered market analysis for demonstration purposes.'}
            </p>
            <p className="text-xs mt-2 text-amber-700">
              💡 <strong>Want real market data?</strong> We're working on alternative data sources for authentic market validation.
            </p>
          </div>
        )}
        
        {/* Debug display for unknown data_source values */}
        {analysisResults.data_source && !['ai_synthetic', 'synthetic_only', 'mixed_real_synthetic', 'real_reddit_data', 'limited_real', 'reddit_plus_ai'].includes(analysisResults.data_source) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-semibold">Debug: Unknown Data Source</span>
            </div>
            <p className="text-sm">
              Data Source: <code>{analysisResults.data_source}</code><br/>
              Analysis Confidence: <code>{analysisResults.analysis_confidence}</code><br/>
              Debug Mode: <code>{(analysisResults as any).debug?.mode}</code>
            </p>
          </div>
        )}
        
        {analysisResults.data_source === 'mixed_real_synthetic' && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Partial Real Data Analysis</span>
            </div>
            <p className="text-sm">
              Analysis based on <strong>{analysisResults.evidence?.real_post_count || 0} real discussions</strong> plus enhanced AI analysis.
              Confidence: <strong>{analysisResults.analysis_confidence}</strong>
            </p>
          </div>
        )}
        
        {analysisResults.data_source === 'real_reddit_data' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold">Real Market Data Analysis</span>
            </div>
            <p className="text-sm">
              High confidence analysis based on <strong>{analysisResults.evidence?.real_post_count || 0} real market discussions</strong> from Reddit communities.
            </p>
          </div>
        )}
        
        <div className="space-y-8">
          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-primary/10 to-[hsl(var(--hot-pink))/10] rounded-2xl p-6 border border-primary/20">
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

          {/* Sentiment Analysis */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Market Sentiment Analysis</h2>
              <PremiumBadge />
            </div>
            {isPremium ? (
              <SentimentChart sentimentData={analysisResults.sentiment_data} />
            ) : (
              <Card className="relative">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-[hsl(var(--hot-pink))]/10 to-[hsl(var(--bright-orange))]/10 rounded-full flex items-center justify-center">
                    <Lock className="h-6 w-6 text-[hsl(var(--hot-pink))]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Detailed Sentiment Analysis</h3>
                    <p className="text-muted-foreground">Unlock comprehensive sentiment breakdown, emotional triggers, and user satisfaction metrics</p>
                  </div>
                  <UpgradeCTA text="Unlock for $39" size="sm" />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pain Points */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Pain Points Discovered</h2>
            <PainPointsDisplay 
              painPoints={analysisResults.pain_points} 
              subreddits={analysisResults.subreddits} 
              dataSource={analysisResults.data_source}
              analysisConfidence={analysisResults.analysis_confidence}
            />
          </div>

          {/* Premium Upgrade CTA */}
          <div className="my-8">
            <Card className="bg-gradient-to-r from-[hsl(var(--hot-pink))/5] to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">Want Deeper Market Insights?</h3>
                  </div>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Upgrade to Premium for advanced competitor analysis, detailed financial projections, 
                    market sizing data, and unlimited validation reports.
                  </p>
                  <UpgradeCTA text="Upgrade to Premium - $39/month" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* App Ideas */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Generated App Ideas</h2>
              <PremiumBadge />
            </div>
            <AppIdeasGenerator appIdeas={analysisResults.app_ideas} />
          </div>

          {/* Google Trends */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Google Trends Analysis</h2>
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

          {/* Financial Risks */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Financial Risk Assessment</h2>
            <FinancialRisks risks={analysisResults.financial_risks} />
          </div>

          {/* Competitors Analysis */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Competitive Landscape</h2>
            <CompetitorsAnalysis competitors={analysisResults.competitors} />
          </div>

          {/* Revenue Models */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Revenue Strategy & Models</h2>
            <RevenueModels revenueModels={analysisResults.revenue_models} />
          </div>

          {/* Analysis Complete */}
          <div className="mt-12 mb-8">
            <Card className="bg-gradient-to-r from-primary/10 to-[hsl(var(--neon-green))/10] border-primary/30">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-bold">Analysis Complete!</h3>
                  </div>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Your comprehensive startup validation report is ready. Use these insights to refine your business strategy and validate your market opportunity.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button onClick={handleNewAnalysis} data-testid="button-new-analysis" size="lg">
                      Analyze Another Idea
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Methodology */}
          <div className="pt-8 border-t">
            <MethodologyModal />
          </div>
        </div>
      </div>
    </div>
  )
}