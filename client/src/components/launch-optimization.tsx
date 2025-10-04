import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Rocket, Calendar, Target, Users, Zap, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"

interface LaunchOptimizationProps {
  subreddits: any[]
  redditPosts: any[]
  painPoints: any[]
  dataSource: string
  targetAudience: string
}

export function LaunchOptimization({ subreddits, redditPosts, painPoints, dataSource, targetAudience }: LaunchOptimizationProps) {
  const [selectedPhase, setSelectedPhase] = useState("pre_launch")

  // Only show for premium data sources
  if (dataSource !== 'reddit_plus_ai') {
    return null
  }

  // Generate comprehensive launch strategy
  const generateLaunchStrategy = () => {
    const strategy = {
      pre_launch: [],
      soft_launch: [],
      full_launch: [],
      post_launch: [],
      success_metrics: [],
      risk_mitigation: []
    }

    // Pre-launch phase (Weeks -8 to -1)
    strategy.pre_launch = [
      {
        phase: "Community Building",
        timeline: "8 weeks before",
        actions: [
          "Join and become active in all identified communities",
          "Build relationships with key influencers and moderators",
          "Share valuable content without promoting your product"
        ],
        success_criteria: "Recognized as helpful community member",
        communities: subreddits.slice(0, 3).map(s => s.display_name)
      },
      {
        phase: "Content Foundation",
        timeline: "6 weeks before", 
        actions: [
          "Create comprehensive guides addressing top pain points",
          "Publish case studies and educational content",
          "Build SEO foundation with targeted keywords"
        ],
        success_criteria: "Establish thought leadership",
        pain_points_addressed: painPoints.slice(0, 3).map(p => p.pain_point)
      },
      {
        phase: "Beta Testing Setup",
        timeline: "4 weeks before",
        actions: [
          "Recruit beta testers from engaged community members",
          "Set up feedback collection systems",
          "Prepare launch materials and messaging"
        ],
        success_criteria: "50+ engaged beta testers",
        target_communities: subreddits.filter(s => s.subscribers < 100000).map(s => s.display_name)
      },
      {
        phase: "Launch Infrastructure", 
        timeline: "2 weeks before",
        actions: [
          "Finalize product based on beta feedback",
          "Prepare customer support systems",
          "Create launch day content calendar"
        ],
        success_criteria: "All systems ready for scale",
        preparation_complete: true
      }
    ]

    // Soft launch phase (Week 0-2)
    const softLaunchCommunities = subreddits
      .filter(s => s.subscribers < 50000)
      .slice(0, 3)

    strategy.soft_launch = [
      {
        phase: "Targeted Community Launch",
        timeline: "Week 1",
        actions: [
          "Launch in smaller, engaged communities first",
          "Gather initial user feedback and testimonials", 
          "Monitor for any technical issues or concerns"
        ],
        target_communities: softLaunchCommunities.map(s => s.display_name),
        expected_users: "100-500 initial users",
        success_criteria: "Positive community reception"
      },
      {
        phase: "Feedback Integration",
        timeline: "Week 2", 
        actions: [
          "Address any critical feedback from soft launch",
          "Create case studies from early success stories",
          "Refine messaging based on real user language"
        ],
        success_criteria: "Product-market fit validation",
        refinements_expected: true
      }
    ]

    // Full launch phase (Week 3-6)
    const fullLaunchCommunities = subreddits
      .filter(s => s.subscribers >= 50000)
      .slice(0, 5)

    strategy.full_launch = [
      {
        phase: "Major Community Launch",
        timeline: "Week 3-4",
        actions: [
          "Launch in all major target communities",
          "Coordinate with community moderators where possible",
          "Deploy full marketing and PR campaign"
        ],
        target_communities: fullLaunchCommunities.map(s => s.display_name),
        expected_reach: fullLaunchCommunities.reduce((sum, s) => sum + s.subscribers, 0),
        success_criteria: "Viral growth initiation"
      },
      {
        phase: "Momentum Building",
        timeline: "Week 5-6",
        actions: [
          "Leverage early success stories for broader reach",
          "Engage with media and industry influencers", 
          "Scale customer acquisition based on proven channels"
        ],
        success_criteria: "Sustainable growth trajectory",
        scaling_focus: true
      }
    ]

    // Post-launch optimization (Week 7+)
    strategy.post_launch = [
      {
        phase: "Community Relationship Maintenance",
        timeline: "Ongoing",
        actions: [
          "Continue providing value to communities",
          "Address any community concerns promptly",
          "Build long-term relationships with key supporters"
        ],
        success_criteria: "Strong community reputation",
        long_term_focus: true
      },
      {
        phase: "Growth Optimization",
        timeline: "Month 2+",
        actions: [
          "Analyze which communities drove highest quality users",
          "Double down on most effective channels",
          "Expand to adjacent communities and platforms"
        ],
        success_criteria: "Optimized growth engine",
        expansion_ready: true
      }
    ]

    // Success metrics
    strategy.success_metrics = [
      {
        metric: "Community Engagement",
        target: "Average 15+ upvotes per post",
        measurement: "Reddit post performance",
        importance: "high"
      },
      {
        metric: "User Acquisition",
        target: "1000+ users in first month",
        measurement: "Sign-ups from Reddit traffic",
        importance: "high" 
      },
      {
        metric: "Community Sentiment",
        target: "80%+ positive mentions",
        measurement: "Comment sentiment analysis",
        importance: "medium"
      },
      {
        metric: "Viral Coefficient",
        target: "1.5+ (each user brings 1.5 others)",
        measurement: "Referral tracking",
        importance: "high"
      },
      {
        metric: "Revenue Impact",
        target: "20% of revenue from Reddit channels",
        measurement: "Attribution tracking",
        importance: "high"
      }
    ]

    // Risk mitigation
    strategy.risk_mitigation = [
      {
        risk: "Community Backlash",
        probability: "medium",
        impact: "high",
        mitigation: [
          "Build genuine relationships before promoting",
          "Always lead with value, not sales",
          "Have community managers ready to respond"
        ]
      },
      {
        risk: "Moderator Rejection",
        probability: "low",
        impact: "medium", 
        mitigation: [
          "Get pre-approval from moderators where possible",
          "Follow all community rules strictly",
          "Have alternative communities ready"
        ]
      },
      {
        risk: "Product Not Ready",
        probability: "low",
        impact: "high",
        mitigation: [
          "Extensive beta testing phase",
          "Have rollback plan ready",
          "Prepare honest communication about issues"
        ]
      },
      {
        risk: "Poor Timing",
        probability: "medium",
        impact: "medium",
        mitigation: [
          "Monitor community sentiment before launch",
          "Have flexible launch timeline",
          "Prepare for seasonal variations"
        ]
      }
    ]

    return strategy
  }

  const launchStrategy = generateLaunchStrategy()

  // Calculate launch readiness score
  const calculateLaunchReadiness = () => {
    const communityCount = subreddits.length
    const painPointCount = painPoints.length
    const contentOpportunity = redditPosts.length
    
    const readinessScore = Math.min(100, 
      (communityCount > 5 ? 25 : communityCount * 5) +
      (painPointCount > 10 ? 25 : painPointCount * 2.5) +
      (contentOpportunity > 50 ? 25 : contentOpportunity * 0.5) +
      25 // Base readiness
    )
    
    return {
      score: Math.round(readinessScore),
      community_foundation: communityCount,
      pain_point_clarity: painPointCount,
      content_opportunity: contentOpportunity,
      readiness_level: readinessScore > 80 ? 'Ready' : readinessScore > 60 ? 'Almost Ready' : 'Needs Work'
    }
  }

  const readiness = calculateLaunchReadiness()

  const phases = [
    { 
      id: 'pre_launch', 
      label: 'Pre-Launch', 
      icon: Calendar, 
      color: 'blue',
      description: '8 weeks of strategic preparation'
    },
    { 
      id: 'soft_launch', 
      label: 'Soft Launch', 
      icon: Target, 
      color: 'green',
      description: 'Testing with smaller communities'
    },
    { 
      id: 'full_launch', 
      label: 'Full Launch', 
      icon: Rocket, 
      color: 'purple',
      description: 'Major community deployment'
    },
    { 
      id: 'post_launch', 
      label: 'Post-Launch', 
      icon: TrendingUp, 
      color: 'orange',
      description: 'Optimization and scaling'
    },
    { 
      id: 'success_metrics', 
      label: 'Success Metrics', 
      icon: CheckCircle, 
      color: 'indigo',
      description: 'KPIs to track launch success'
    },
    { 
      id: 'risk_mitigation', 
      label: 'Risk Management', 
      icon: AlertCircle, 
      color: 'red',
      description: 'Potential risks and mitigation strategies'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      red: 'bg-red-50 border-red-200 text-red-800'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-orange-600" />
            🚀 Launch Optimization Strategy
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">COMPREHENSIVE</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete launch playbook based on your specific communities and pain points. Your roadmap from pre-launch to scale.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Launch Readiness Dashboard */}
          <Card className={`bg-gradient-to-r border-2 ${
            readiness.readiness_level === 'Ready' ? 'from-green-100 to-emerald-100 border-green-300' :
            readiness.readiness_level === 'Almost Ready' ? 'from-yellow-100 to-orange-100 border-yellow-300' :
            'from-red-100 to-pink-100 border-red-300'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Launch Readiness Score</h3>
                  <p className="text-sm opacity-90">Based on community analysis and strategy preparation</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{readiness.score}/100</div>
                  <div className="text-sm font-medium">
                    {readiness.readiness_level === 'Ready' && '🟢 READY TO LAUNCH'}
                    {readiness.readiness_level === 'Almost Ready' && '🟡 ALMOST READY'}
                    {readiness.readiness_level === 'Needs Work' && '🔴 NEEDS MORE PREP'}
                  </div>
                </div>
              </div>
              <Progress value={readiness.score} className="mb-4" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold">{readiness.community_foundation}</div>
                  <div className="opacity-75">Communities</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{readiness.pain_point_clarity}</div>
                  <div className="opacity-75">Pain Points</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{readiness.content_opportunity}</div>
                  <div className="opacity-75">Content Ops</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phase Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {phases.map(phase => {
              const Icon = phase.icon
              const isSelected = selectedPhase === phase.id
              const dataCount = Array.isArray(launchStrategy[phase.id]) ? launchStrategy[phase.id].length : 
                              launchStrategy[phase.id] ? 1 : 0
              
              return (
                <Button
                  key={phase.id}
                  variant={isSelected ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setSelectedPhase(phase.id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm text-center">{phase.label}</span>
                  <Badge variant="secondary" className="text-xs">{dataCount}</Badge>
                </Button>
              )
            })}
          </div>

          {/* Selected Phase Content */}
          <div className="space-y-4">
            {phases.map(phase => {
              if (selectedPhase !== phase.id) return null
              const Icon = phase.icon
              const data = launchStrategy[phase.id] || []
              
              return (
                <Card key={phase.id} className={getColorClasses(phase.color)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {phase.label}
                      <Badge variant="outline">
                        {Array.isArray(data) ? `${data.length} ${phase.id === 'success_metrics' ? 'Metrics' : phase.id === 'risk_mitigation' ? 'Risks' : 'Stages'}` : '1 Stage'}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm opacity-90">{phase.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Launch Phases Content */}
                    {(['pre_launch', 'soft_launch', 'full_launch', 'post_launch'].includes(phase.id)) && (
                      <div className="space-y-4">
                        {data.map((stage, index) => (
                          <Card key={index} className="bg-white/80 border border-white/60">
                            <CardContent className="p-5">
                              <div className="space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline" className="font-semibold">{stage.phase}</Badge>
                                      <Badge variant="secondary" className="text-xs">{stage.timeline}</Badge>
                                    </div>
                                    <div className="text-sm font-medium mb-3">{stage.success_criteria}</div>
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <div>
                                    <h5 className="text-sm font-semibold mb-2">📋 Action Items:</h5>
                                    <ul className="space-y-1">
                                      {stage.actions.map((action, actionIndex) => (
                                        <li key={actionIndex} className="text-sm flex items-start gap-2">
                                          <span className="text-green-600 mt-1">✓</span>
                                          <span>{action}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  {stage.communities && (
                                    <div>
                                      <h5 className="text-sm font-semibold mb-2">🎯 Target Communities:</h5>
                                      <div className="flex flex-wrap gap-2">
                                        {stage.communities.map((community, commIndex) => (
                                          <Badge key={commIndex} variant="secondary" className="text-xs font-mono">
                                            r/{community}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {stage.target_communities && (
                                    <div>
                                      <h5 className="text-sm font-semibold mb-2">🎯 Target Communities:</h5>
                                      <div className="flex flex-wrap gap-2">
                                        {stage.target_communities.map((community, commIndex) => (
                                          <Badge key={commIndex} variant="secondary" className="text-xs font-mono">
                                            r/{community}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {stage.pain_points_addressed && (
                                    <div>
                                      <h5 className="text-sm font-semibold mb-2">🎯 Pain Points Addressed:</h5>
                                      <div className="space-y-1">
                                        {stage.pain_points_addressed.map((pain, painIndex) => (
                                          <div key={painIndex} className="text-xs italic p-2 bg-white/50 rounded">
                                            "{pain}"
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {stage.expected_users && (
                                    <div className="flex items-center gap-4 text-sm">
                                      <div><strong>Expected Users:</strong> {stage.expected_users}</div>
                                    </div>
                                  )}
                                  
                                  {stage.expected_reach && (
                                    <div className="flex items-center gap-4 text-sm">
                                      <div><strong>Potential Reach:</strong> {stage.expected_reach.toLocaleString()} people</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {/* Success Metrics */}
                    {phase.id === 'success_metrics' && (
                      <div className="space-y-3">
                        {data.map((metric, index) => (
                          <Card key={index} className="bg-white/80 border border-white/60">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h5 className="font-semibold">{metric.metric}</h5>
                                    <Badge variant={
                                      metric.importance === 'high' ? 'default' :
                                      metric.importance === 'medium' ? 'secondary' : 'outline'
                                    }>
                                      {metric.importance} priority
                                    </Badge>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="text-sm">
                                      <strong>Target:</strong> {metric.target}
                                    </div>
                                    <div className="text-sm opacity-75">
                                      <strong>How to Measure:</strong> {metric.measurement}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {/* Risk Mitigation */}
                    {phase.id === 'risk_mitigation' && (
                      <div className="space-y-3">
                        {data.map((risk, index) => (
                          <Card key={index} className="bg-white/80 border border-white/60">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h5 className="font-semibold">{risk.risk}</h5>
                                      <Badge variant={
                                        risk.probability === 'high' ? 'destructive' :
                                        risk.probability === 'medium' ? 'default' : 'secondary'
                                      }>
                                        {risk.probability} probability
                                      </Badge>
                                      <Badge variant={
                                        risk.impact === 'high' ? 'destructive' :
                                        risk.impact === 'medium' ? 'default' : 'secondary'
                                      }>
                                        {risk.impact} impact
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h6 className="text-sm font-semibold mb-2">🛡️ Mitigation Strategies:</h6>
                                  <ul className="space-y-1">
                                    {risk.mitigation.map((strategy, stratIndex) => (
                                      <li key={stratIndex} className="text-sm flex items-start gap-2">
                                        <span className="text-blue-600 mt-1">•</span>
                                        <span>{strategy}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Phase Summary & Next Steps */}
                    <Card className="bg-white/90 border-2 border-current">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Zap className="h-5 w-5 mt-1 flex-shrink-0 text-yellow-600" />
                          <div>
                            <h4 className="font-semibold mb-2">⚡ Key Takeaways</h4>
                            <div className="text-sm space-y-2">
                              {phase.id === 'pre_launch' && (
                                <div>
                                  <strong>Critical Success Factor:</strong> Building genuine community relationships before any promotion.
                                  Your 8-week prep phase is crucial for long-term success. Don't rush this foundation.
                                </div>
                              )}
                              {phase.id === 'soft_launch' && (
                                <div>
                                  <strong>Testing Strategy:</strong> Start small to validate your approach and messaging.
                                  Use feedback to refine before scaling to larger communities.
                                </div>
                              )}
                              {phase.id === 'full_launch' && (
                                <div>
                                  <strong>Scale Smart:</strong> Leverage your soft launch success stories and relationships.
                                  Coordinate timing across communities for maximum impact.
                                </div>
                              )}
                              {phase.id === 'post_launch' && (
                                <div>
                                  <strong>Long-term Success:</strong> Continue being a valuable community member even after launch.
                                  Your reputation in these communities is your long-term competitive advantage.
                                </div>
                              )}
                              {phase.id === 'success_metrics' && (
                                <div>
                                  <strong>Measurement Strategy:</strong> Track both quantitative metrics and qualitative community sentiment.
                                  Success on Reddit is as much about relationships as numbers.
                                </div>
                              )}
                              {phase.id === 'risk_mitigation' && (
                                <div>
                                  <strong>Risk Management:</strong> Have backup plans and alternative communities ready.
                                  Transparency and authentic value creation are your best risk mitigation strategies.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Launch Timeline Overview */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">🗓️ Complete Launch Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-300"></div>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold relative z-10">-8</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-blue-800">Pre-Launch Phase Begins</h4>
                        <p className="text-sm text-blue-700">Community building and relationship development</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold relative z-10">0</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-green-800">Soft Launch</h4>
                        <p className="text-sm text-green-700">Testing with smaller communities</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold relative z-10">3</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-purple-800">Full Launch</h4>
                        <p className="text-sm text-purple-700">Major community deployment and scaling</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold relative z-10">7+</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-orange-800">Post-Launch Optimization</h4>
                        <p className="text-sm text-orange-700">Growth optimization and community maintenance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  )
}