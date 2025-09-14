import { useState, useEffect } from "react"
import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { ScoringCards } from "@/components/scoring-cards"
import { MetricsOverview } from "@/components/metrics-overview"
import { SentimentChart } from "@/components/sentiment-chart"
import { PainPointsDisplay } from "@/components/pain-points-display"
import { AppIdeasGenerator } from "@/components/app-ideas-generator"
import { MethodologyModal } from "@/components/methodology-modal"
import type { AnalysisResponse } from "@shared/schema"

export default function Results() {
  const [location, setLocation] = useLocation()
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null)

  useEffect(() => {
    // Get results from sessionStorage (set by dashboard after analysis)
    const savedResults = sessionStorage.getItem('analysis-results')
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults)
        setAnalysisResults(parsedResults)
      } catch (error) {
        console.error('Failed to parse analysis results:', error)
        // Redirect back to dashboard if no valid results
        setLocation('/')
      }
    } else {
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

      {/* Results content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="analysis-results">
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
            <h2 className="text-2xl font-bold">Market Sentiment Analysis</h2>
            <SentimentChart sentimentData={analysisResults.sentiment_data} />
          </div>

          {/* Pain Points */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Pain Points Discovered</h2>
            <PainPointsDisplay painPoints={analysisResults.pain_points} />
          </div>

          {/* App Ideas */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Generated App Ideas</h2>
            <AppIdeasGenerator appIdeas={analysisResults.app_ideas} />
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