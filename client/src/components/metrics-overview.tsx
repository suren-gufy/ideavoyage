import { TrendingUp, MessageSquare, Users, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ElementType
  trend?: "up" | "down" | "neutral"
}

function MetricCard({ title, value, change, icon: Icon, trend = "neutral" }: MetricCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up": return "text-chart-2"
      case "down": return "text-destructive"
      default: return "text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        {change && (
          <p className={`text-xs ${getTrendColor()} flex items-center gap-1`}>
            <TrendingUp className="h-3 w-3" />
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function MetricsOverview() {
  // todo: remove mock functionality - metrics data
  const metrics = [
    {
      title: "Total Posts Analyzed",
      value: "2,847",
      change: "+12% from last search",
      icon: MessageSquare,
      trend: "up" as const
    },
    {
      title: "Sentiment Score",
      value: "7.2/10",
      change: "+0.4 points",
      icon: TrendingUp,
      trend: "up" as const
    },
    {
      title: "Active Communities",
      value: "15",
      change: "5 new subreddits",
      icon: Users,
      trend: "neutral" as const
    },
    {
      title: "Analysis Time",
      value: "3.2s",
      change: "Real-time processing",
      icon: Clock,
      trend: "neutral" as const
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  )
}