import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, MessageSquare, TrendingUp, AlertTriangle, ExternalLink } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface RedditPost {
  title: string
  selftext?: string
  score: number
  num_comments: number
  subreddit: string
  permalink: string
  signals?: {
    is_problem_focused: boolean
    is_solution_seeking: boolean
    is_pain_point: boolean
    mentions_cost: boolean
    mentions_competitors: boolean
  }
  content_length?: number
  engagement_ratio?: number
}

interface RedditInsightsProps {
  posts: RedditPost[]
  dataSource: string
}

export function RedditInsights({ posts, dataSource }: RedditInsightsProps) {
  const [expandedPosts, setExpandedPosts] = useState<number[]>([])

  // Filter for posts with actual content
  const postsWithContent = posts.filter(post => 
    post.selftext && post.selftext.length > 20 && (post as any).source !== 'synthetic'
  )

  if (postsWithContent.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reddit Discussions Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No detailed Reddit discussions available for analysis. Posts may be title-only or synthetic data.
          </p>
        </CardContent>
      </Card>
    )
  }

  const togglePost = (index: number) => {
    setExpandedPosts(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'problem_focused': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'solution_seeking': return <TrendingUp className="h-4 w-4 text-blue-500" />
      case 'pain_point': return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'mentions_cost': return <span className="text-green-600">💰</span>
      case 'mentions_competitors': return <span className="text-purple-600">🏆</span>
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  const getSignalBadge = (post: RedditPost) => {
    const signals = []
    if (post.signals?.is_problem_focused) signals.push({ type: 'Problem', color: 'destructive' })
    if (post.signals?.is_solution_seeking) signals.push({ type: 'Solution Seeking', color: 'default' })
    if (post.signals?.is_pain_point) signals.push({ type: 'Pain Point', color: 'secondary' })
    if (post.signals?.mentions_cost) signals.push({ type: 'Pricing', color: 'outline' })
    if (post.signals?.mentions_competitors) signals.push({ type: 'Competitive', color: 'outline' })
    
    return signals.length > 0 ? signals[0] : { type: 'Discussion', color: 'secondary' }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Reddit Discussions Analysis
          <Badge variant="outline">{postsWithContent.length} Real Posts</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          What people are actually saying on Reddit about problems in this space
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {postsWithContent.map((post, index) => {
          const isExpanded = expandedPosts.includes(index)
          const signalBadge = getSignalBadge(post)
          
          return (
            <Card key={index} className="border-l-4 border-l-primary/20">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={signalBadge.color as any} className="text-xs">
                            {signalBadge.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            r/{post.subreddit}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {post.score} upvotes • {post.num_comments} comments
                          </span>
                        </div>
                        <h4 className="font-medium text-sm leading-tight">
                          {post.title}
                        </h4>
                        {post.selftext && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {post.selftext.substring(0, 150)}...
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => togglePost(index)}>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    
                    {/* Full post content */}
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Full Discussion:</h5>
                        <div className="bg-muted/30 p-3 rounded-md text-sm leading-relaxed">
                          {post.selftext}
                        </div>
                      </div>
                      
                      {/* Analysis insights */}
                      <div>
                        <h5 className="font-medium text-sm mb-2">Market Signals:</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {post.signals?.is_problem_focused && (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertTriangle className="h-3 w-3" />
                              Problem-focused discussion
                            </div>
                          )}
                          {post.signals?.is_solution_seeking && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <TrendingUp className="h-3 w-3" />
                              Seeking solutions
                            </div>
                          )}
                          {post.signals?.mentions_cost && (
                            <div className="flex items-center gap-1 text-green-600">
                              💰 Discusses pricing/budget
                            </div>
                          )}
                          {post.signals?.mentions_competitors && (
                            <div className="flex items-center gap-1 text-purple-600">
                              🏆 Mentions alternatives
                            </div>
                          )}
                          <div className="text-muted-foreground">
                            Content: {post.content_length || post.selftext?.length || 0} chars
                          </div>
                          <div className="text-muted-foreground">
                            Engagement: {((post.engagement_ratio || 0) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      {/* Link to original */}
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={`https://reddit.com${post.permalink}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View on Reddit
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )
        })}
        
        {/* Summary */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-2">Analysis Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-medium">Problem Posts:</span> {postsWithContent.filter(p => p.signals?.is_problem_focused).length}
              </div>
              <div>
                <span className="font-medium">Solution Seeking:</span> {postsWithContent.filter(p => p.signals?.is_solution_seeking).length}
              </div>
              <div>
                <span className="font-medium">Pricing Mentions:</span> {postsWithContent.filter(p => p.signals?.mentions_cost).length}
              </div>
              <div>
                <span className="font-medium">Competitor Mentions:</span> {postsWithContent.filter(p => p.signals?.mentions_competitors).length}
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}