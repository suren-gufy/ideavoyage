import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, Settings } from "lucide-react"
import type { RevenueModel } from "@shared/schema"

interface RevenueModelsProps {
  revenueModels: RevenueModel[]
}

export function RevenueModels({ revenueModels }: RevenueModelsProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-50 text-green-700 border-green-200"
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "hard":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="grid gap-6" data-testid="revenue-models-section">
      {revenueModels.map((model, index) => (
        <Card key={index} className="hover-elevate" data-testid={`revenue-model-${index}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl" data-testid={`revenue-model-type-${index}`}>
                  {model.model_type}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <Badge 
                  variant="outline" 
                  className={getDifficultyColor(model.implementation_difficulty)}
                  data-testid={`revenue-model-difficulty-${index}`}
                >
                  {model.implementation_difficulty}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            <div>
              <p className="text-sm text-muted-foreground" data-testid={`revenue-model-description-${index}`}>
                {model.description}
              </p>
            </div>

            {/* Potential Revenue */}
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border">
              <span className="text-sm font-medium text-muted-foreground">Potential Revenue</span>
              <Badge variant="secondary" data-testid={`revenue-model-potential-${index}`}>
                {model.potential_revenue}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Pros */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-700">Pros</span>
                </div>
                <div className="space-y-1">
                  {model.pros.map((pro, proIndex) => (
                    <div 
                      key={proIndex}
                      className="flex items-start gap-2"
                      data-testid={`revenue-model-pro-${index}-${proIndex}`}
                    >
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">{pro}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">Cons</span>
                </div>
                <div className="space-y-1">
                  {model.cons.map((con, conIndex) => (
                    <div 
                      key={conIndex}
                      className="flex items-start gap-2"
                      data-testid={`revenue-model-con-${index}-${conIndex}`}
                    >
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">{con}</p>
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