import { useState } from "react"
import { Lightbulb, Star, TrendingUp, Users, DollarSign, Zap, Copy, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AppIdea {
  id: string
  title: string
  description: string
  targetAudience: string
  marketOpportunity: number
  feasibility: number
  competitiveness: number
  category: string
  features: string[]
  potentialRevenue: string
  timeToMarket: string
  basedOnPainPoints: string[]
}

export function AppIdeasGenerator() {
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null)
  const [generatingNew, setGeneratingNew] = useState(false)

  // todo: remove mock functionality - app ideas data
  const appIdeas: AppIdea[] = [
    {
      id: "1",
      title: "SimpleBudget",
      description: "A minimalist budgeting app that focuses on just the essentials: income, expenses, and savings goals. Uses smart categorization with minimal user input required.",
      targetAudience: "Budget-conscious individuals who find traditional apps too complex",
      marketOpportunity: 85,
      feasibility: 90,
      competitiveness: 75,
      category: "Personal Finance",
      features: [
        "One-tap expense logging",
        "Smart category detection",
        "Visual spending overview",
        "Simple savings goals",
        "Bank sync integration"
      ],
      potentialRevenue: "$2-5M ARR",
      timeToMarket: "3-4 months",
      basedOnPainPoints: ["Budgeting apps are too complex", "Manual transaction entry is tedious"]
    },
    {
      id: "2", 
      title: "GoalTracker Pro",
      description: "A specialized app focused entirely on financial goal setting and tracking with gamification elements to keep users motivated.",
      targetAudience: "Goal-oriented individuals and families planning major purchases",
      marketOpportunity: 70,
      feasibility: 80,
      competitiveness: 60,
      category: "Goal Management",
      features: [
        "Visual goal progress",
        "Achievement milestones",
        "Family goal sharing",
        "Automated savings recommendations",
        "Goal celebration features"
      ],
      potentialRevenue: "$1-3M ARR", 
      timeToMarket: "2-3 months",
      basedOnPainPoints: ["Lack of goal tracking features"]
    },
    {
      id: "3",
      title: "AutoBudget AI",
      description: "An AI-powered budgeting assistant that requires zero manual input. Connects to all accounts and creates budgets automatically based on spending patterns.",
      targetAudience: "Busy professionals who want automated financial management",
      marketOpportunity: 95,
      feasibility: 60,
      competitiveness: 85,
      category: "AI Finance",
      features: [
        "Complete automation",
        "AI spending insights",
        "Predictive budgeting",
        "Smart alerts",
        "Voice interaction"
      ],
      potentialRevenue: "$10-20M ARR",
      timeToMarket: "6-8 months",
      basedOnPainPoints: ["Manual transaction entry is tedious", "Budgeting apps are too complex"]
    }
  ]

  const generateNewIdeas = () => {
    setGeneratingNew(true)
    console.log('Generate new ideas triggered')
    
    // todo: remove mock functionality - simulate AI generation
    setTimeout(() => {
      setGeneratingNew(false)
    }, 3000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-chart-2"
    if (score >= 60) return "text-chart-3"
    return "text-destructive"
  }

  const copyToClipboard = (idea: AppIdea) => {
    const text = `${idea.title}\n\n${idea.description}\n\nTarget Audience: ${idea.targetAudience}\nPotential Revenue: ${idea.potentialRevenue}\nTime to Market: ${idea.timeToMarket}\n\nKey Features:\n${idea.features.map(f => `• ${f}`).join('\n')}`
    navigator.clipboard.writeText(text)
    console.log('Copied to clipboard:', idea.title)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI-Generated App Ideas
          </CardTitle>
          <Button 
            onClick={generateNewIdeas}
            disabled={generatingNew}
            data-testid="button-generate-ideas"
          >
            <Zap className="h-4 w-4 mr-2" />
            {generatingNew ? "Generating..." : "Generate New Ideas"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {appIdeas.map((idea) => (
            <Card key={idea.id} className="hover-elevate">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-lg">{idea.title}</h4>
                      <Badge variant="outline">{idea.category}</Badge>
                    </div>
                    <p className="text-muted-foreground">{idea.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(idea)}
                      data-testid={`copy-idea-${idea.id}`}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => console.log('Export idea', idea.id)}
                      data-testid={`export-idea-${idea.id}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Target Audience</p>
                        <p className="text-sm text-muted-foreground">{idea.targetAudience}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Time to Market</p>
                        <p className="text-sm text-muted-foreground">{idea.timeToMarket}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Potential Revenue</p>
                        <p className="text-sm font-semibold text-chart-2">{idea.potentialRevenue}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Based on Pain Points:</p>
                      <div className="flex gap-2 flex-wrap">
                        {idea.basedOnPainPoints.map((painPoint, index) => (
                          <Badge key={index} variant="secondary">
                            {painPoint}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="space-y-4">
                    <div className="grid gap-2">
                      {idea.features.map((feature, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-md bg-muted/30"
                        >
                          <Star className="h-4 w-4 text-chart-3" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analysis" className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm font-medium">Market Opportunity</span>
                          </div>
                          <span className={`text-sm font-semibold ${getScoreColor(idea.marketOpportunity)}`}>
                            {idea.marketOpportunity}%
                          </span>
                        </div>
                        <Progress value={idea.marketOpportunity} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            <span className="text-sm font-medium">Feasibility</span>
                          </div>
                          <span className={`text-sm font-semibold ${getScoreColor(idea.feasibility)}`}>
                            {idea.feasibility}%
                          </span>
                        </div>
                        <Progress value={idea.feasibility} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="text-sm font-medium">Competitive Edge</span>
                          </div>
                          <span className={`text-sm font-semibold ${getScoreColor(idea.competitiveness)}`}>
                            {idea.competitiveness}%
                          </span>
                        </div>
                        <Progress value={idea.competitiveness} />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}