import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { GoogleTrend } from "@shared/schema"

interface GoogleTrendsProps {
  trends: GoogleTrend[]
}

export function GoogleTrends({ trends }: GoogleTrendsProps) {
  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case "rising":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />
    }
  }

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case "rising":
        return "bg-green-50 text-green-700 border-green-200"
      case "declining":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
    }
  }

  return (
    <div className="grid gap-4" data-testid="google-trends-section">
      {trends.map((trend, index) => (
        <Card key={index} className="hover-elevate" data-testid={`trend-card-${index}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold" data-testid={`trend-keyword-${index}`}>
                {trend.keyword}
              </CardTitle>
              <div className="flex items-center gap-2">
                {getTrendIcon(trend.trend_direction)}
                <Badge 
                  variant="outline" 
                  className={getTrendColor(trend.trend_direction)}
                  data-testid={`trend-direction-${index}`}
                >
                  {trend.trend_direction}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Interest Level</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trend.interest_level}%` }}
                    data-testid={`trend-interest-bar-${index}`}
                  />
                </div>
                <span className="text-sm font-medium" data-testid={`trend-interest-value-${index}`}>
                  {trend.interest_level}%
                </span>
              </div>
            </div>
            
            {trend.related_queries.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Related Queries</span>
                <div className="flex flex-wrap gap-2">
                  {trend.related_queries.map((query, queryIndex) => (
                    <Badge 
                      key={queryIndex} 
                      variant="secondary" 
                      className="text-xs"
                      data-testid={`related-query-${index}-${queryIndex}`}
                    >
                      {query}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}