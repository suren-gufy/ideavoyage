import { SearchInterface } from "@/components/search-interface"
import { MetricsOverview } from "@/components/metrics-overview"
import { SentimentChart } from "@/components/sentiment-chart"
import { PainPointsDisplay } from "@/components/pain-points-display"
import { AppIdeasGenerator } from "@/components/app-ideas-generator"

export default function Dashboard() {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold" data-testid="page-title">Reddit Idea Validator</h1>
        <p className="text-muted-foreground">
          Analyze Reddit discussions to validate your ideas and discover market opportunities
        </p>
      </div>

      <SearchInterface />
      
      <div className="space-y-6">
        <h2 className="text-xl font-medium">Analysis Overview</h2>
        <MetricsOverview />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-medium">Sentiment Analysis</h2>
        <SentimentChart />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-medium">Pain Points</h2>
        <PainPointsDisplay />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-medium">Generated App Ideas</h2>
        <AppIdeasGenerator />
      </div>
    </div>
  )
}