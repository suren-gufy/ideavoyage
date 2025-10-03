import { useState, useEffect } from "react"
import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { ScoringCards } from "@/components/scoring-cards"
import { MetricsOverview } from "@/components/metrics-overview"
import { SentimentChart } from "@/components/sentiment-chart"
import { PainPointsDisplay } from "@/components/pain-points-display"
import { AppIdeasGenerator } from "@/components/app-ideas-generator"
import { GoogleTrends } from "@/components/google-trends"
import { ICPDisplay } from "@/components/icp-display"
import { ProblemStatements } from "@/components/problem-statements"
import { FinancialRisks } from "@/components/financial-risks"
import { CompetitorsAnalysis } from "@/components/competitors-analysis"
import { RevenueModels } from "@/components/revenue-models"
import { MethodologyModal } from "@/components/methodology-modal"
import { RedditInsights } from "@/components/reddit-insights"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { TrendingUp, AlertTriangle, Info, CheckCircle, Crown, Sparkles } from "lucide-react"
import type { AnalysisResponse } from "@shared/schema"

export default function Results() {
  const [location, setLocation] = useLocation()
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null)

  useEffect(() => {
    console.log('📄 Results page loading...')
    
    // Get results from sessionStorage (set by dashboard after analysis)
    const savedResults = sessionStorage.getItem('analysis-results')
    console.log('📄 Raw sessionStorage data:', savedResults?.substring(0, 200) + '...')
    
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults)
        console.log('🔍 Analysis results loaded for idea:', parsedResults.idea)
        console.log('🔍 Data source:', parsedResults.data_source)
        console.log('🔍 Analysis confidence:', parsedResults.analysis_confidence)
        console.log('🔍 Subreddits (first 3):', parsedResults.subreddits?.slice(0, 3))
        console.log('🔍 Pain points raw:', parsedResults.pain_points)
        console.log('🔍 Pain points type:', typeof parsedResults.pain_points)
        console.log('🔍 Pain points array length:', Array.isArray(parsedResults.pain_points) ? parsedResults.pain_points.length : 'not array')
        if (parsedResults.pain_points && Array.isArray(parsedResults.pain_points) && parsedResults.pain_points.length > 0) {
          console.log('🔍 First pain point structure:', parsedResults.pain_points[0])
        }
        console.log('🔍 Timestamp check - Debug info:', parsedResults.debug)
        setAnalysisResults(parsedResults)
      } catch (error) {
        console.error('❌ Failed to parse analysis results:', error)
        // Redirect back to dashboard if no valid results
        setLocation('/')
      }
    } else {
      console.log('❌ No results found in sessionStorage, redirecting to dashboard')
      // Redirect to dashboard if no results found
      setLocation('/')
    }
  }, [setLocation])

  if (!analysisResults) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading your analysis results...</p>
        </div>
      </div>
    )
  }

  const handleNewAnalysis = () => {
    sessionStorage.removeItem('analysis-results')
    setLocation('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with navigation */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLocation('/')}
                data-testid="button-back-home"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
              <div className="hidden sm:block h-6 border-l border-border"></div>
              <h1 className="text-xl font-semibold" data-testid="results-page-title">
                Startup Validation Report
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" data-testid="button-share">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" data-testid="button-download">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleNewAnalysis} size="sm" data-testid="button-analyze-new">
                Analyze New Idea
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Free Report Banner */}


      {/* Results content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="analysis-results">
        {/* Data Source Indicator */}
        {/* Premium experience: Real Reddit + AI */}
        {analysisResults.data_source === 'reddit_plus_ai' && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-emerald-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-purple-600" />
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold text-purple-800">Premium Analysis - Reddit OAuth + AI</span>
            </div>
            <p className="text-sm text-purple-800">
              {analysisResults.notes || 'Ultimate market validation combining real Reddit discussions with GPT-4o-mini intelligence.'}
            </p>
            <p className="text-xs mt-2 text-purple-700">
              ⭐ <strong>Gold Standard:</strong> {analysisResults.upgrade_message || 'You\'re getting the most accurate market insights possible!'}
            </p>
          </div>
        )}

        {/* AI-Enhanced Analysis */}
        {(() => {
          const debugMode = (analysisResults as any).debug?.mode as string | undefined;
          const isAIEnhanced = (
            analysisResults.data_source === 'ai_synthetic' ||
            analysisResults.analysis_confidence === 'ai_enhanced' ||
            analysisResults.analysis_confidence === 'premium_enhanced' ||
            (debugMode ? debugMode.startsWith('ai_enhanced') : false)
          );
          // Don't show if already showing premium banner
          if (analysisResults.data_source === 'reddit_plus_ai' || !isAIEnhanced) return null;
          return (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-800">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold">AI-Enhanced Analysis</span>
            </div>
            <p className="text-sm">
              {analysisResults.notes || 'Using GPT-4o-mini for sophisticated market validation with realistic business insights.'}
            </p>
            <p className="text-xs mt-2 text-emerald-700">
              🚀 <strong>Powered by AI:</strong> {analysisResults.upgrade_message || 'Add Reddit OAuth for the ultimate analysis experience!'}
            </p>
            {analysisResults.data_source === 'synthetic_only' && analysisResults.analysis_confidence === 'ai_enhanced' && (
              <p className="text-[10px] mt-2 text-emerald-600 italic">
                (Frontend override: backend reported demo data_source but confidence=ai_enhanced. Showing AI banner.)
              </p>
            )}
          </div>
          )
        })()}
        
        {analysisResults.data_source === 'synthetic_only' && analysisResults.analysis_confidence !== 'ai_enhanced' && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="font-semibold">Demo Mode - Synthetic Data</span>
            </div>
            <p className="text-sm">
              {analysisResults.notes || 'Reddit access is currently blocked. Results are generated using AI-powered market analysis for demonstration purposes.'}
            </p>
            <p className="text-xs mt-2 text-amber-700">
              💡 <strong>Want real market data?</strong> We're working on alternative data sources for authentic market validation.
            </p>
          </div>
        )}
        
        {/* Debug display for unknown data_source values */}
        {analysisResults.data_source && !['ai_synthetic', 'synthetic_only', 'mixed_real_synthetic', 'real_reddit_data', 'limited_real', 'reddit_plus_ai'].includes(analysisResults.data_source) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-semibold">Debug: Unknown Data Source</span>
            </div>
            <p className="text-sm">
              Data Source: <code>{analysisResults.data_source}</code><br/>
              Analysis Confidence: <code>{analysisResults.analysis_confidence}</code><br/>
              Debug Mode: <code>{(analysisResults as any).debug?.mode}</code>
            </p>
          </div>
        )}
        
        {analysisResults.data_source === 'mixed_real_synthetic' && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Partial Real Data Analysis</span>
            </div>
            <p className="text-sm">
              Analysis based on <strong>{analysisResults.evidence?.real_post_count || 0} real discussions</strong> plus enhanced AI analysis.
              Confidence: <strong>{analysisResults.analysis_confidence}</strong>
            </p>
          </div>
        )}
        
        {analysisResults.data_source === 'real_reddit_data' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold">Real Market Data Analysis</span>
            </div>
            <p className="text-sm">
              High confidence analysis based on <strong>{analysisResults.evidence?.real_post_count || 0} real market discussions</strong> from Reddit communities.
            </p>
          </div>
        )}
        
        <div className="space-y-8">
          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-primary/10 to-[hsl(var(--hot-pink))/10] rounded-2xl p-6 border border-primary/20">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Executive Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {analysisResults.overall_score}/10
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[hsl(var(--hot-pink))]">
                    {analysisResults.viability_score}/10
                  </div>
                  <div className="text-sm text-muted-foreground">Viability Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[hsl(var(--neon-green))]">
                    {analysisResults.total_posts_analyzed}
                  </div>
                  <div className="text-sm text-muted-foreground">Posts Analyzed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scoring Cards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Market Validation Scores</h2>
            <ScoringCards 
              overallScore={analysisResults.overall_score || 0} 
              viabilityScore={analysisResults.viability_score || 0} 
            />
          </div>

          {/* Metrics Overview */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Key Metrics</h2>
            <MetricsOverview analysisData={analysisResults} />
          </div>

          {/* Sentiment Analysis */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Market Sentiment Analysis</h2>
            <SentimentChart sentimentData={analysisResults.sentiment_data} />
          </div>

          {/* Pain Points */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Pain Points Discovered</h2>
            <PainPointsDisplay 
              painPoints={analysisResults.pain_points} 
              subreddits={analysisResults.subreddits} 
              dataSource={analysisResults.data_source}
              analysisConfidence={analysisResults.analysis_confidence}
              redditPosts={analysisResults.evidence?.sample_reddit_posts || []}
            />
          </div>

          {/* Reddit Insights - What People Are Actually Saying */}
          {analysisResults.evidence && analysisResults.evidence.real_post_count > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">What People Are Actually Saying on Reddit</h2>
              <RedditInsights 
                posts={(analysisResults.evidence.sample_reddit_posts || []).map((post: any) => ({
                  title: post.title || '',
                  score: post.score || 0,
                  num_comments: post.comments || post.num_comments || 0,
                  subreddit: post.subreddit || '',
                  permalink: post.permalink || '',
                  selftext: post.selftext || '',
                  signals: post.signals || {},
                  content_length: post.content_length || 0,
                  engagement_ratio: post.engagement_ratio || 0
                }))}
                dataSource={analysisResults.data_source || 'unknown'}
              />
            </div>
          )}

          {/* App Ideas */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Generated App Ideas</h2>
            <AppIdeasGenerator appIdeas={analysisResults.app_ideas} />
          </div>

          {/* Google Trends */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Google Trends Analysis</h2>
            <GoogleTrends trends={analysisResults.google_trends} />
          </div>

          {/* Ideal Customer Profile */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Ideal Customer Profile (ICP)</h2>
            <ICPDisplay icp={analysisResults.icp} />
          </div>

          {/* Problem Statements */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Problem Statements</h2>
            <ProblemStatements problemStatements={analysisResults.problem_statements} />
          </div>

          {/* Financial Risks */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Financial Risk Assessment</h2>
            <FinancialRisks risks={analysisResults.financial_risks} />
          </div>

          {/* Competitors Analysis */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Competitive Landscape</h2>
            <CompetitorsAnalysis competitors={analysisResults.competitors} />
          </div>

          {/* Revenue Models */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Revenue Strategy & Models</h2>
            <RevenueModels revenueModels={analysisResults.revenue_models} />
          </div>

          {/* ====== COMPREHENSIVE BUSINESS ANALYSIS SECTIONS ====== */}
          
          {/* Business Overview */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">📋 Business Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Business Viability</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Comprehensive viability assessment based on market validation, competitive analysis, and financial projections.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full bg-muted rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{width: `${(analysisResults.viability_score || 7) * 10}%`}}></div>
                    </div>
                    <span className="text-sm font-medium">{analysisResults.viability_score || 7}/10</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Monetization Strategies</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(analysisResults.revenue_models || [
                      { model: "Subscription Model", description: "Monthly/yearly recurring revenue" },
                      { model: "Freemium Model", description: "Free tier with premium features" },
                      { model: "Transaction Fees", description: "Commission on platform transactions" }
                    ]).slice(0, 3).map((model, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium text-sm">{model.model_type}</div>
                          <div className="text-xs text-muted-foreground">{model.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">User Pain Points</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(analysisResults.pain_points || [
                      "Time-consuming manual processes",
                      "Lack of centralized information",
                      "High costs of existing solutions"
                    ]).slice(0, 3).map((pain, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <span>{typeof pain === 'string' ? pain : pain.title}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Revenue Opportunities</h3>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      $50M+
                    </div>
                    <div className="text-sm text-muted-foreground">Total Addressable Market</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Potential Risks</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(analysisResults.financial_risks || [
                      { risk: "Market competition", severity: "Medium" },
                      { risk: "Technical complexity", severity: "Low" },
                      { risk: "Regulatory changes", severity: "Low" }
                    ]).slice(0, 3).map((risk, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{typeof risk === 'string' ? risk : risk.description}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          (typeof risk === 'object' ? risk.severity : 'low') === 'high' ? 'bg-red-100 text-red-700' :
                          (typeof risk === 'object' ? risk.severity : 'low') === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {typeof risk === 'object' ? risk.severity : 'Low'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Why Now & Market Timing</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {"Current market conditions present a unique opportunity due to increased digital adoption, changing consumer behaviors, and emerging technology trends that align with your solution."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Market Research */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">🎯 Market Research</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Market Trends</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Growing demand for digital solutions",
                      "Increased focus on user experience",
                      "Rising adoption of SaaS models"
                    ].slice(0, 3).map((trend: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{trend}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Market Size & Growth</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        $50M
                      </div>
                      <div className="text-xs text-muted-foreground">TAM</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        $5M
                      </div>
                      <div className="text-xs text-muted-foreground">SAM</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        $0.5M
                      </div>
                      <div className="text-xs text-muted-foreground">SOM</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Consumer Behavior</h3>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Target customers show strong preference for digital solutions, value convenience and efficiency, and are willing to pay for quality services.
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Customer Segments</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      "Early adopters (20%)",
                      "Mainstream market (60%)",
                      "Enterprise clients (20%)"
                    ].map((segment: string, index: number) => (
                      <div key={index} className="text-sm">{segment}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Regulatory Environment</h3>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Current regulatory landscape is favorable with minimal compliance requirements. Key considerations include data privacy and industry-specific regulations.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Launch and Scale */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">🚀 Launch and Scale</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">MVP Roadmap</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">1</div>
                      <div>
                        <div className="font-medium text-sm">Core Features (Months 1-2)</div>
                        <div className="text-xs text-muted-foreground">Essential functionality and user interface</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">2</div>
                      <div>
                        <div className="font-medium text-sm">Beta Testing (Month 3)</div>
                        <div className="text-xs text-muted-foreground">User feedback and iteration</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">3</div>
                      <div>
                        <div className="font-medium text-sm">Launch (Month 4)</div>
                        <div className="text-xs text-muted-foreground">Public release and marketing</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Tech Stack</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-medium text-sm">Frontend</div>
                      <div className="text-xs text-muted-foreground">React/Next.js</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-medium text-sm">Backend</div>
                      <div className="text-xs text-muted-foreground">Node.js/Python</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-medium text-sm">Database</div>
                      <div className="text-xs text-muted-foreground">PostgreSQL</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-medium text-sm">Hosting</div>
                      <div className="text-xs text-muted-foreground">AWS/Vercel</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Operational Costs</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Development</span>
                      <span className="font-medium">$15K-30K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Operations</span>
                      <span className="font-medium">$2K-5K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Marketing</span>
                      <span className="font-medium">$5K-10K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Distribution Channels</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">• Direct website/app</div>
                    <div className="text-sm">• Social media marketing</div>
                    <div className="text-sm">• Content marketing/SEO</div>
                    <div className="text-sm">• Partnership channels</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">User Acquisition</h3>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">$25-50</div>
                    <div className="text-xs text-muted-foreground">Est. Customer Acquisition Cost</div>
                    <div className="text-lg font-bold text-green-600 mt-2">$150-300</div>
                    <div className="text-xs text-muted-foreground">Est. Customer Lifetime Value</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Raise Capital */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">💰 Raise Capital</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Elevator Pitch</h3>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-purple/5 rounded-lg border border-primary/10">
                    <p className="text-sm text-muted-foreground italic">
                      "We're solving a critical market problem for our target market 
                      through an innovative solution that delivers 
                      significant value. We're targeting a 
                      $5M market 
                      with proven demand and strong early traction."
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Funding Requirements</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">$100K - $500K</div>
                      <div className="text-sm text-muted-foreground">Pre-seed/Seed Stage</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Product Development</span>
                        <span>40%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Marketing & Sales</span>
                        <span>35%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Operations & Team</span>
                        <span>25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Valuation Range</h3>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">$2M - $5M</div>
                    <div className="text-sm text-muted-foreground">Pre-money Valuation</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Based on market size, traction, and comparable companies
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Investor Targets</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>• Angel investors in tech</div>
                    <div>• Pre-seed/seed VCs</div>
                    <div>• Industry-specific funds</div>
                    <div>• Strategic investors</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Key Concerns</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                      <span>Market validation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                      <span>Competition</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                      <span>Execution risk</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Analysis Complete */}
          <div className="mt-12 mb-8">
            <Card className="bg-gradient-to-r from-primary/10 to-[hsl(var(--neon-green))/10] border-primary/30">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-bold">Analysis Complete!</h3>
                  </div>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Your comprehensive startup validation report is ready. Use these insights to refine your business strategy and validate your market opportunity.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button onClick={handleNewAnalysis} data-testid="button-new-analysis" size="lg">
                      Analyze Another Idea
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Methodology */}
          <div className="pt-8 border-t">
            <MethodologyModal />
          </div>
        </div>
      </div>
    </div>
  )
}