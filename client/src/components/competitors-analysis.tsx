import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import type { Competitor } from "@shared/schema"

interface CompetitorsAnalysisProps {
  competitors: Competitor[]
}

export function CompetitorsAnalysis({ competitors }: CompetitorsAnalysisProps) {
  return (
    <div className="grid gap-6" data-testid="competitors-section">
      {competitors.map((competitor, index) => (
        <Card key={index} className="hover-elevate" data-testid={`competitor-${index}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl" data-testid={`competitor-name-${index}`}>
                  {competitor.name}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" data-testid={`competitor-pricing-${index}`}>
                  {competitor.pricing_model}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            <div>
              <p className="text-sm text-muted-foreground" data-testid={`competitor-description-${index}`}>
                {competitor.description}
              </p>
            </div>

            {/* Market Share */}
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Market Share</span>
              <Badge variant="secondary" data-testid={`competitor-market-share-${index}`}>
                {competitor.market_share}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-700">Strengths</span>
                </div>
                <div className="space-y-1">
                  {competitor.strengths.map((strength, strengthIndex) => (
                    <div 
                      key={strengthIndex}
                      className="flex items-start gap-2"
                      data-testid={`competitor-strength-${index}-${strengthIndex}`}
                    >
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">Weaknesses</span>
                </div>
                <div className="space-y-1">
                  {competitor.weaknesses.map((weakness, weaknessIndex) => (
                    <div 
                      key={weaknessIndex}
                      className="flex items-start gap-2"
                      data-testid={`competitor-weakness-${index}-${weaknessIndex}`}
                    >
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">{weakness}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}