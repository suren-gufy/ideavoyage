import { useState } from "react"
import { useLocation } from "wouter"
import { Lightbulb, Sparkles, Target, Building2, ChevronDown, ChevronUp, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useMutation } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import type { AnalyzeIdeaRequest, AnalysisResponse } from "@shared/schema"

interface SearchInterfaceProps {
  // No props needed anymore - navigation handles the flow
}

export function SearchInterface({}: SearchInterfaceProps) {
  const [idea, setIdea] = useState("")
  const [industry, setIndustry] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [country, setCountry] = useState("global")
  const [platform, setPlatform] = useState<"web-app" | "mobile-app" | "both">("web-app")
  const [fundingMethod, setFundingMethod] = useState<"self-funded" | "bootstrapping" | "raising-capital">("self-funded")
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("year")
  const [email, setEmail] = useState("")
  const [goal, setGoal] = useState("")
  const [role, setRole] = useState("")
  const [timeline, setTimeline] = useState("")
  const [showOptionalFields, setShowOptionalFields] = useState(false)
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const { toast } = useToast()
  const [location, setLocation] = useLocation()

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
      console.log('🚀 Starting fresh API request for:', data.idea)
      const response = await apiRequest("/api", "POST", data)
      console.log('🚀 Fresh API response received:', response)
      return response as AnalysisResponse
    },
    // Disable all caching for analysis requests
    retry: false,
    onSuccess: (results) => {
      console.log('🔄 NEW Analysis completed successfully:', results)
      console.log('🔄 NEW Analysis idea:', results.idea)
      console.log('🔄 NEW Analysis subreddits:', results.subreddits)
      console.log('🔄 NEW Analysis data_source:', results.data_source)
      console.log('🔄 NEW Analysis confidence:', results.analysis_confidence)
      
      // Clear any existing cached results first
      sessionStorage.removeItem('analysis-results')
      
      // Save fresh results to sessionStorage and navigate to results page
      sessionStorage.setItem('analysis-results', JSON.stringify(results))
      console.log('🔄 Fresh results saved to sessionStorage')
      setLocation('/results')
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
    
    // Clear any previous analysis results to prevent stale data
    sessionStorage.removeItem('analysis-results')
    console.log('🗑️ Cleared previous analysis results')
    
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
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card to-primary/5">
        <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Main idea input - Always visible above the fold */}
          <div className="space-y-2">
            <label className="text-lg font-medium">
              Describe your idea (1–3 sentences)
            </label>
            <Textarea
              placeholder="AI meal-planning coach that builds weekly menus from pantry photos."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              data-testid="input-startup-idea"
              className="min-h-[120px] text-base border-2 border-primary/30 focus:border-primary"
            />
          </div>

          {/* Improve accuracy section - Progressive disclosure */}
          <Collapsible open={showOptionalFields} onOpenChange={setShowOptionalFields}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-3 h-auto bg-gradient-to-r from-[hsl(var(--neon-green))/5] to-[hsl(var(--hot-pink))/5] hover:from-[hsl(var(--neon-green))/10] hover:to-[hsl(var(--hot-pink))/10] border border-[hsl(var(--neon-green))/20] rounded-lg"
                data-testid="toggle-optional-fields"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-[hsl(var(--neon-green))]" />
                    <span className="text-sm font-semibold text-[hsl(var(--neon-green))]">
                      Improve accuracy (optional)
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-[hsl(var(--neon-green))] text-white text-xs w-fit">
                    +43.25% accuracy
                  </Badge>
                </div>
                {showOptionalFields ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="bg-gradient-to-r from-[hsl(var(--neon-green))/10] to-[hsl(var(--hot-pink))/10] rounded-lg p-4 border border-[hsl(var(--neon-green))/20]">

              <div className="space-y-4">
              {/* Target Audience - Free text with suggestions */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Target audience</label>
                <Input
                  placeholder="e.g., Busy parents with young children"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  data-testid="input-custom-audience"
                  className="text-sm"
                />
                <div className="flex gap-2 flex-wrap">
                  {["Gen-Z freelancers", "New parents", "SMBs", "College students", "Remote workers"].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => setTargetAudience(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Industry */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
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

                {/* Geography */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target geography</label>
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
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Platform */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform</label>
                  <Select value={platform} onValueChange={(value: "web-app" | "mobile-app" | "both") => setPlatform(value)}>
                    <SelectTrigger data-testid="select-platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-app">Web App</SelectItem>
                      <SelectItem value="mobile-app">Mobile App</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Time Range - Fixed to 12 months for optimal insights */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Analysis time range</label>
                  <div className="px-3 py-2 bg-muted/50 border border-border rounded-md text-sm text-muted-foreground flex items-center gap-2" data-testid="text-time-range">
                    <BarChart3 className="h-4 w-4" />
                    Past 12 months (optimal for trend analysis)
                  </div>
                </div>

                {/* Main Goal */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Main goal</label>
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger data-testid="select-goal">
                      <SelectValue placeholder="Select main goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="validate-demand">Validate demand</SelectItem>
                      <SelectItem value="find-competitors">Find competitors</SelectItem>
                      <SelectItem value="understand-pain-points">Understand pain points</SelectItem>
                      <SelectItem value="identify-features">Identify key features</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              </div>
            </div>
            </CollapsibleContent>
            </Collapsible>

          {!showEmailCapture && !analyzeIdeaMutation.isPending && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button 
                onClick={() => {
                  if (!idea.trim()) {
                    toast({
                      title: "Missing Information",
                      description: "Please describe your startup idea first.",
                      variant: "destructive",
                    })
                    return
                  }
                  setShowEmailCapture(true)
                }}
                disabled={!idea.trim()}
                data-testid="button-analyze"
                className="px-8 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
              >
                Validate my Startup Idea
              </Button>
              <button
                onClick={() => {
                  // TODO: Open sample report modal/new tab
                  toast({
                    title: "Sample Report",
                    description: "Opening sample report preview...",
                  })
                }}
                data-testid="link-sample-report"
                className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium text-base transition-colors duration-200"
              >
                👀 See a sample report
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Email Capture During Generation */}
      {showEmailCapture && (
        <Card className="mt-8 border-2 border-[hsl(var(--hot-pink))/20] shadow-2xl bg-gradient-to-br from-card to-[hsl(var(--hot-pink))/5]">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-3 w-3 bg-[hsl(var(--hot-pink))] rounded-full animate-pulse"></div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--hot-pink))] to-primary bg-clip-text text-transparent">
                    We're scanning sources…
                  </span>
                </div>
                <p className="text-lg text-muted-foreground">Where should we send the link & updates?</p>
              </div>
              
              <div className="space-y-6 max-w-lg mx-auto">
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="your-email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-email"
                    className="text-center text-xl h-14 border-2 border-[hsl(var(--hot-pink))/30] focus:border-[hsl(var(--hot-pink))]"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    We only use this to save & send your report. No spam.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role (optional)</label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger data-testid="select-role" className="h-12">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="founder">Founder</SelectItem>
                        <SelectItem value="indie-hacker">Indie hacker</SelectItem>
                        <SelectItem value="pm">PM</SelectItem>
                        <SelectItem value="agency">Agency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Timeline (optional)</label>
                    <Select value={timeline} onValueChange={setTimeline}>
                      <SelectTrigger data-testid="select-timeline" className="h-12">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Now</SelectItem>
                        <SelectItem value="this-month">This month</SelectItem>
                        <SelectItem value="exploring">Exploring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleAnalyze}
                  disabled={!email.trim() || analyzeIdeaMutation.isPending}
                  data-testid="button-start-analysis"
                  size="lg"
                  className="w-full py-6 text-xl font-bold bg-gradient-to-r from-[hsl(var(--hot-pink))] to-[hsl(var(--bright-orange))] hover:from-[hsl(var(--hot-pink))/90] hover:to-[hsl(var(--bright-orange))/90] shadow-2xl"
                >
                  <Sparkles className="h-6 w-6 mr-3" />
                  {analyzeIdeaMutation.isPending ? "Analyzing Reddit Discussions..." : "🚀 Start Analysis"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading States */}
      {analyzeIdeaMutation.isPending && (
        <Card className="mt-8 border-2 border-[hsl(var(--bright-orange))/20] shadow-2xl bg-gradient-to-br from-card to-[hsl(var(--bright-orange))/5]">
          <CardContent className="p-8">
            <div className="space-y-4 p-6 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-3 text-lg">
                <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div>
                AI is identifying relevant subreddits and communities...
              </div>
              <div className="flex items-center gap-3 text-lg">
                <div className="h-3 w-3 bg-[hsl(var(--neon-green))] rounded-full animate-pulse"></div>
                Analyzing discussions about "{idea.slice(0, 50)}..."
              </div>
              <div className="flex items-center gap-3 text-lg">
                <div className="h-3 w-3 bg-[hsl(var(--hot-pink))] rounded-full animate-pulse"></div>
                Extracting pain points and sentiment analysis...
              </div>
              <div className="flex items-center gap-3 text-lg">
                <div className="h-3 w-3 bg-[hsl(var(--bright-orange))] rounded-full animate-pulse"></div>
                Generating app ideas and market insights...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Preview */}
      {idea && !showEmailCapture && !analyzeIdeaMutation.isPending && !analyzeIdeaMutation.isSuccess && (
        <Card className="mt-8 border-2 border-primary/20 shadow-xl">
          <CardContent className="p-6">
            <div className="space-y-4 p-6 bg-muted/30 rounded-xl">
              <p className="text-lg font-semibold">🤖 AI will automatically research:</p>
              <div className="flex gap-3 flex-wrap">
                <Badge variant="secondary" className="text-base py-2 px-4">Relevant subreddits</Badge>
                <Badge variant="secondary" className="text-base py-2 px-4">Keywords & topics</Badge>
                <Badge variant="secondary" className="text-base py-2 px-4">Pain points & frustrations</Badge>
                <Badge variant="secondary" className="text-base py-2 px-4">Solution requests</Badge>
                <Badge variant="secondary" className="text-base py-2 px-4">Market sentiment</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Research areas automatically selected based on your idea and target audience
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {analyzeIdeaMutation.isSuccess && (
        <Card className="mt-8 border-2 border-[hsl(var(--neon-green))] shadow-2xl bg-gradient-to-br from-card to-[hsl(var(--neon-green))/5]">
          <CardContent className="p-6">
            <div className="space-y-4 p-6 bg-[hsl(var(--neon-green))/10] rounded-xl border border-[hsl(var(--neon-green))/20]">
              <p className="text-xl font-bold text-[hsl(var(--neon-green))]">✅ Analysis Complete!</p>
              <p className="text-lg text-muted-foreground">
                Check the dashboard below for detailed insights about your startup idea.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}