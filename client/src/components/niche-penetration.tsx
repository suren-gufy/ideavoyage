import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, Zap, Users, TrendingUp, Rocket, MapPin, Calendar, Star } from "lucide-react"

interface NichePenetrationProps {
  subreddits: any[]
  redditPosts: any[]
  dataSource: string
  targetAudience: string
}

export function NichePenetration({ subreddits, redditPosts, dataSource, targetAudience }: NichePenetrationProps) {
  const [selectedStrategy, setSelectedStrategy] = useState("community_entry")

  // Only show for premium data sources
  if (dataSource !== 'reddit_plus_ai') {
    return null
  }

  // Analyze community penetration opportunities
  const analyzePenetrationOpportunities = () => {
    const strategies = {
      community_entry: [],
      influence_targets: [],
      content_gaps: [],
      timing_opportunities: [],
      partnership_potential: [],
      viral_triggers: []
    }

    subreddits.forEach(subreddit => {
      const communityData = {
        name: subreddit.display_name,
        members: subreddit.subscribers || 0,
        activity: subreddit.active_user_count || 0,
        description: subreddit.public_description || '',
        created: subreddit.created_utc,
        type: subreddit.subreddit_type
      }

      // Community entry strategy
      const entryBarrier = communityData.members > 1000000 ? 'high' :
                          communityData.members > 100000 ? 'medium' : 'low'
      const activityRatio = communityData.activity / communityData.members
      
      strategies.community_entry.push({
        community: subreddit.display_name,
        barrier_level: entryBarrier,
        activity_ratio: Math.round(activityRatio * 10000) / 100, // percentage
        members: communityData.members,
        strategy: entryBarrier === 'low' ? 'Direct Engagement' :
                 entryBarrier === 'medium' ? 'Value-First Approach' : 'Authority Building',
        recommendation: entryBarrier === 'low' ? 'Start here for quick wins' :
                       entryBarrier === 'medium' ? 'Build reputation gradually' : 'Long-term relationship building'
      })

      // Identify potential influencers and active contributors
      const communityPosts = redditPosts.filter(post => post.subreddit === subreddit.display_name)
      const topContributors = communityPosts
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 3)

      if (topContributors.length > 0) {
        strategies.influence_targets.push({
          community: subreddit.display_name,
          top_posts: topContributors.map(post => ({
            title: post.title,
            author: post.author,
            score: post.score,
            engagement: post.num_comments
          })),
          approach: 'Engage with high-performing content creators'
        })
      }

      // Content gap analysis
      const commonTopics = communityPosts.map(post => post.title.toLowerCase())
      const missingTopics = [
        'beginner guide', 'comparison', 'review', 'tutorial', 'case study', 
        'tools', 'resources', 'mistakes', 'tips', 'best practices'
      ].filter(topic => {
        return !commonTopics.some(title => title.includes(topic))
      })

      if (missingTopics.length > 0) {
        strategies.content_gaps.push({
          community: subreddit.display_name,
          missing_content: missingTopics,
          opportunity: missingTopics.length > 5 ? 'high' : missingTopics.length > 2 ? 'medium' : 'low',
          suggested_content: missingTopics.slice(0, 3)
        })
      }
    })

    // Analyze timing patterns from posts
    const postTimes = redditPosts.map(post => new Date(post.created_utc * 1000))
    const dayOfWeek = postTimes.reduce((acc, date) => {
      const day = date.getDay()
      acc[day] = (acc[day] || 0) + 1
      return acc
    }, {})

    const bestDays = Object.entries(dayOfWeek)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([day, count]) => ({
        day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day],
        post_count: count
      }))

    strategies.timing_opportunities.push({
      best_days: bestDays,
      peak_activity: 'Based on historical posting patterns',
      recommendation: `Focus content distribution on ${bestDays[0]?.day || 'weekdays'}`
    })

    // Identify partnership opportunities
    const partnerships = subreddits
      .filter(sub => sub.subscribers < 500000 && sub.subscribers > 10000)
      .map(sub => ({
        community: sub.display_name,
        size: sub.subscribers,
        opportunity: 'Moderate-size community ideal for partnerships',
        approach: 'Reach out to moderators for collaboration'
      }))

    strategies.partnership_potential = partnerships.slice(0, 5)

    // Viral trigger analysis
    const highEngagementPosts = redditPosts
      .filter(post => (post.score || 0) > 100)
      .map(post => ({
        title: post.title,
        score: post.score,
        comments: post.num_comments,
        community: post.subreddit,
        viral_elements: [
          post.title.includes('?') ? 'Question format' : null,
          post.title.toLowerCase().includes('help') ? 'Help seeking' : null,
          post.title.toLowerCase().includes('share') ? 'Sharing invitation' : null,
          post.title.toLowerCase().includes('experience') ? 'Experience sharing' : null,
        ].filter(Boolean)
      }))

    strategies.viral_triggers = highEngagementPosts.slice(0, 6)

    return strategies
  }

  const penetrationData = analyzePenetrationOpportunities()

  // Calculate penetration metrics
  const calculatePenetrationMetrics = () => {
    const totalMembers = subreddits.reduce((sum, sub) => sum + (sub.subscribers || 0), 0)
    const avgCommunitySize = totalMembers / subreddits.length
    const lowBarrierCommunities = penetrationData.community_entry.filter(c => c.barrier_level === 'low').length
    const contentOpportunities = penetrationData.content_gaps.reduce((sum, gap) => sum + gap.missing_content.length, 0)
    
    return {
      total_reach: totalMembers,
      avg_community_size: Math.round(avgCommunitySize),
      easy_entry_communities: lowBarrierCommunities,
      content_opportunities: contentOpportunities,
      penetration_score: Math.min(100, (lowBarrierCommunities * 15) + (contentOpportunities * 5) + 
        (subreddits.length > 5 ? 25 : subreddits.length * 5))
    }
  }

  const metrics = calculatePenetrationMetrics()

  const strategies = [
    { 
      id: 'community_entry', 
      label: 'Community Entry', 
      icon: MapPin, 
      color: 'blue',
      description: 'Strategic approach to entering each community'
    },
    { 
      id: 'influence_targets', 
      label: 'Influence Targets', 
      icon: Star, 
      color: 'yellow',
      description: 'Key community members to engage with'
    },
    { 
      id: 'content_gaps', 
      label: 'Content Gaps', 
      icon: Target, 
      color: 'green',
      description: 'Missing content opportunities to fill'
    },
    { 
      id: 'timing_opportunities', 
      label: 'Timing Strategy', 
      icon: Calendar, 
      color: 'purple',
      description: 'Optimal timing for maximum engagement'
    },
    { 
      id: 'partnership_potential', 
      label: 'Partnership Ops', 
      icon: Users, 
      color: 'indigo',
      description: 'Communities ideal for collaborations'
    },
    { 
      id: 'viral_triggers', 
      label: 'Viral Triggers', 
      icon: Zap, 
      color: 'red',
      description: 'Content patterns that drive high engagement'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      red: 'bg-red-50 border-red-200 text-red-800'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-green-600" />
            🎯 Niche Penetration Strategy
            <Badge variant="secondary" className="bg-green-100 text-green-800">TACTICAL</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tactical market entry strategies based on real community analysis. Your roadmap to dominating these niches.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Penetration Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200 text-center p-4">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-800">{(metrics.total_reach / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-blue-600">Total Reach</div>
            </Card>
            <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200 text-center p-4">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-800">{metrics.easy_entry_communities}</div>
              <div className="text-sm text-green-600">Easy Entry</div>
            </Card>
            <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200 text-center p-4">
              <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-800">{metrics.content_opportunities}</div>
              <div className="text-sm text-purple-600">Content Gaps</div>
            </Card>
            <Card className="bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200 text-center p-4">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-800">{metrics.penetration_score}</div>
              <div className="text-sm text-orange-600">Penetration Score</div>
            </Card>
          </div>

          {/* Strategy Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {strategies.map(strategy => {
              const Icon = strategy.icon
              const isSelected = selectedStrategy === strategy.id
              const dataCount = Array.isArray(penetrationData[strategy.id]) ? penetrationData[strategy.id].length : 
                              penetrationData[strategy.id] ? 1 : 0
              
              return (
                <Button
                  key={strategy.id}
                  variant={isSelected ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setSelectedStrategy(strategy.id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm text-center">{strategy.label}</span>
                  <Badge variant="secondary" className="text-xs">{dataCount}</Badge>
                </Button>
              )
            })}
          </div>

          {/* Selected Strategy Content */}
          <div className="space-y-4">
            {strategies.map(strategy => {
              if (selectedStrategy !== strategy.id) return null
              const Icon = strategy.icon
              const data = penetrationData[strategy.id] || []
              
              return (
                <Card key={strategy.id} className={getColorClasses(strategy.color)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {strategy.label}
                      <Badge variant="outline">
                        {Array.isArray(data) ? `${data.length} Strategies` : '1 Strategy'}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm opacity-90">{strategy.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Community Entry Strategy */}
                    {strategy.id === 'community_entry' && (
                      <div className="space-y-3">
                        {data.map((community, index) => (
                          <Card key={index} className="bg-white/80 border border-white/60">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="font-mono">r/{community.community}</Badge>
                                    <Badge variant={
                                      community.barrier_level === 'low' ? 'default' :
                                      community.barrier_level === 'medium' ? 'secondary' : 'destructive'
                                    }>
                                      {community.barrier_level} barrier
                                    </Badge>
                                    <span className="text-xs opacity-60">{community.members.toLocaleString()} members</span>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="text-sm">
                                      <strong>Strategy:</strong> {community.strategy}
                                    </div>
                                    <div className="text-sm italic">
                                      💡 {community.recommendation}
                                    </div>
                                    <div className="text-xs opacity-75">
                                      Activity Rate: {community.activity_ratio}% of members active
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {/* Influence Targets */}
                    {strategy.id === 'influence_targets' && (
                      <div className="space-y-3">
                        {data.map((target, index) => (
                          <Card key={index} className="bg-white/80 border border-white/60">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="font-mono">r/{target.community}</Badge>
                                  <span className="text-sm font-medium">{target.approach}</span>
                                </div>
                                <div className="space-y-2">
                                  <h5 className="text-sm font-semibold">Top Content Creators:</h5>
                                  {target.top_posts.map((post, postIndex) => (
                                    <div key={postIndex} className="flex items-start justify-between gap-3 p-2 bg-white/50 rounded">
                                      <div className="flex-1">
                                        <div className="text-sm font-medium">{post.author}</div>
                                        <div className="text-xs opacity-75 italic">"{post.title.slice(0, 60)}..."</div>
                                      </div>
                                      <div className="text-xs opacity-60 text-right">
                                        <div>↑{post.score}</div>
                                        <div>💬{post.engagement}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {/* Content Gaps */}
                    {strategy.id === 'content_gaps' && (
                      <div className="space-y-3">
                        {data.map((gap, index) => (
                          <Card key={index} className="bg-white/80 border border-white/60">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="font-mono">r/{gap.community}</Badge>
                                  <Badge variant={
                                    gap.opportunity === 'high' ? 'default' :
                                    gap.opportunity === 'medium' ? 'secondary' : 'outline'
                                  }>
                                    {gap.opportunity} opportunity
                                  </Badge>
                                </div>
                                <div>
                                  <h5 className="text-sm font-semibold mb-2">Missing Content Types:</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {gap.missing_content.map((content, contentIndex) => (
                                      <Badge key={contentIndex} variant="secondary" className="text-xs">
                                        {content}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="text-sm">
                                  <strong>Priority Content:</strong> Focus on creating {gap.suggested_content.join(', ')} first
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {/* Timing Opportunities */}
                    {strategy.id === 'timing_opportunities' && (
                      <div className="space-y-3">
                        {data.map((timing, index) => (
                          <Card key={index} className="bg-white/80 border border-white/60">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div>
                                  <h5 className="text-sm font-semibold mb-2">📅 Optimal Posting Days:</h5>
                                  <div className="space-y-2">
                                    {timing.best_days.map((day, dayIndex) => (
                                      <div key={dayIndex} className="flex items-center justify-between p-2 bg-white/50 rounded">
                                        <span className="font-medium">{day.day}</span>
                                        <div className="flex items-center gap-2">
                                          <Progress value={(day.post_count / Math.max(...timing.best_days.map(d => d.post_count))) * 100} className="w-20" />
                                          <span className="text-xs">{day.post_count} posts</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="text-sm italic">
                                  💡 {timing.recommendation}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {/* Partnership Potential */}
                    {strategy.id === 'partnership_potential' && (
                      <div className="space-y-3">
                        {data.length === 0 ? (
                          <div className="text-center py-8">
                            <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                            <h4 className="font-medium mb-2">No Partnership Opportunities</h4>
                            <p className="text-sm opacity-75">
                              All communities are either too large or too small for immediate partnerships.
                              Consider building relationships in larger communities first.
                            </p>
                          </div>
                        ) : (
                          data.map((partner, index) => (
                            <Card key={index} className="bg-white/80 border border-white/60">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline" className="font-mono">r/{partner.community}</Badge>
                                      <span className="text-xs opacity-60">{partner.size.toLocaleString()} members</span>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-sm">{partner.opportunity}</div>
                                      <div className="text-sm italic">💡 {partner.approach}</div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    )}
                    
                    {/* Viral Triggers */}
                    {strategy.id === 'viral_triggers' && (
                      <div className="space-y-3">
                        {data.length === 0 ? (
                          <div className="text-center py-8">
                            <Zap className="h-16 w-16 mx-auto mb-4 opacity-30" />
                            <h4 className="font-medium mb-2">No Viral Patterns Identified</h4>
                            <p className="text-sm opacity-75">
                              This suggests either low engagement in these communities or 
                              different content success patterns. Consider analyzing broader timeframes.
                            </p>
                          </div>
                        ) : (
                          data.map((trigger, index) => (
                            <Card key={index} className="bg-white/80 border border-white/60">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="font-mono">r/{trigger.community}</Badge>
                                        <Badge variant="default">🔥 {trigger.score} points</Badge>
                                        <span className="text-xs opacity-60">💬 {trigger.comments} comments</span>
                                      </div>
                                      <blockquote className="text-sm italic border-l-4 border-current pl-3">
                                        "{trigger.title}"
                                      </blockquote>
                                    </div>
                                  </div>
                                  <div>
                                    <h6 className="text-xs font-semibold mb-1">Viral Elements:</h6>
                                    <div className="flex flex-wrap gap-1">
                                      {trigger.viral_elements.map((element, elemIndex) => (
                                        <Badge key={elemIndex} variant="secondary" className="text-xs">
                                          {element}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    )}

                    {/* Strategic Action Plan */}
                    <Card className="bg-white/90 border-2 border-current">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Rocket className="h-5 w-5 mt-1 flex-shrink-0 text-orange-600" />
                          <div>
                            <h4 className="font-semibold mb-2">🚀 Action Plan</h4>
                            <div className="text-sm space-y-2">
                              {strategy.id === 'community_entry' && (
                                <div>
                                  <strong>Week 1-2:</strong> Start with low-barrier communities. Focus on providing value before promoting.
                                  <br /><strong>Week 3-4:</strong> Engage with medium-barrier communities through helpful comments and discussions.
                                  <br /><strong>Month 2+:</strong> Build authority in high-barrier communities through consistent value delivery.
                                </div>
                              )}
                              {strategy.id === 'influence_targets' && (
                                <div>
                                  <strong>Immediate:</strong> Follow and engage with identified top contributors.
                                  <br /><strong>This Week:</strong> Comment thoughtfully on their popular posts.
                                  <br /><strong>This Month:</strong> Build relationships through consistent, valuable interactions.
                                </div>
                              )}
                              {strategy.id === 'content_gaps' && (
                                <div>
                                  <strong>This Week:</strong> Create content for 2-3 identified gaps.
                                  <br /><strong>This Month:</strong> Establish yourself as the go-to source for missing content types.
                                  <br /><strong>Ongoing:</strong> Monitor for new content gaps as communities evolve.
                                </div>
                              )}
                              {strategy.id === 'timing_opportunities' && (
                                <div>
                                  <strong>Implementation:</strong> Schedule your best content for the identified peak days.
                                  <br /><strong>Testing:</strong> A/B test posting times within those days for optimal engagement.
                                  <br /><strong>Optimization:</strong> Track performance and refine timing strategy monthly.
                                </div>
                              )}
                              {strategy.id === 'partnership_potential' && (
                                <div>
                                  <strong>Outreach:</strong> Contact moderators of identified communities for collaboration opportunities.
                                  <br /><strong>Proposals:</strong> Offer value-first partnerships like AMAs or educational content.
                                  <br /><strong>Follow-up:</strong> Build long-term relationships for ongoing partnership opportunities.
                                </div>
                              )}
                              {strategy.id === 'viral_triggers' && (
                                <div>
                                  <strong>Content Creation:</strong> Incorporate identified viral elements into your content strategy.
                                  <br /><strong>Format Testing:</strong> Test question formats, help-seeking, and experience sharing approaches.
                                  <br /><strong>Engagement:</strong> Monitor which viral triggers work best for your specific niche.
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

        </CardContent>
      </Card>
    </div>
  )
}