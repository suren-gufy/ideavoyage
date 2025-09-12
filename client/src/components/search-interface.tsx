import { useState } from "react"
import { Lightbulb, Sparkles, Target, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useMutation } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import type { AnalyzeIdeaRequest, AnalysisResponse } from "@shared/schema"

interface SearchInterfaceProps {
  onAnalysisComplete?: (results: AnalysisResponse) => void;
}

export function SearchInterface({ onAnalysisComplete }: SearchInterfaceProps) {
  const [idea, setIdea] = useState("")
  const [industry, setIndustry] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [country, setCountry] = useState("global")
  const [platform, setPlatform] = useState<"web-app" | "mobile-app" | "both">("web-app")
  const [fundingMethod, setFundingMethod] = useState<"self-funded" | "bootstrapping" | "raising-capital">("self-funded")
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month")
  const { toast } = useToast()

  // Industry options
  const industries = [
    "FinTech", "HealthTech", "EdTech", "E-commerce", "SaaS", 
    "Social Media", "Gaming", "Food & Beverage", "Travel", 
    "Real Estate", "Fitness", "Productivity", "Entertainment"
  ]

  // Country options
  const countries = [
    "Global",
    "United States", "Canada", "United Kingdom", "Germany", "France", "Italy", "Spain", "Netherlands", "Belgium", "Switzerland", "Austria", "Sweden", "Norway", "Denmark", "Finland", "Poland", "Czech Republic", "Hungary", "Romania", "Bulgaria", "Croatia", "Slovenia", "Slovakia", "Lithuania", "Latvia", "Estonia", "Ireland", "Portugal", "Greece", "Cyprus", "Malta", "Luxembourg",
    "Australia", "New Zealand", "Japan", "South Korea", "Singapore", "Hong Kong", "Taiwan", "Malaysia", "Thailand", "Philippines", "Indonesia", "Vietnam", "India", "China", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "Myanmar", "Cambodia", "Laos",
    "Brazil", "Argentina", "Chile", "Colombia", "Peru", "Ecuador", "Bolivia", "Paraguay", "Uruguay", "Venezuela", "Mexico", "Guatemala", "Honduras", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Dominican Republic", "Haiti", "Jamaica", "Trinidad and Tobago", "Barbados",
    "South Africa", "Nigeria", "Kenya", "Ghana", "Ethiopia", "Morocco", "Egypt", "Tunisia", "Algeria", "Libya", "Sudan", "Tanzania", "Uganda", "Zimbabwe", "Zambia", "Botswana", "Namibia", "Mauritius", "Seychelles",
    "Russia", "Ukraine", "Belarus", "Moldova", "Georgia", "Armenia", "Azerbaijan", "Kazakhstan", "Uzbekistan", "Turkmenistan", "Tajikistan", "Kyrgyzstan", "Mongolia",
    "Israel", "Turkey", "Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait", "Bahrain", "Oman", "Jordan", "Lebanon", "Iraq", "Iran", "Afghanistan"
  ]

  const analyzeIdeaMutation = useMutation({
    mutationFn: async (data: AnalyzeIdeaRequest): Promise<AnalysisResponse> => {
      const response = await apiRequest("POST", "/api/analyze", data)
      return await response.json() as AnalysisResponse
    },
    onSuccess: (results) => {
      console.log('Analysis completed successfully:', results)
      onAnalysisComplete?.(results)
      toast({
        title: "Analysis Complete!",
        description: `Found ${results.subreddits.length} relevant subreddits and ${results.pain_points.length} key pain points.`,
      })
    },
    onError: (error) => {
      console.error('Analysis failed:', error)
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your startup idea. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleAnalyze = () => {
    if (!idea.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your startup idea first.",
        variant: "destructive",
      })
      return
    }
    
    console.log('Analysis triggered', { idea, industry, targetAudience, country, platform, fundingMethod, timeRange })
    
    analyzeIdeaMutation.mutate({
      idea: idea.trim(),
      industry: industry || undefined,
      targetAudience: targetAudience || undefined,
      country,
      platform,
      fundingMethod,
      timeRange,
    })
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
              Target Audience <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <Input
              placeholder="e.g., 'Young professionals', 'College students', 'Small business owners'"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              data-testid="input-target-audience"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Country</label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger data-testid="select-country">
                <SelectValue placeholder="Select target country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country.toLowerCase().replace(/ /g, '-')}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <Select value={platform} onValueChange={(value) => setPlatform(value as "web-app" | "mobile-app" | "both")}>
              <SelectTrigger data-testid="select-platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web-app">Web App</SelectItem>
                <SelectItem value="mobile-app">Mobile App</SelectItem>
                <SelectItem value="both">Both Web & Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Funding Method</label>
          <Select value={fundingMethod} onValueChange={(value) => setFundingMethod(value as "self-funded" | "bootstrapping" | "raising-capital")}>
            <SelectTrigger data-testid="select-funding">
              <SelectValue placeholder="How are you planning to fund this?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="self-funded">Self-funded</SelectItem>
              <SelectItem value="bootstrapping">Bootstrapping</SelectItem>
              <SelectItem value="raising-capital">Raising Capital</SelectItem>
            </SelectContent>
          </Select>
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
                  onClick={() => setTimeRange(range as "week" | "month" | "quarter" | "year")}
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
              disabled={!idea.trim() || analyzeIdeaMutation.isPending}
              data-testid="button-analyze"
              size="lg"
              className="w-full md:w-auto"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {analyzeIdeaMutation.isPending ? "Analyzing Reddit Discussions..." : "Analyze Market Opportunity"}
            </Button>
          </div>

          {analyzeIdeaMutation.isPending && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                AI is identifying relevant subreddits and communities...
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                Analyzing discussions about "{idea.slice(0, 50)}..."
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                Extracting pain points and sentiment analysis...
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                Generating app ideas and market insights...
              </div>
            </div>
          )}
        </div>

        {idea && !analyzeIdeaMutation.isPending && !analyzeIdeaMutation.isSuccess && (
          <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium">AI will automatically research:</p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">Relevant subreddits</Badge>
              <Badge variant="secondary">Keywords & topics</Badge>
              <Badge variant="secondary">Pain points & frustrations</Badge>
              <Badge variant="secondary">Solution requests</Badge>
              <Badge variant="secondary">Market sentiment</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Research areas automatically selected based on your idea and target audience
            </p>
          </div>
        )}

        {analyzeIdeaMutation.isSuccess && (
          <div className="space-y-2 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">Analysis Complete!</p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Check the dashboard below for detailed insights about your startup idea.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}