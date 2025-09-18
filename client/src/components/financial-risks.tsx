import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Shield } from "lucide-react"
import type { FinancialRisk } from "@shared/schema"

interface FinancialRisksProps {
  risks: FinancialRisk[]
}

export function FinancialRisks({ risks }: FinancialRisksProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "low":
        return <AlertCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="grid gap-4" data-testid="financial-risks-section">
      {risks.map((risk, index) => (
        <Card key={index} className="hover-elevate" data-testid={`financial-risk-${index}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getSeverityIcon(risk.severity)}
                <CardTitle className="text-lg" data-testid={`risk-type-${index}`}>
                  {risk.risk_type}
                </CardTitle>
              </div>
              <Badge 
                variant="outline" 
                className={getSeverityColor(risk.severity)}
                data-testid={`risk-severity-${index}`}
              >
                {risk.severity.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            <div>
              <span className="text-sm font-medium text-muted-foreground">Risk Description</span>
              <p className="text-sm mt-1" data-testid={`risk-description-${index}`}>
                {risk.description}
              </p>
            </div>

            {/* Mitigation Strategy */}
            <div className="p-3 bg-secondary/30 rounded-lg border-l-4 border-l-primary">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Mitigation Strategy</span>
              </div>
              <p className="text-sm text-muted-foreground" data-testid={`risk-mitigation-${index}`}>
                {risk.mitigation_strategy}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}