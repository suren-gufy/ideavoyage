import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, Clock, Users, MessageSquare, TrendingUp, Eye, Activity, Lightbulb } from "lucide-react"

interface BehavioralIntelligenceProps {
  redditPosts: any[]
  dataSource: string
  targetAudience: string
}

export function BehavioralIntelligence({ redditPosts, dataSource, targetAudience }: BehavioralIntelligenceProps) {
  const [selectedBehavior, setSelectedBehavior] = useState("decision_patterns")

  // Only show for premium data sources
  if (dataSource !== 'reddit_plus_ai') {
    return null
  }

  // Extract behavioral intelligence from Reddit interactions
  const extractBehavioralPatterns = () => {
    const patterns = {
      decision_patterns: [],
      information_seeking: [],
      social_proof: [],
      timing_behaviors: [],
      interaction_styles: [],
      trust_signals: []
    }

    redditPosts.forEach(post => {
      const text = (post.title + ' ' + (post.selftext || '')).toLowerCase()
      const score = post.score || 0
      const comments = post.num_comments || 0
      
      // Decision-making patterns
      if (text.match(/\\b(should i|help me decide|which is better|recommend|advice|thoughts on)\\b/)) {
        patterns.decision_patterns.push({
          pattern: post.title,
          behavior_type: text.match(/\\b(should i)\\b/) ? 'validation_seeking' :
                        text.match(/\\b(help me decide|which is better)\\b/) ? 'comparison_shopping' :
                        text.match(/\\b(recommend|advice)\\b/) ? 'expert_opinion' : 'general_inquiry',
          engagement: score,
          community_response: comments,
          source: `r/${post.subreddit}`
        })
      }
      
      // Information seeking behaviors
      if (text.match(/\\b(how to|tutorial|guide|explain|eli5|beginner|new to)\\b/)) {
        patterns.information_seeking.push({
          pattern: post.title,
          learning_stage: text.match(/\\b(beginner|new to|eli5)\\b/) ? 'beginner' :
                         text.match(/\\b(how to|tutorial)\\b/) ? 'practical' :
                         text.match(/\\b(guide|explain)\\b/) ? 'comprehensive' : 'intermediate',
          engagement: score,
          community_response: comments,
          source: `r/${post.subreddit}`
        })
      }
      
      // Social proof seeking
      if (text.match(/\\b(anyone else|does everyone|is it just me|others|experiences|testimonial)\\b/)) {
        patterns.social_proof.push({
          pattern: post.title,
          proof_type: text.match(/\\b(anyone else|is it just me)\\b/) ? 'validation' :
                     text.match(/\\b(experiences|testimonial)\\b/) ? 'testimonial' :
                     'community_consensus',
          engagement: score,
          community_response: comments,
          source: `r/${post.subreddit}`
        })
      }
      
      // Timing and urgency behaviors
      if (text.match(/\\b(urgent|asap|quickly|deadline|time sensitive|need now|today)\\b/)) {
        patterns.timing_behaviors.push({
          pattern: post.title,
          urgency_level: text.match(/\\b(urgent|asap|need now)\\b/) ? 'high' :
                        text.match(/\\b(quickly|today)\\b/) ? 'medium' : 'low',
          engagement: score,
          community_response: comments,
          source: `r/${post.subreddit}`
        })
      }
      
      // Communication and interaction styles
      const question_marks = (text.match(/\\?/g) || []).length
      const exclamation_marks = (text.match(/!/g) || []).length
      const caps_words = (text.match(/\\b[A-Z]{2,}\\b/g) || []).length
      
      if (question_marks > 0 || exclamation_marks > 0 || caps_words > 0) {
        patterns.interaction_styles.push({
          pattern: post.title,
          style_indicators: {
            questions: question_marks,
            excitement: exclamation_marks,
            emphasis: caps_words
          },
          communication_style: question_marks > 2 ? 'inquisitive' :
                              exclamation_marks > 1 ? 'enthusiastic' :
                              caps_words > 0 ? 'emphatic' : 'neutral',
          engagement: score,
          community_response: comments,
          source: `r/${post.subreddit}`
        })
      }
      
      // Trust and credibility signals
      if (text.match(/\\b(verified|official|certified|reviews|ratings|trustworthy|scam|legit)\\b/)) {
        patterns.trust_signals.push({
          pattern: post.title,
          trust_concern: text.match(/\\b(scam|legit|trustworthy)\\b/) ? 'credibility_check' :
                        text.match(/\\b(reviews|ratings)\\b/) ? 'social_validation' :
                        text.match(/\\b(verified|official|certified)\\b/) ? 'authority_seeking' : 'general_trust',
          engagement: score,
          community_response: comments,
          source: `r/${post.subreddit}`
        })
      }
    })

    // Sort all patterns by engagement and limit
    Object.keys(patterns).forEach(key => {
      patterns[key] = patterns[key]
        .sort((a, b) => (b.engagement + b.community_response) - (a.engagement + a.community_response))
        .slice(0, 8)
    })

    return patterns
  }

  const behavioralData = extractBehavioralPatterns()

  // Calculate behavioral insights scores
  const calculateBehavioralMetrics = () => {
    const totalInteractions = redditPosts.length
    const avgEngagement = redditPosts.reduce((sum, post) => sum + (post.score || 0), 0) / totalInteractions
    const avgComments = redditPosts.reduce((sum, post) => sum + (post.num_comments || 0), 0) / totalInteractions
    
    const decisionSeekers = behavioralData.decision_patterns.length
    const informationSeekers = behavioralData.information_seeking.length
    const socialProofSeekers = behavioralData.social_proof.length
    
    return {
      engagement_rate: Math.round(avgEngagement * 10) / 10,
      discussion_rate: Math.round(avgComments * 10) / 10,
      decision_seeker_ratio: Math.round((decisionSeekers / totalInteractions) * 100),
      information_seeker_ratio: Math.round((informationSeekers / totalInteractions) * 100),
      social_proof_ratio: Math.round((socialProofSeekers / totalInteractions) * 100),
      community_activity: totalInteractions > 50 ? 'high' : totalInteractions > 20 ? 'medium' : 'low'
    }
  }

  const metrics = calculateBehavioralMetrics()

  const behaviors = [
    { 
      id: 'decision_patterns', 
      label: 'Decision Patterns', 
      icon: Brain, 
      color: 'purple',
      description: 'How users make purchasing and adoption decisions'
    },
    { 
      id: 'information_seeking', 
      label: 'Info Seeking', 
      icon: Eye, 
      color: 'blue',
      description: 'Learning and research behaviors before buying'
    },
    { 
      id: 'social_proof', 
      label: 'Social Proof', 
      icon: Users, 
      color: 'green',
      description: 'How users seek validation from others'
    },
    { 
      id: 'timing_behaviors', 
      label: 'Timing Patterns', 
      icon: Clock, 
      color: 'orange',
      description: 'Urgency levels and decision timing'
    },
    { 
      id: 'interaction_styles', 
      label: 'Communication Style', 
      icon: MessageSquare, 
      color: 'pink',
      description: 'How users express themselves and interact'
    },
    { 
      id: 'trust_signals', 
      label: 'Trust Behaviors', 
      icon: Activity, 
      color: 'indigo',
      description: 'What builds or breaks user trust'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      pink: 'bg-pink-50 border-pink-200 text-pink-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            🧠 Behavioral Intelligence Analysis
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">PREMIUM</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Deep insights into user behavior patterns, decision-making processes, and psychological triggers from real Reddit interactions.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Behavioral Metrics Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200 text-center p-4">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-800">{metrics.engagement_rate}</div>
              <div className="text-sm text-blue-600">Avg Engagement</div>
            </Card>
            <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200 text-center p-4">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-800">{metrics.discussion_rate}</div>
              <div className="text-sm text-green-600">Avg Discussions</div>
            </Card>
            <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200 text-center p-4">
              <Brain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-800">{metrics.decision_seeker_ratio}%</div>
              <div className="text-sm text-purple-600">Decision Seekers</div>
            </Card>
            <Card className="bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200 text-center p-4">
              <Users className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-800">{metrics.social_proof_ratio}%</div>
              <div className="text-sm text-orange-600">Social Proof Seekers</div>
            </Card>
          </div>

          {/* Behavior Category Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {behaviors.map(behavior => {
              const Icon = behavior.icon
              const isSelected = selectedBehavior === behavior.id
              const count = behavioralData[behavior.id]?.length || 0
              
              return (
                <Button
                  key={behavior.id}
                  variant={isSelected ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setSelectedBehavior(behavior.id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm text-center">{behavior.label}</span>
                  <Badge variant="secondary" className="text-xs">{count}</Badge>
                </Button>
              )
            })}
          </div>

          {/* Selected Behavior Analysis */}
          <div className="space-y-4">
            {behaviors.map(behavior => {
              if (selectedBehavior !== behavior.id) return null
              const Icon = behavior.icon
              const data = behavioralData[behavior.id] || []
              
              return (
                <Card key={behavior.id} className={getColorClasses(behavior.color)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {behavior.label}
                      <Badge variant="outline">{data.length} Patterns</Badge>
                    </CardTitle>
                    <p className="text-sm opacity-90">{behavior.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {data.length === 0 ? (
                      <div className="text-center py-8">
                        <Icon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <h4 className="font-medium mb-2">No Patterns Detected</h4>
                        <p className="text-sm opacity-75">
                          This behavior type is not prominent in your target communities, which could indicate:
                        </p>
                        <ul className="text-sm opacity-75 mt-2 space-y-1">
                          <li>• Different behavioral norms in these communities</li>
                          <li>• Your audience may use different platforms for this behavior</li>
                          <li>• Opportunity to introduce new behavioral patterns</li>
                        </ul>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {data.map((item, index) => (
                          <Card key={index} className="bg-white/80 border border-white/60">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline" className="text-xs">{item.source}</Badge>
                                      {item.behavior_type && (
                                        <Badge variant="secondary" className="text-xs">{item.behavior_type}</Badge>
                                      )}
                                      {item.learning_stage && (
                                        <Badge variant="secondary" className="text-xs">{item.learning_stage}</Badge>
                                      )}
                                      {item.proof_type && (
                                        <Badge variant="secondary" className="text-xs">{item.proof_type}</Badge>
                                      )}
                                      {item.urgency_level && (
                                        <Badge 
                                          variant={item.urgency_level === 'high' ? 'destructive' : item.urgency_level === 'medium' ? 'default' : 'secondary'}
                                          className="text-xs"
                                        >
                                          {item.urgency_level} urgency
                                        </Badge>
                                      )}
                                      {item.communication_style && (
                                        <Badge variant="secondary" className="text-xs">{item.communication_style}</Badge>
                                      )}
                                      {item.trust_concern && (
                                        <Badge variant="secondary" className="text-xs">{item.trust_concern}</Badge>
                                      )}
                                    </div>
                                    <blockquote className="text-sm italic border-l-4 border-current pl-3 opacity-90">
                                      "{item.pattern}"
                                    </blockquote>
                                  </div>
                                  <div className="text-right text-xs opacity-60 space-y-1">
                                    <div>↑{item.engagement} engagement</div>
                                    <div>💬{item.community_response} responses</div>
                                  </div>
                                </div>
                                
                                {item.style_indicators && (
                                  <div className="flex items-center gap-4 text-xs opacity-75">
                                    <span>❓ {item.style_indicators.questions} questions</span>
                                    <span>❗ {item.style_indicators.excitement} excitement</span>
                                    <span>🔥 {item.style_indicators.emphasis} emphasis</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Behavioral Insights & Marketing Implications */}
                    {data.length > 0 && (
                      <Card className="bg-white/90 border-2 border-current">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 mt-1 flex-shrink-0 text-yellow-600" />
                            <div>
                              <h4 className="font-semibold mb-2">🎯 Marketing & Product Implications</h4>
                              <div className="text-sm space-y-2">
                                {behavior.id === 'decision_patterns' && (
                                  <div>
                                    <strong>Strategy:</strong> Your audience seeks validation and comparison. Provide detailed comparisons, 
                                    user testimonials, and expert endorsements. Consider "why choose us" content and decision trees.
                                  </div>
                                )}
                                {behavior.id === 'information_seeking' && (
                                  <div>
                                    <strong>Content Strategy:</strong> Create comprehensive guides, tutorials, and educational content. 
                                    Your audience learns before buying. Invest in SEO and educational marketing.
                                  </div>
                                )}
                                {behavior.id === 'social_proof' && (
                                  <div>
                                    <strong>Social Proof:</strong> Emphasize community testimonials, case studies, and user counts. 
                                    Your audience needs to see others succeed first. Build community features.
                                  </div>
                                )}
                                {behavior.id === 'timing_behaviors' && (
                                  <div>
                                    <strong>Sales Approach:</strong> Match urgency levels in your messaging. 
                                    Offer fast solutions for urgent needs and patient education for low-urgency decisions.
                                  </div>
                                )}
                                {behavior.id === 'interaction_styles' && (
                                  <div>
                                    <strong>Communication:</strong> Mirror your audience's communication style in marketing copy. 
                                    Adjust tone, question style, and enthusiasm levels to match their patterns.
                                  </div>
                                )}
                                {behavior.id === 'trust_signals' && (
                                  <div>
                                    <strong>Trust Building:</strong> Address specific trust concerns proactively. 
                                    Display certifications, reviews, and security badges prominently. Be transparent about credibility.
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

          {/* Audience Behavioral Profile Summary */}
          <Card className="bg-gradient-to-r from-gradient-start to-gradient-end border-2 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-indigo-800">🎯 Behavioral Profile Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-indigo-700">Dominant Behaviors</h4>
                  <div className="space-y-2">
                    {Object.entries(behavioralData)
                      .sort(([,a], [,b]) => b.length - a.length)
                      .slice(0, 3)
                      .map(([key, patterns]) => {
                        const behavior = behaviors.find(b => b.id === key)
                        const Icon = behavior?.icon || Brain
                        return (
                          <div key={key} className="flex items-center gap-3 p-2 bg-white/70 rounded">
                            <Icon className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-medium">{behavior?.label}</span>
                            <Badge variant="secondary" className="text-xs">{patterns.length} occurrences</Badge>
                          </div>
                        )
                      })}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-indigo-700">Audience Characteristics</h4>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Community Activity:</span>
                      <Badge variant={metrics.community_activity === 'high' ? 'default' : 'secondary'}>
                        {metrics.community_activity}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Decision Support Needs:</span>
                      <Badge variant={metrics.decision_seeker_ratio > 30 ? 'default' : 'secondary'}>
                        {metrics.decision_seeker_ratio > 30 ? 'High' : metrics.decision_seeker_ratio > 15 ? 'Medium' : 'Low'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Information Appetite:</span>
                      <Badge variant={metrics.information_seeker_ratio > 25 ? 'default' : 'secondary'}>
                        {metrics.information_seeker_ratio > 25 ? 'High' : metrics.information_seeker_ratio > 10 ? 'Medium' : 'Low'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Social Validation Needs:</span>
                      <Badge variant={metrics.social_proof_ratio > 20 ? 'default' : 'secondary'}>
                        {metrics.social_proof_ratio > 20 ? 'High' : metrics.social_proof_ratio > 10 ? 'Medium' : 'Low'}
                      </Badge>
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