import { useState } from "react"
import { AlertCircle, ChevronDown, ExternalLink, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface PainPoint {
  id: string
  title: string
  description: string
  frequency: number
  severity: "high" | "medium" | "low"
  category: string
  relatedSubreddits: string[]
  examplePosts: Array<{
    title: string
    subreddit: string
    upvotes: number
    url: string
  }>
}

interface PainPointsDisplayProps {
  painPoints?: Array<{
    title: string;
    frequency: number;
    urgency: "low" | "medium" | "high";
    examples: string[];
  }>;
  subreddits?: string[];
  dataSource?: string;
  analysisConfidence?: string;
}

export function PainPointsDisplay({ painPoints: propPainPoints, subreddits, dataSource, analysisConfidence }: PainPointsDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Convert API pain points to local format or use mock data
  const painPoints: PainPoint[] = propPainPoints ? propPainPoints.map((pp, index) => ({
    id: index.toString(),
    title: pp.title,
    description: pp.examples[0] || "No description available",
    frequency: pp.frequency,
    severity: pp.urgency,
    category: "General", 
    relatedSubreddits: subreddits || ["unknown"],
    examplePosts: pp.examples.slice(0, 3).map((example, i) => ({
      title: example,
      subreddit: (subreddits && subreddits[i % subreddits.length]) || "unknown",
      upvotes: Math.floor(Math.random() * 300) + 50,
      url: "#"
    }))
  })) : [
    {
      id: "1",
      title: "Budgeting apps are too complex",
      description: "Users consistently complain that existing budgeting apps have overwhelming interfaces with too many features they don't need.",
      frequency: 89,
      severity: "high",
      category: "UX/UI",
      relatedSubreddits: ["personalfinance", "budgeting", "ynab"],
      examplePosts: [
        { title: "Why are all budgeting apps so complicated?", subreddit: "personalfinance", upvotes: 342, url: "#" },
        { title: "Looking for a SIMPLE budget tracker", subreddit: "budgeting", upvotes: 156, url: "#" },
        { title: "YNAB is too complex for beginners", subreddit: "ynab", upvotes: 89, url: "#" }
      ]
    },
    {
      id: "2", 
      title: "Manual transaction entry is tedious",
      description: "People are frustrated with having to manually input every transaction and want better automation.",
      frequency: 76,
      severity: "high",
      category: "Automation",
      relatedSubreddits: ["personalfinance", "mintuit", "budgeting"],
      examplePosts: [
        { title: "Tired of entering every transaction manually", subreddit: "personalfinance", upvotes: 234, url: "#" },
        { title: "Why can't budget apps sync with all banks?", subreddit: "budgeting", upvotes: 178, url: "#" }
      ]
    },
    {
      id: "3",
      title: "Lack of goal tracking features",
      description: "Users want better ways to set and track financial goals within their budgeting apps.",
      frequency: 62,
      severity: "medium",
      category: "Features",
      relatedSubreddits: ["personalfinance", "financialplanning"],
      examplePosts: [
        { title: "Need app that helps track savings goals", subreddit: "personalfinance", upvotes: 145, url: "#" },
        { title: "Budget apps need better goal visualization", subreddit: "financialplanning", upvotes: 98, url: "#" }
      ]
    }
  ]

  const categories = ["all", ...Array.from(new Set(painPoints.map(p => p.category)))]

  const filteredPainPoints = selectedCategory === "all" 
    ? painPoints 
    : painPoints.filter(p => p.category === selectedCategory)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive"
      case "medium": return "default"
      case "low": return "secondary"
      default: return "secondary"
    }
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Pain Points Analysis
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" data-testid="button-filter-pain-points">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              data-testid={`filter-category-${category}`}
            >
              {category === "all" ? "All" : category}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredPainPoints.map((painPoint) => (
          <Collapsible
            key={painPoint.id}
            open={expandedItems.has(painPoint.id)}
            onOpenChange={() => toggleExpanded(painPoint.id)}
          >
            <Card className="hover-elevate">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer" data-testid={`pain-point-${painPoint.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{painPoint.title}</h4>
                        <Badge variant={getSeverityColor(painPoint.severity)}>
                          {painPoint.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Frequency:</span>
                          <Progress value={painPoint.frequency} className="w-20" />
                          <span className="text-sm font-medium">{painPoint.frequency}%</span>
                        </div>
                        <Badge variant="outline">{painPoint.category}</Badge>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${
                        expandedItems.has(painPoint.id) ? "rotate-180" : ""
                      }`} 
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{painPoint.description}</p>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Related Subreddits:</h5>
                      <div className="flex gap-1 flex-wrap">
                        {painPoint.relatedSubreddits.map((subreddit) => (
                          <Badge key={subreddit} variant="secondary">
                            r/{subreddit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Only show example posts if not using AI enhancement */}
                    {dataSource !== 'ai_synthetic' && analysisConfidence !== 'ai_enhanced' && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Example Posts:</h5>
                        <div className="space-y-2">
                          {painPoint.examplePosts.map((post, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium">{post.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>r/{post.subreddit}</span>
                                  <span>•</span>
                                  <span>{post.upvotes} upvotes</span>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => console.log('View post', post.url)}
                                data-testid={`view-post-${index}`}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  )
}