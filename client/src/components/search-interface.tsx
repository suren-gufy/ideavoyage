import { useState } from "react"
import { Lightbulb, Sparkles, Target, Building2, ChevronDown, ChevronUp } from "lucide-react"
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
  const [email, setEmail] = useState("")
  const [goal, setGoal] = useState("")
  const [role, setRole] = useState("")
  const [timeline, setTimeline] = useState("")
  const [showOptionalFields, setShowOptionalFields] = useState(false)
  const [showEmailCapture, setShowEmailCapture] = useState(false)
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
    <div className="max-w-3xl mx-auto">
      {/* Step 1: Minimal Start */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-lg font-medium">
                Describe your idea (1–3 sentences)
              </label>
              <Textarea
                placeholder="AI meal-planning coach that builds weekly menus from pantry photos."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                data-testid="input-startup-idea"
                className="min-h-[120px] text-base"
              />
            </div>

            {/* Progressive Disclosure Accordion */}
            <Collapsible open={showOptionalFields} onOpenChange={setShowOptionalFields}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-between p-3 h-auto text-sm border border-dashed"
                  data-testid="toggle-optional-fields"
                >
                  <span>Improve accuracy (optional)</span>
                  {showOptionalFields ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                {/* Target Audience */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target audience</label>
                  <div className="flex gap-2 flex-wrap">
                    {["Gen-Z freelancers", "New parents", "SMBs", "College students", "Remote workers"].map((audience) => (
                      <Button
                        key={audience}
                        variant={targetAudience === audience ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTargetAudience(targetAudience === audience ? "" : audience)}
                        data-testid={`chip-audience-${audience.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        {audience}
                      </Button>
                    ))}
                  </div>
                  <Input
                    placeholder="Or describe your own..."
                    value={targetAudience.includes("Gen-Z") || targetAudience.includes("New parents") || targetAudience.includes("SMBs") || targetAudience.includes("College") || targetAudience.includes("Remote") ? "" : targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    data-testid="input-custom-audience"
                    className="text-sm"
                  />
                </div>

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

                {/* Target Geography */}
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

                {/* Platform Multi-select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform</label>
                  <div className="flex gap-2 flex-wrap">
                    {["Web", "iOS", "Android", "Extension", "B2B"].map((platformOption) => (
                      <Button
                        key={platformOption}
                        variant={
                          (platformOption === "Web" && (platform === "web-app" || platform === "both")) ||
                          (platformOption === "iOS" && (platform === "mobile-app" || platform === "both")) ||
                          (platformOption === "Android" && (platform === "mobile-app" || platform === "both"))
                            ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          if (platformOption === "Web") {
                            setPlatform(platform === "web-app" ? "mobile-app" : platform === "both" ? "mobile-app" : "web-app")
                          } else if (platformOption === "iOS" || platformOption === "Android") {
                            setPlatform(platform === "mobile-app" ? "web-app" : platform === "both" ? "web-app" : "mobile-app")
                          }
                        }}
                        data-testid={`platform-${platformOption.toLowerCase()}`}
                      >
                        {platformOption}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Main Goal */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Main goal</label>
                  <div className="space-y-2">
                    {[
                      { value: "decide", label: "Decide build/kill" },
                      { value: "size", label: "Size demand" },
                      { value: "gtm", label: "Find GTM angle" }
                    ].map((goalOption) => (
                      <label key={goalOption.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="goal"
                          value={goalOption.value}
                          checked={goal === goalOption.value}
                          onChange={(e) => setGoal(e.target.checked ? goalOption.value : "")}
                          className="text-primary"
                        />
                        <span className="text-sm">{goalOption.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget Stage */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Budget stage</label>
                  <Select value={fundingMethod} onValueChange={(value) => setFundingMethod(value as "self-funded" | "bootstrapping" | "raising-capital")}>
                    <SelectTrigger data-testid="select-funding">
                      <SelectValue placeholder="Select budget stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self-funded">Self-funded</SelectItem>
                      <SelectItem value="bootstrapping">Pre-seed</SelectItem>
                      <SelectItem value="raising-capital">Seed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {!showEmailCapture && !analyzeIdeaMutation.isPending && (
              <div className="flex items-center justify-center">
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
                  size="lg"
                  className="px-8 py-3 text-lg font-semibold"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate my free report
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Email Capture During Generation */}
      {showEmailCapture && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-lg font-medium">We're scanning sources…</span>
                </div>
                <p className="text-muted-foreground">Where should we send the link & updates?</p>
              </div>
              
              <div className="space-y-4 max-w-md mx-auto">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="your-email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-email"
                    className="text-center text-lg"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    We only use this to save & send your report. No spam.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role (optional)</label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger data-testid="select-role">
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
                      <SelectTrigger data-testid="select-timeline">
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
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {analyzeIdeaMutation.isPending ? "Analyzing Reddit Discussions..." : "Start Analysis"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading States */}
      {analyzeIdeaMutation.isPending && (
        <Card className="mt-6">
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
      )}

      {/* Information Preview */}
      {idea && !showEmailCapture && !analyzeIdeaMutation.isPending && !analyzeIdeaMutation.isSuccess && (
        <Card className="mt-6">
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {analyzeIdeaMutation.isSuccess && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="space-y-2 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Analysis Complete!</p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Check the dashboard below for detailed insights about your startup idea.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}