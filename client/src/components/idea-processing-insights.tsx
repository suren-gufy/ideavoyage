import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Brain, Target, DollarSign, Users } from "lucide-react"

interface IdeaProcessingProps {
  processing: {
    original_idea: string
    enhanced_idea: string
    spelling_corrections: string[]
    extracted_concepts: string[]
    business_category: string
    clarity_score: number
    suggestions: string[]
    intent_analysis: {
      target_market: string
      problem_focus: string
      solution_type: string
      monetization_hints: string[]
    }
  }
}

export function IdeaProcessingInsights({ processing }: IdeaProcessingProps) {
  const clarityColor = processing.clarity_score >= 8 ? "text-green-600" : 
                      processing.clarity_score >= 6 ? "text-yellow-600" : "text-red-600"
  
  const clarityBg = processing.clarity_score >= 8 ? "bg-green-50" : 
                   processing.clarity_score >= 6 ? "bg-yellow-50" : "bg-red-50"

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Idea Analysis & Enhancement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Enhanced Idea */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Enhanced Idea</h4>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-800 leading-relaxed">{processing.enhanced_idea}</p>
          </div>
          {processing.original_idea !== processing.enhanced_idea && (
            <div className="mt-2 text-xs text-gray-500">
              <details>
                <summary className="cursor-pointer hover:text-gray-700">View original idea</summary>
                <div className="mt-2 p-3 bg-gray-50 rounded border-l-4 border-gray-300">
                  <p className="italic">{processing.original_idea}</p>
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Clarity Score */}
          <div className={`${clarityBg} rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Clarity Score</p>
                <p className={`text-2xl font-bold ${clarityColor}`}>
                  {processing.clarity_score}/10
                </p>
              </div>
              <CheckCircle className={`h-8 w-8 ${clarityColor}`} />
            </div>
          </div>

          {/* Business Category */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Category</p>
                <p className="text-lg font-semibold text-blue-700">
                  {processing.business_category}
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {/* Concept Count */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Key Concepts</p>
                <p className="text-2xl font-bold text-green-700">
                  {processing.extracted_concepts.length}
                </p>
              </div>
              <Brain className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
        </div>

        {/* Spelling Corrections */}
        {processing.spelling_corrections.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Spelling Corrections Applied
            </h4>
            <div className="flex flex-wrap gap-2">
              {processing.spelling_corrections.map((correction, idx) => (
                <Badge key={idx} variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  {correction}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Extracted Concepts */}
        {processing.extracted_concepts.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Business Concepts</h4>
            <div className="flex flex-wrap gap-2">
              {processing.extracted_concepts.map((concept, idx) => (
                <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {concept}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Intent Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Intent Analysis
            </h4>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">Target Market:</span>
                <span className="ml-2 text-gray-800">{processing.intent_analysis.target_market}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Problem Focus:</span>
                <span className="ml-2 text-gray-800">{processing.intent_analysis.problem_focus}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Solution Type:</span>
                <span className="ml-2 text-gray-800">{processing.intent_analysis.solution_type}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue Insights
            </h4>
            
            <div className="flex flex-wrap gap-1">
              {processing.intent_analysis.monetization_hints.map((hint, idx) => (
                <Badge key={idx} variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                  {hint}
                </Badge>
              ))}
            </div>
          </div>
          
        </div>

        {/* Suggestions */}
        {processing.suggestions.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              Improvement Suggestions
            </h4>
            <ul className="space-y-2">
              {processing.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

      </CardContent>
    </Card>
  )
}