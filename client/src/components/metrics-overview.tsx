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
      title: "Reddit Posts Analyzed",
      value: "2,847",
      change: "From 12 relevant subreddits",
      icon: MessageSquare,
      trend: "up" as const
    },
    {
      title: "Market Interest Level",
      value: "High",
      change: "Strong demand signals detected",
      icon: TrendingUp,
      trend: "up" as const
    },
    {
      title: "Pain Points Found",
      value: "23",
      change: "Actionable user frustrations",
      icon: Users,
      trend: "neutral" as const
    },
    {
      title: "Research Timeframe",
      value: "Past Month",
      change: "Recent discussions analyzed",
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