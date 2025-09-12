import { useState } from "react"
import { Lightbulb, Sparkles, Target, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function SearchInterface() {
  const [idea, setIdea] = useState("")
  const [industry, setIndustry] = useState("")
  const [targetMarket, setTargetMarket] = useState("")
  const [timeRange, setTimeRange] = useState("month")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // todo: remove mock functionality - industry options
  const industries = [
    "FinTech", "HealthTech", "EdTech", "E-commerce", "SaaS", 
    "Social Media", "Gaming", "Food & Beverage", "Travel", 
    "Real Estate", "Fitness", "Productivity", "Entertainment"
  ]

  const handleAnalyze = () => {
    if (!idea.trim()) return
    
    setIsAnalyzing(true)
    console.log('Analysis triggered', { idea, industry, targetMarket, timeRange })
    
    // todo: remove mock functionality - simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Validate Your Startup Idea
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tell us about your idea and we'll automatically research Reddit to find relevant discussions, pain points, and market opportunities
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Your Startup Idea
          </label>
          <Textarea
            placeholder="Describe your startup idea in detail. What problem does it solve? What's your solution? e.g., 'A simple budgeting app that automatically categorizes expenses and helps users stick to their financial goals without complex features'"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            data-testid="input-startup-idea"
            className="min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Industry
            </label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger data-testid="select-industry">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Target Market
            </label>
            <Input
              placeholder="e.g., 'Young professionals', 'College students', 'Small business owners'"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              data-testid="input-target-market"
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Research Time Range</label>
            <div className="flex gap-2 flex-wrap">
              {["week", "month", "quarter", "year"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  data-testid={`button-timerange-${range}`}
                >
                  Past {range === "quarter" ? "3 months" : range}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button 
              onClick={handleAnalyze}
              disabled={!idea.trim() || isAnalyzing}
              data-testid="button-analyze"
              size="lg"
              className="w-full md:w-auto"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isAnalyzing ? "Analyzing Reddit Discussions..." : "Analyze Market Opportunity"}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                Identifying relevant subreddits and communities...
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                Searching discussions about {idea.slice(0, 50)}...
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                Analyzing sentiment and extracting pain points...
              </div>
            </div>
          )}
        </div>

        {idea && !isAnalyzing && (
          <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium">AI will automatically research:</p>
            <div className="flex gap-2 flex-wrap">
              {/* todo: remove mock functionality - predicted research areas */}
              <Badge variant="secondary">r/personalfinance</Badge>
              <Badge variant="secondary">r/budgeting</Badge>
              <Badge variant="secondary">r/ynab</Badge>
              <Badge variant="secondary">r/financialplanning</Badge>
              <Badge variant="secondary">r/povertyfinance</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Research areas automatically selected based on your idea and target market
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}