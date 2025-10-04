import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sword, Shield, Target, TrendingDown, AlertTriangle, Crown, Zap, DollarSign } from "lucide-react"

interface CompetitiveWarfareProps {
  competitors: any[]
  redditPosts: any[]
  dataSource: string
}

export function CompetitiveWarfare({ competitors, redditPosts, dataSource }: CompetitiveWarfareProps) {
  const [selectedInsight, setSelectedInsight] = useState("complaints")

  // Only show for premium data sources
  if (dataSource !== 'reddit_plus_ai') {
    return null
  }

  // Extract competitive intelligence from Reddit posts
  const extractCompetitiveIntelligence = () => {
    const intelligence = {
      complaints: [],
      feature_gaps: [],
      pricing_issues: [],
      migration_patterns: [],
      reputation_insights: [],
      vulnerabilities: []
    }

    redditPosts.forEach(post => {
      const text = (post.title + ' ' + (post.selftext || '')).toLowerCase()
      
      // Competitor complaints
      if (text.match(/\\b(terrible|awful|hate|worst|sucks|disappointed|frustrated with|problems with)\\b/)) {
        intelligence.complaints.push({
          complaint: post.title,
          source: `r/${post.subreddit}`,
          severity: text.match(/\\b(terrible|awful|hate|worst)\\b/) ? 'high' : 'medium',
          engagement: post.score || 0
        })
      }
      
      // Feature gaps
      if (text.match(/\\b(wish they had|missing|lacks|doesn't have|needs to add|should include)\\b/)) {
        intelligence.feature_gaps.push({
          gap: post.title,
          source: `r/${post.subreddit}`,
          opportunity: 'high',
          engagement: post.score || 0
        })
      }
      
      // Pricing dissatisfaction
      if (text.match(/\\b(too expensive|overpriced|costs too much|not worth|cheaper alternative)\\b/)) {
        intelligence.pricing_issues.push({
          issue: post.title,
          source: `r/${post.subreddit}`,
          impact: 'high',
          engagement: post.score || 0
        })
      }
      
      // User migration patterns
      if (text.match(/\\b(switched from|moved to|replaced|alternative to|better than)\\b/)) {
        intelligence.migration_patterns.push({
          pattern: post.title,
          source: `r/${post.subreddit}`,
          trend: 'migration',
          engagement: post.score || 0
        })
      }
      
      // Reputation issues
      if (text.match(/\\b(scam|fraud|avoid|warning|be careful|don't trust)\\b/)) {
        intelligence.reputation_insights.push({
          insight: post.title,
          source: `r/${post.subreddit}`,
          severity: 'critical',
          engagement: post.score || 0
        })
      }
      
      // Market vulnerabilities
      if (text.match(/\\b(monopoly|no competition|only option|market leader but)\\b/)) {
        intelligence.vulnerabilities.push({
          vulnerability: post.title,
          source: `r/${post.subreddit}`,
          opportunity: 'critical',
          engagement: post.score || 0
        })
      }
    })

    // Sort by engagement and limit
    Object.keys(intelligence).forEach(key => {
      intelligence[key] = intelligence[key]
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 8)
    })

    return intelligence
  }

  const competitiveIntel = extractCompetitiveIntelligence()

  // Calculate market opportunity scores
  const calculateOpportunityScore = () => {
    const totalComplaints = competitiveIntel.complaints.length
    const totalGaps = competitiveIntel.feature_gaps.length  
    const totalPricingIssues = competitiveIntel.pricing_issues.length
    
    const opportunityScore = Math.min(100, (totalComplaints * 8 + totalGaps * 12 + totalPricingIssues * 10))
    return opportunityScore
  }

  const opportunityScore = calculateOpportunityScore()

  const insights = [
    { 
      id: 'complaints', 
      label: 'User Complaints', 
      icon: AlertTriangle, 
      color: 'red',
      description: 'What users hate about current solutions'
    },
    { 
      id: 'feature_gaps', 
      label: 'Feature Gaps', 
      icon: Target, 
      color: 'orange',
      description: 'Missing features users desperately want'
    },
    { 
      id: 'pricing_issues', 
      label: 'Pricing Problems', 
      icon: DollarSign, 
      color: 'yellow',
      description: 'Price sensitivity and value perception issues'
    },
    { 
      id: 'migration_patterns', 
      label: 'User Migration', 
      icon: TrendingDown, 
      color: 'blue',
      description: 'How users switch between competitors'
    },
    { 
      id: 'reputation_insights', 
      label: 'Reputation Issues', 
      icon: Shield, 
      color: 'purple',
      description: 'Trust and credibility problems'
    },
    { 
      id: 'vulnerabilities', 
      label: 'Market Vulnerabilities', 
      icon: Zap, 
      color: 'green',
      description: 'Weak spots in competitor positioning'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      red: 'bg-red-50 border-red-200 text-red-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      green: 'bg-green-50 border-green-200 text-green-800'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-red-600" />
            ⚔️ Competitive Intelligence Warfare
            <Badge variant="secondary" className="bg-red-100 text-red-800">EXCLUSIVE</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real user opinions about competitors from Reddit discussions. This intelligence is worth thousands in market research.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Market Opportunity Score */}
          <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Market Opportunity Score</h3>
                  <p className="text-sm text-green-700">Based on competitor weaknesses identified</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-800">{opportunityScore}/100</div>
                  <div className="text-sm text-green-600">
                    {opportunityScore > 80 ? '🔥 RED HOT' : opportunityScore > 60 ? '🎯 HIGH' : opportunityScore > 40 ? '⚠️ MODERATE' : '📉 LOW'}
                  </div>
                </div>
              </div>
              <Progress value={opportunityScore} className="mb-3" />
              <div className="text-sm text-green-700">
                {opportunityScore > 80 && "Massive opportunity! Users are very dissatisfied with current solutions."}
                {opportunityScore > 60 && opportunityScore <= 80 && "Strong opportunity with clear differentiation potential."}
                {opportunityScore > 40 && opportunityScore <= 60 && "Moderate opportunity, focus on key pain points."}
                {opportunityScore <= 40 && "Limited opportunity, consider pivoting or finding new angles."}
              </div>
            </CardContent>
          </Card>

          {/* Intelligence Category Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {insights.map(insight => {
              const Icon = insight.icon
              const isSelected = selectedInsight === insight.id
              const count = competitiveIntel[insight.id]?.length || 0
              
              return (
                <Button
                  key={insight.id}
                  variant={isSelected ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setSelectedInsight(insight.id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{insight.label}</span>
                  <Badge variant="secondary" className="text-xs">{count}</Badge>
                </Button>
              )
            })}
          </div>

          {/* Selected Intelligence Content */}
          <div className="space-y-4">
            {insights.map(insight => {
              if (selectedInsight !== insight.id) return null
              const Icon = insight.icon
              const data = competitiveIntel[insight.id] || []
              
              return (
                <Card key={insight.id} className={getColorClasses(insight.color)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {insight.label}
                      <Badge variant="outline">{data.length} Intel Points</Badge>
                    </CardTitle>
                    <p className="text-sm opacity-90">{insight.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {data.length === 0 ? (
                      <div className="text-center py-8">
                        <Icon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <h4 className="font-medium mb-2">No Intelligence Found</h4>
                        <p className="text-sm opacity-75">
                          This could indicate either:
                        </p>
                        <ul className="text-sm opacity-75 mt-2 space-y-1">
                          <li>• Strong competitor satisfaction (challenge)</li>
                          <li>• Limited competitor awareness (opportunity)</li>
                          <li>• Different discussion patterns in your communities</li>
                        </ul>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {data.map((item, index) => (
                          <Card key={index} className="bg-white/80 border border-white/60">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">{item.source}</Badge>
                                    <Badge 
                                      variant={
                                        item.severity === 'critical' ? 'destructive' :
                                        item.severity === 'high' || item.opportunity === 'high' || item.impact === 'high' ? 'default' :
                                        'secondary'
                                      }
                                      className="text-xs"
                                    >
                                      {item.severity || item.opportunity || item.impact || 'medium'}
                                    </Badge>
                                    <span className="text-xs opacity-60">{item.engagement} engagement</span>
                                  </div>
                                  <blockquote className="text-sm italic border-l-4 border-current pl-3 opacity-90">
                                    "{item.complaint || item.gap || item.issue || item.pattern || item.insight || item.vulnerability}"
                                  </blockquote>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Strategic Implications */}
                    {data.length > 0 && (
                      <Card className="bg-white/90 border-2 border-current">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Sword className="h-5 w-5 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold mb-2">🎯 Strategic Attack Vector</h4>
                              <div className="text-sm space-y-2">
                                {insight.id === 'complaints' && (
                                  <div>
                                    <strong>Opportunity:</strong> Position your product as the solution that specifically addresses these frustrations.
                                    Use phrases like "Unlike [competitor], we..." in your marketing.
                                  </div>
                                )}
                                {insight.id === 'feature_gaps' && (
                                  <div>
                                    <strong>Product Strategy:</strong> These are your MVP features. Build exactly what competitors are missing.
                                    This is your competitive moat.
                                  </div>
                                )}
                                {insight.id === 'pricing_issues' && (
                                  <div>
                                    <strong>Pricing Strategy:</strong> There's clear price sensitivity. Consider freemium or significantly lower pricing
                                    as your market entry strategy.
                                  </div>
                                )}
                                {insight.id === 'migration_patterns' && (
                                  <div>
                                    <strong>User Acquisition:</strong> Target users of these mentioned competitors with comparison campaigns.
                                    They're already looking for alternatives.
                                  </div>
                                )}
                                {insight.id === 'reputation_insights' && (
                                  <div>
                                    <strong>Trust Building:</strong> Emphasize transparency, security, and reliability in your messaging.
                                    Users have been burned before.
                                  </div>
                                )}
                                {insight.id === 'vulnerabilities' && (
                                  <div>
                                    <strong>Market Entry:</strong> These are systematic weaknesses in the market. Attack these positions directly
                                    with focused marketing and product positioning.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Competitive Landscape Summary */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-indigo-800">📊 Competitive Warfare Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-4 bg-white/70 rounded-lg">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <div className="font-semibold text-indigo-700">Competitor Weaknesses</div>
                  <div className="text-2xl font-bold text-indigo-800">
                    {competitiveIntel.complaints.length + competitiveIntel.feature_gaps.length}
                  </div>
                  <div className="text-indigo-600">Attack vectors identified</div>
                </div>
                <div className="text-center p-4 bg-white/70 rounded-lg">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="font-semibold text-indigo-700">Pricing Opportunities</div>
                  <div className="text-2xl font-bold text-indigo-800">
                    {competitiveIntel.pricing_issues.length}
                  </div>
                  <div className="text-indigo-600">Price-sensitive segments</div>
                </div>
                <div className="text-center p-4 bg-white/70 rounded-lg">
                  <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="font-semibold text-indigo-700">Market Vulnerabilities</div>
                  <div className="text-2xl font-bold text-indigo-800">
                    {competitiveIntel.vulnerabilities.length + competitiveIntel.reputation_insights.length}
                  </div>
                  <div className="text-indigo-600">Strategic openings</div>
                </div>
              </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  )
}