import { MetricsOverview } from "@/components/metrics-overview"
import { SentimentChart } from "@/components/sentiment-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BarChart3, PieChart } from "lucide-react"

export default function Analytics() {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold" data-testid="page-title">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Deep dive into sentiment analysis and discussion trends
        </p>
      </div>

      <MetricsOverview />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discussions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              Across 15 subreddits
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last analysis
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2/10</div>
            <p className="text-xs text-muted-foreground">
              Mostly positive discussions
            </p>
          </CardContent>
        </Card>
      </div>

      <SentimentChart />
    </div>
  )
}