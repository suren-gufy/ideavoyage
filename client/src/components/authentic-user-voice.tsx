import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Quote, TrendingUp, DollarSign, Users, Zap, Crown } from "lucide-react"

interface AuthenticUserVoiceProps {
  painPoints: any[]
  redditPosts: any[]
  dataSource: string
}

export function AuthenticUserVoice({ painPoints, redditPosts, dataSource }: AuthenticUserVoiceProps) {
  const [selectedCategory, setSelectedCategory] = useState("pain_phrases")

  // Only show for premium data sources
  if (dataSource !== 'reddit_plus_ai') {
    return null
  }

  // Extract authentic user language patterns from Reddit posts
  const extractUserLanguagePatterns = () => {
    const patterns = {
      pain_phrases: [],
      solution_seeking: [],
      purchase_intent: [],
      frustration_triggers: [],
      success_stories: [],
      budget_discussions: []
    }

    redditPosts.forEach(post => {
      const text = (post.title + ' ' + (post.selftext || '')).toLowerCase()
      
      // Pain point phrases (user's exact words)
      if (text.match(/\\b(i hate|can't stand|so annoying|drives me crazy|wish there was|need something|tired of)\\b/)) {
        patterns.pain_phrases.push({
          phrase: post.title,
          source: `r/${post.subreddit}`,
          engagement: post.score || 0,
          type: 'pain'
        })
      }
      
      // Solution seeking patterns
      if (text.match(/\\b(recommend|looking for|need help|what should|advice|suggestions)\\b/)) {
        patterns.solution_seeking.push({
          phrase: post.title,
          source: `r/${post.subreddit}`,
          engagement: post.score || 0,
          type: 'seeking'
        })
      }
      
      // Purchase intent signals
      if (text.match(/\\b(worth it|should i buy|ready to pay|budget for|willing to spend)\\b/)) {
        patterns.purchase_intent.push({
          phrase: post.title,
          source: `r/${post.subreddit}`,
          engagement: post.score || 0,
          type: 'buying'
        })
      }
      
      // Frustration triggers
      if (text.match(/\\b(ugh|omg|seriously|wtf|terrible|awful|worst|sucks)\\b/)) {
        patterns.frustration_triggers.push({
          phrase: post.title,
          source: `r/${post.subreddit}`,
          engagement: post.score || 0,
          type: 'frustration'
        })
      }
      
      // Success stories
      if (text.match(/\\b(finally|success|worked|amazing|love|perfect|exactly what)\\b/)) {
        patterns.success_stories.push({
          phrase: post.title,
          source: `r/${post.subreddit}`,
          engagement: post.score || 0,
          type: 'success'
        })
      }
      
      // Budget discussions
      if (text.match(/\\b(\\$\\d+|cost|price|expensive|cheap|affordable|budget)\\b/)) {
        patterns.budget_discussions.push({
          phrase: post.title,
          source: `r/${post.subreddit}`,
          engagement: post.score || 0,
          type: 'budget'
        })
      }
    })

    // Sort by engagement and limit to top examples
    Object.keys(patterns).forEach(key => {
      patterns[key] = patterns[key]
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 5)
    })

    return patterns
  }

  const userLanguagePatterns = extractUserLanguagePatterns()

  const categories = [
    { id: 'pain_phrases', label: 'Pain Point Phrases', icon: MessageSquare, color: 'red' },
    { id: 'solution_seeking', label: 'Solution Seeking', icon: Users, color: 'blue' },
    { id: 'purchase_intent', label: 'Purchase Intent', icon: DollarSign, color: 'green' },
    { id: 'frustration_triggers', label: 'Frustration Triggers', icon: Zap, color: 'orange' },
    { id: 'success_stories', label: 'Success Stories', icon: TrendingUp, color: 'purple' },
    { id: 'budget_discussions', label: 'Budget Discussions', icon: DollarSign, color: 'cyan' }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      red: 'bg-red-50 border-red-200 text-red-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      cyan: 'bg-cyan-50 border-cyan-200 text-cyan-800'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-emerald-600" />
            🗣️ Authentic User Voice & Language Analysis
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">EXCLUSIVE</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real user language patterns from Reddit discussions. This is the exact vocabulary your customers use - impossible to get from generic AI.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Category Selection */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.id
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                  <Badge variant="secondary" className="ml-1">
                    {userLanguagePatterns[category.id]?.length || 0}
                  </Badge>
                </Button>
              )
            })}
          </div>

          {/* Selected Category Content */}
          <div className="space-y-4">
            {categories.map(category => {
              if (selectedCategory !== category.id) return null
              const Icon = category.icon
              const patterns = userLanguagePatterns[category.id] || []
              
              return (
                <Card key={category.id} className={getColorClasses(category.color)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="h-5 w-5" />
                      {category.label}
                      <Badge variant="outline">{patterns.length} Examples</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {patterns.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <Icon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No specific examples found in this category.</p>
                        <p className="text-sm">This indicates either low volume or different language patterns in your target communities.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {patterns.map((pattern, index) => (
                          <Card key={index} className="bg-white/70 border border-white/50">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Quote className="h-4 w-4 opacity-60" />
                                    <span className="text-sm font-medium">{pattern.source}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {pattern.engagement} engagement
                                    </Badge>
                                  </div>
                                  <blockquote className="text-sm italic border-l-4 border-current pl-3 opacity-90">
                                    "{pattern.phrase}"
                                  </blockquote>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        {/* Strategic Insight */}
                        <Card className="bg-white border-2 border-current">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="h-2 w-2 rounded-full bg-current mt-2 flex-shrink-0"></div>
                              <div>
                                <div className="font-semibold mb-1">💡 Strategic Marketing Insight</div>
                                <div className="text-sm opacity-90">
                                  {category.id === 'pain_phrases' && "Use these exact phrases in your marketing copy. When users see their own words, they feel understood and are more likely to convert."}
                                  {category.id === 'solution_seeking' && "These are high-intent keywords. Users asking these questions are ready to try new solutions - target them with your ads."}
                                  {category.id === 'purchase_intent' && "These users are ready to buy. Focus your sales efforts on addressing the specific concerns mentioned in these discussions."}
                                  {category.id === 'frustration_triggers' && "These are emotional hot buttons. Address these frustrations directly in your messaging to create immediate connection."}
                                  {category.id === 'success_stories' && "These are the words users use to describe good solutions. Use similar language to describe your product benefits."}
                                  {category.id === 'budget_discussions' && "This reveals real price sensitivity. Use these insights to position your pricing strategy and value proposition."}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Language Analysis Summary */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-indigo-800">📊 Language Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <div className="font-semibold text-indigo-700">Total Phrases Analyzed</div>
                  <div className="text-2xl font-bold text-indigo-800">
                    {Object.values(userLanguagePatterns).reduce((sum, arr) => sum + arr.length, 0)}
                  </div>
                  <div className="text-indigo-600">From {redditPosts.length} posts</div>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <div className="font-semibold text-indigo-700">High-Intent Signals</div>
                  <div className="text-2xl font-bold text-indigo-800">
                    {userLanguagePatterns.purchase_intent.length + userLanguagePatterns.solution_seeking.length}
                  </div>
                  <div className="text-indigo-600">Ready-to-buy users</div>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <div className="font-semibold text-indigo-700">Pain Intensity</div>
                  <div className="text-2xl font-bold text-indigo-800">
                    {userLanguagePatterns.frustration_triggers.length + userLanguagePatterns.pain_phrases.length}
                  </div>
                  <div className="text-indigo-600">Frustrated users</div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-indigo-100 rounded-lg">
                <div className="font-semibold text-indigo-800 mb-2">🎯 Marketing Goldmine</div>
                <div className="text-indigo-700 text-sm">
                  This language analysis gives you the exact words your customers use to describe their problems and desires. 
                  Use these phrases in your ads, landing pages, and product descriptions for maximum emotional connection and conversion.
                </div>
              </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  )
}