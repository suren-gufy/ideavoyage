import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

interface ScoringCardsProps {
  overallScore: number
  viabilityScore: number
}

export function ScoringCards({ overallScore, viabilityScore }: ScoringCardsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400"
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400" 
    if (score >= 4) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
    if (score >= 6) return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
    if (score >= 4) return "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800"
    return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className={getScoreBgColor(overallScore)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            Overall Score
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" data-testid="tooltip-overall-score" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Overall score out of 10 on the idea on how good or bad of an idea it is</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-overall-score">
            <span className={getScoreColor(overallScore)}>{overallScore.toFixed(1)}</span>
            <span className="text-muted-foreground text-base font-normal ml-1">/10</span>
          </div>
        </CardContent>
      </Card>

      <Card className={getScoreBgColor(viabilityScore)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            Viability Score
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" data-testid="tooltip-viability-score" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>On a scale of 10 how easy or difficult it is to bring the idea to life (considering complexities and scale)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-viability-score">
            <span className={getScoreColor(viabilityScore)}>{viabilityScore.toFixed(1)}</span>
            <span className="text-muted-foreground text-base font-normal ml-1">/10</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}