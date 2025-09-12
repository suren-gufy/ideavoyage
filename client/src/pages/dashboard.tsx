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
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold" data-testid="page-title">Stop wasting time and money. Validate your startup idea</h1>
        <p className="text-muted-foreground">
          Get instant AI-powered analysis of Reddit discussions to validate your ideas and discover real market opportunities
        </p>
      </div>

      <SearchInterface onAnalysisComplete={handleAnalysisComplete} />
      
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