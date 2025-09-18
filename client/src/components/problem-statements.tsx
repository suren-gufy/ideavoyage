import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, BarChart3, FileText } from "lucide-react"
import type { ProblemStatement } from "@shared/schema"

interface ProblemStatementsProps {
  problemStatements: ProblemStatement[]
}

export function ProblemStatements({ problemStatements }: ProblemStatementsProps) {
  return (
    <div className="grid gap-6" data-testid="problem-statements-section">
      {problemStatements.map((statement, index) => (
        <Card key={index} className="hover-elevate" data-testid={`problem-statement-${index}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg" data-testid={`problem-title-${index}`}>
                Problem Statement {index + 1}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Problem Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Problem</span>
              </div>
              <p className="text-sm" data-testid={`problem-description-${index}`}>
                {statement.problem}
              </p>
            </div>

            {/* Impact */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Impact</span>
              </div>
              <p className="text-sm" data-testid={`problem-impact-${index}`}>
                {statement.impact}
              </p>
            </div>

            {/* Market Size */}
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Market Size</span>
              <Badge variant="secondary" data-testid={`problem-market-size-${index}`}>
                {statement.market_size}
              </Badge>
            </div>

            {/* Evidence */}
            {statement.evidence.length > 0 && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Supporting Evidence</span>
                <div className="mt-2 space-y-2">
                  {statement.evidence.map((evidence, evidenceIndex) => (
                    <div 
                      key={evidenceIndex}
                      className="flex items-start gap-2 p-2 bg-muted/30 rounded-md"
                      data-testid={`problem-evidence-${index}-${evidenceIndex}`}
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">{evidence}</p>
                    </div>
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