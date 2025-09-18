import { useState, useEffect } from "react"
import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Share2, TrendingUp, TrendingDown, Users, DollarSign, Target, Calendar, MapPin, Crown, Sparkles, BarChart3, PieChart, Calculator, FileText, Globe, Settings, Scale, AlertCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Area, AreaChart } from "recharts"
import { usePremium } from "@/contexts/premium-context"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"
import type { AnalysisResponse, KeywordIntelligence, RedditAnalysis, CustomerIntelligence, FinancialProjections, TechnologyOperations, LegalRegulatory, LaunchRoadmap, CompetitorMatrix, GtmPlan, MarketSizing, KeywordGenerationInput, CompetitorAnalysisInput, GtmPlanInput, MarketSizingInput } from "@shared/schema"

// Premium analytics data fetching
const usePremiumKeywords = (analysisId: string, enabled: boolean) => {
  return useQuery<KeywordIntelligence>({
    queryKey: ['/api/premium/keywords', analysisId],
    enabled: enabled && !!analysisId,
  })
}


const usePremiumCompetitors = (analysisId: string, enabled: boolean) => {
  return useQuery<CompetitorMatrix>({
    queryKey: ['/api/premium/competitors', analysisId],
    enabled: enabled && !!analysisId,
  })
}

const usePremiumGtm = (analysisId: string, enabled: boolean) => {
  return useQuery<GtmPlan>({
    queryKey: ['/api/premium/gtm-plan', analysisId],
    enabled: enabled && !!analysisId,
  })
}

const usePremiumMarket = (analysisId: string, enabled: boolean) => {
  return useQuery<MarketSizing>({
    queryKey: ['/api/premium/market-sizing', analysisId],
    enabled: enabled && !!analysisId,
  })
}

// New premium analytics queries
const usePremiumReddit = (analysisId: string, enabled: boolean) => {
  return useQuery<RedditAnalysis>({
    queryKey: ['/api/premium/reddit-analysis', analysisId],
    enabled: enabled && !!analysisId,
  })
}

const usePremiumCustomer = (analysisId: string, enabled: boolean) => {
  return useQuery<CustomerIntelligence>({
    queryKey: ['/api/premium/customer-intelligence', analysisId],
    enabled: enabled && !!analysisId,
  })
}

const usePremiumFinancialProjections = (analysisId: string, enabled: boolean) => {
  return useQuery<FinancialProjections>({
    queryKey: ['/api/premium/financial-projections', analysisId],
    enabled: enabled && !!analysisId,
  })
}

const usePremiumTechnology = (analysisId: string, enabled: boolean) => {
  return useQuery<TechnologyOperations>({
    queryKey: ['/api/premium/technology-operations', analysisId],
    enabled: enabled && !!analysisId,
  })
}

const usePremiumLegal = (analysisId: string, enabled: boolean) => {
  return useQuery<LegalRegulatory>({
    queryKey: ['/api/premium/legal-regulatory', analysisId],
    enabled: enabled && !!analysisId,
  })
}

const usePremiumRoadmap = (analysisId: string, enabled: boolean) => {
  return useQuery<LaunchRoadmap>({
    queryKey: ['/api/premium/launch-roadmap', analysisId],
    enabled: enabled && !!analysisId,
  })
}

// Generate premium data mutations
const useGenerateKeywords = () => {
  const queryClient = useQueryClient()
  return useMutation<KeywordIntelligence, Error, KeywordGenerationInput>({
    mutationFn: (data: KeywordGenerationInput) => apiRequest('/api/premium/keywords', 'POST', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/premium/keywords', variables.analysisId] })
    }
  })
}


const useGenerateCompetitors = () => {
  const queryClient = useQueryClient()
  return useMutation<CompetitorMatrix, Error, CompetitorAnalysisInput>({
    mutationFn: (data: CompetitorAnalysisInput) => apiRequest('/api/premium/competitors', 'POST', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/premium/competitors', variables.analysisId] })
    }
  })
}

const useGenerateGtm = () => {
  const queryClient = useQueryClient()
  return useMutation<GtmPlan, Error, GtmPlanInput>({
    mutationFn: (data: GtmPlanInput) => apiRequest('/api/premium/gtm-plan', 'POST', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/premium/gtm-plan', variables.analysisId] })
    }
  })
}

const useGenerateMarket = () => {
  const queryClient = useQueryClient()
  return useMutation<MarketSizing, Error, MarketSizingInput>({
    mutationFn: (data: MarketSizingInput) => apiRequest('/api/premium/market-sizing', 'POST', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/premium/market-sizing', variables.analysisId] })
    }
  })
}

// New premium section mutations
const useGenerateReddit = () => {
  const queryClient = useQueryClient()
  return useMutation<RedditAnalysis, Error, { analysisId: string, subreddits: string[], keywords: string[], industry: string }>({
    mutationFn: (data) => apiRequest('/api/premium/reddit-analysis', 'POST', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/premium/reddit-analysis', variables.analysisId] })
    }
  })
}

const useGenerateCustomer = () => {
  const queryClient = useQueryClient()
  return useMutation<CustomerIntelligence, Error, { analysisId: string, industry: string, targetAudience?: string }>({
    mutationFn: (data) => apiRequest('/api/premium/customer-intelligence', 'POST', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/premium/customer-intelligence', variables.analysisId] })
    }
  })
}

const useGenerateFinancialProjections = () => {
  const queryClient = useQueryClient()
  return useMutation<FinancialProjections, Error, { analysisId: string, industry: string, revenueModel?: string }>({
    mutationFn: (data) => apiRequest('/api/premium/financial-projections', 'POST', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/premium/financial-projections', variables.analysisId] })
    }
  })
}

const useGenerateTechnology = () => {
  const queryClient = useQueryClient()
  return useMutation<TechnologyOperations, Error, { analysisId: string, productType?: string, scale?: string }>({
    mutationFn: (data) => apiRequest('/api/premium/technology-operations', 'POST', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/premium/technology-operations', variables.analysisId] })
    }
  })
}

const useGenerateLegal = () => {
  const queryClient = useQueryClient()
  return useMutation<LegalRegulatory, Error, { analysisId: string, businessType?: string, jurisdiction?: string }>({
    mutationFn: (data) => apiRequest('/api/premium/legal-regulatory', 'POST', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/premium/legal-regulatory', variables.analysisId] })
    }
  })
}

const useGenerateRoadmap = () => {
  const queryClient = useQueryClient()
  return useMutation<LaunchRoadmap, Error, { analysisId: string, industry: string, targetLaunchDate?: string }>({
    mutationFn: (data) => apiRequest('/api/premium/launch-roadmap', 'POST', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/premium/launch-roadmap', variables.analysisId] })
    }
  })
}

// Keyword Intelligence Component
function KeywordIntelligenceSection({ analysisId, industry, primaryKeyword }: { analysisId: string, industry: string, primaryKeyword: string }) {
  const { isPremium } = usePremium()
  const keywordsQuery = usePremiumKeywords(analysisId, isPremium)
  const generateKeywords = useGenerateKeywords()

  useEffect(() => {
    if (isPremium && analysisId && !keywordsQuery.data && !keywordsQuery.isLoading) {
      generateKeywords.mutate({
        analysisId,
        primaryKeyword,
        industry,
        targetAudience: "General users",
        locale: "US"
      })
    }
  }, [isPremium, analysisId, primaryKeyword, industry])

  if (!isPremium) return null
  if (keywordsQuery.isLoading || generateKeywords.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Keyword Intelligence
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (keywordsQuery.isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Keyword Intelligence
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>Failed to load keyword data. Please try again.</p>
            <Button 
              onClick={() => keywordsQuery.refetch()} 
              variant="outline" 
              size="sm" 
              className="mt-4"
              data-testid="button-retry-keywords"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const keywordData = keywordsQuery.data

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Keyword Intelligence & Search Volume Analysis
          <Badge variant="secondary">Premium</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {keywordData && (
          <div className="space-y-6">
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="text-total-search-volume">{keywordData.totalSearchVolume?.toLocaleString() || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Total Search Volume</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="text-avg-cpc">${keywordData.avgCpc?.toFixed(2) || '0.00'}</div>
                <div className="text-sm text-muted-foreground">Avg CPC</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400" data-testid="text-avg-difficulty">{Math.round(keywordData.avgDifficulty || 0)}/100</div>
                <div className="text-sm text-muted-foreground">Avg Difficulty</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-locale">{keywordData.locale || 'US'}</div>
                <div className="text-sm text-muted-foreground">Market</div>
              </div>
            </div>

            <Separator />

            {/* Keyword Tables */}
            <Tabs defaultValue="primary" className="w-full">
              <TabsList data-testid="tabs-keyword-types">
                <TabsTrigger value="primary" data-testid="tab-primary-keywords">Primary Keywords</TabsTrigger>
                <TabsTrigger value="longtail" data-testid="tab-longtail-keywords">Long-tail Keywords</TabsTrigger>
                <TabsTrigger value="competitor" data-testid="tab-competitor-keywords">Competitor Keywords</TabsTrigger>
              </TabsList>
              
              <TabsContent value="primary">
                <div className="space-y-4">
                  <h4 className="font-semibold">Primary Keywords Analysis</h4>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keyword</TableHead>
                          <TableHead>Search Volume</TableHead>
                          <TableHead>CPC</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead>Intent</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {keywordData.primaryKeywords?.map((keyword, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{keyword.keyword}</TableCell>
                            <TableCell>{keyword.searchVolume?.toLocaleString()}</TableCell>
                            <TableCell>${keyword.cpc?.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={keyword.difficulty} className="w-16" />
                                <span className="text-sm">{keyword.difficulty}/100</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={keyword.intent === 'commercial' ? 'default' : 'secondary'}>
                                {keyword.intent}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )) || []}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="longtail">
                <div className="space-y-4">
                  <h4 className="font-semibold">Long-tail Keywords (Lower Competition)</h4>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keyword</TableHead>
                          <TableHead>Search Volume</TableHead>
                          <TableHead>CPC</TableHead>
                          <TableHead>Difficulty</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {keywordData.longTailKeywords?.map((keyword, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{keyword.keyword}</TableCell>
                            <TableCell>{keyword.searchVolume?.toLocaleString()}</TableCell>
                            <TableCell>${keyword.cpc?.toFixed(2)}</TableCell>
                            <TableCell>
                              <Progress value={keyword.difficulty} className="w-16" />
                            </TableCell>
                          </TableRow>
                        )) || []}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="competitor">
                <div className="space-y-4">
                  <h4 className="font-semibold">Competitor Keywords</h4>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keyword</TableHead>
                          <TableHead>Search Volume</TableHead>
                          <TableHead>CPC</TableHead>
                          <TableHead>Difficulty</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {keywordData.competitorKeywords?.map((keyword, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{keyword.keyword}</TableCell>
                            <TableCell>{keyword.searchVolume?.toLocaleString()}</TableCell>
                            <TableCell>${keyword.cpc?.toFixed(2)}</TableCell>
                            <TableCell>
                              <Progress value={keyword.difficulty} className="w-16" />
                            </TableCell>
                          </TableRow>
                        )) || []}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* 24-Month Trend Chart */}
            {keywordData.primaryKeywords?.[0]?.trend24Months && keywordData.primaryKeywords[0].trend24Months.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold">24-Month Search Volume Trend</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={keywordData.primaryKeywords[0].trend24Months}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="volume" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Reddit Analysis Component
function RedditAnalysisSection({ analysisId, subreddits, keywords, industry }: { analysisId: string, subreddits: string[], keywords: string[], industry: string }) {
  const { isPremium } = usePremium()
  const redditQuery = usePremiumReddit(analysisId, isPremium)
  const generateReddit = useGenerateReddit()

  useEffect(() => {
    if (isPremium && analysisId && subreddits?.length && keywords?.length && !redditQuery.data && !redditQuery.isLoading) {
      generateReddit.mutate({
        analysisId,
        subreddits,
        keywords,
        industry
      })
    }
  }, [isPremium, analysisId, subreddits, keywords, industry])

  if (!isPremium || !subreddits || !keywords) return null

  if (redditQuery.isLoading || generateReddit.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Deep Reddit Analysis & Community Insights
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="text-sm text-muted-foreground">Analyzing Reddit discussions and community sentiment...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (redditQuery.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Deep Reddit Analysis & Community Insights
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Failed to load Reddit analysis</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const redditData = redditQuery.data
  if (!redditData) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Deep Reddit Analysis & Community Insights
          <Badge variant="secondary">Premium</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Subreddit Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {redditData.subredditInsights?.slice(0, 3).map((subreddit, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400">r/{subreddit.name}</h4>
                  <div className="space-y-2 mt-2">
                    <div className="text-sm">
                      <span className="font-medium">Members: </span>
                      <span data-testid={`text-${subreddit.name}-members`}>{subreddit.members}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Engagement: </span>
                      <span className={`${subreddit.engagement === 'High' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {subreddit.engagement}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Relevance: </span>
                      <span className="text-sm">{subreddit.relevanceScore}/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trending Discussions */}
          <div className="space-y-4">
            <h4 className="font-semibold">High-Impact Discussions & Pain Points</h4>
            <div className="space-y-4">
              {redditData.topDiscussions?.slice(0, 3).map((discussion, index) => (
                <div key={index} className="p-4 border rounded-lg hover-elevate">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <h5 className="font-medium">{discussion.title}</h5>
                      <p className="text-sm text-muted-foreground">"{discussion.excerpt}"</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>↑ {discussion.upvotes} upvotes</span>
                        <span>💬 {discussion.comments} comments</span>
                        <span>📊 {discussion.sentiment} sentiment</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pain Points Analysis */}
          {redditData.painPointsAnalysis && (
            <div className="space-y-4">
              <h4 className="font-semibold">Identified Pain Points from Real Users</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {redditData.painPointsAnalysis.slice(0, 4).map((painPoint, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <h5 className="font-medium text-sm">{painPoint.category}</h5>
                    <p className="text-sm text-muted-foreground mt-1">{painPoint.description}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      Mentioned {painPoint.frequency} times across discussions
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Customer Intelligence Section
function CustomerIntelligenceSection({ analysisId, industry }: { analysisId: string, industry: string }) {
  const { isPremium } = usePremium()
  const customerQuery = usePremiumCustomer(analysisId, isPremium)
  const generateCustomer = useGenerateCustomer()

  useEffect(() => {
    if (isPremium && analysisId && industry && !customerQuery.data && !customerQuery.isLoading) {
      generateCustomer.mutate({
        analysisId,
        industry,
        targetAudience: "General market"
      })
    }
  }, [isPremium, analysisId, industry])

  if (!isPremium) return null

  if (customerQuery.isLoading || generateCustomer.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Intelligence & Persona Analysis
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="text-sm text-muted-foreground">Analyzing customer personas and behavior patterns...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (customerQuery.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Intelligence & Persona Analysis
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Failed to load customer intelligence</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const customerData = customerQuery.data
  if (!customerData) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Customer Intelligence & Persona Analysis
          <Badge variant="secondary">Premium</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Customer Personas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customerData.personas?.slice(0, 2).map((persona, index) => (
              <Card key={index} className={`border-l-4 ${index === 0 ? 'border-l-green-500' : 'border-l-blue-500'}`}>
                <CardHeader>
                  <h4 className={`font-semibold ${index === 0 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    {persona.type}: {persona.title}
                  </h4>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div><strong>Demographics:</strong> {persona.demographics}</div>
                  <div><strong>Pain Points:</strong> {persona.painPoints?.join(', ')}</div>
                  <div><strong>Goals:</strong> {persona.goals?.join(', ')}</div>
                  <div><strong>Buying Triggers:</strong> {persona.buyingTriggers?.join(', ')}</div>
                  <div><strong>Decision Timeline:</strong> {persona.decisionTimeline}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Behavioral Analysis */}
          {customerData.behaviorAnalysis && (
            <div className="space-y-4">
              <h4 className="font-semibold">Customer Behavior Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h5 className="font-medium">Purchasing Patterns</h5>
                  <p className="text-sm text-muted-foreground mt-2">{customerData.behaviorAnalysis.purchasingPatterns}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h5 className="font-medium">Communication Preferences</h5>
                  <p className="text-sm text-muted-foreground mt-2">{customerData.behaviorAnalysis.communicationPreferences}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h5 className="font-medium">Decision Factors</h5>
                  <p className="text-sm text-muted-foreground mt-2">{customerData.behaviorAnalysis.decisionFactors}</p>
                </div>
              </div>
            </div>
          )}

          {/* Market Segments */}
          {customerData.marketSegments && (
            <div className="space-y-4">
              <h4 className="font-semibold">Market Segmentation</h4>
              <div className="space-y-3">
                {customerData.marketSegments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">{segment.name}</h5>
                      <p className="text-sm text-muted-foreground">{segment.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{segment.marketShare}%</div>
                      <div className="text-sm text-muted-foreground">Market Share</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Financial Projections Section (not simulator)
function FinancialProjectionsSection({ analysisId, industry }: { analysisId: string, industry: string }) {
  const { isPremium } = usePremium()
  const projectionsQuery = usePremiumFinancialProjections(analysisId, isPremium)
  const generateProjections = useGenerateFinancialProjections()

  useEffect(() => {
    if (isPremium && analysisId && industry && !projectionsQuery.data && !projectionsQuery.isLoading) {
      generateProjections.mutate({
        analysisId,
        industry,
        revenueModel: "subscription"
      })
    }
  }, [isPremium, analysisId, industry])

  if (!isPremium) return null

  if (projectionsQuery.isLoading || generateProjections.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Projections & Revenue Model
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="text-sm text-muted-foreground">Generating financial projections and revenue models...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (projectionsQuery.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Projections & Revenue Model
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Failed to load financial projections</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const projectionsData = projectionsQuery.data
  if (!projectionsData) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Financial Projections & Revenue Model
          <Badge variant="secondary">Premium</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Revenue Model Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projectionsData.revenueModels?.[0]?.tiers?.map((tier, index) => (
              <Card key={index} className={`border-l-4 ${index === 0 ? 'border-l-green-500' : index === 1 ? 'border-l-blue-500' : 'border-l-purple-500'}`}>
                <CardContent className="p-4">
                  <h5 className={`font-semibold ${index === 0 ? 'text-green-600 dark:text-green-400' : index === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`}>
                    {tier.name}
                  </h5>
                  <div className="space-y-2 mt-2 text-sm">
                    <div>${tier.price}/{tier.billingCycle}</div>
                    <div>Target: {Math.round(tier.targetPercentage * 100)}% of users</div>
                    <div className="space-y-1">
                      {tier.features?.slice(0, 3).map((feature, fIndex) => (
                        <div key={fIndex} className="text-xs">{feature}</div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 3-Year Financial Outlook */}
          <div className="space-y-4">
            <h4 className="font-semibold">3-Year Growth Projections</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projectionsData.projections?.slice(0, 3).map((year, index) => (
                <div key={index} className="p-4 border rounded-lg text-center hover-elevate">
                  <h5 className="font-semibold mb-2">Year {year.year}</h5>
                  <div className="space-y-1 text-sm">
                    <div>Customers: {year.customers?.toLocaleString()}</div>
                    <div>Revenue: ${year.revenue?.toLocaleString()}</div>
                    {year.growthRate && <div>Growth: {year.growthRate}x</div>}
                    {year.churnRate && <div>Churn: {Math.round(year.churnRate * 100)}%</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unit Economics */}
          {projectionsData.unitEconomics && (
            <div className="space-y-4">
              <h4 className="font-semibold">Unit Economics</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <h5 className="font-medium">CAC</h5>
                  <p className="text-2xl font-bold">${projectionsData.unitEconomics.customerAcquisitionCost}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <h5 className="font-medium">LTV</h5>
                  <p className="text-2xl font-bold">${projectionsData.unitEconomics.lifetimeValue?.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <h5 className="font-medium">LTV:CAC</h5>
                  <p className="text-2xl font-bold">{projectionsData.unitEconomics.ltvCacRatio}:1</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <h5 className="font-medium">Payback</h5>
                  <p className="text-2xl font-bold">{projectionsData.unitEconomics.paybackPeriod} mo</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Technology & Operations Section
function TechnologyOperationsSection({ analysisId, industry }: { analysisId: string, industry: string }) {
  const { isPremium } = usePremium()
  const technologyQuery = usePremiumTechnology(analysisId, isPremium)
  const generateTechnology = useGenerateTechnology()

  useEffect(() => {
    if (isPremium && analysisId && industry && !technologyQuery.data && !technologyQuery.isLoading) {
      generateTechnology.mutate({
        analysisId,
        productType: "web_application",
        scale: "startup"
      })
    }
  }, [isPremium, analysisId, industry])

  if (!isPremium) return null

  if (technologyQuery.isLoading || generateTechnology.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Technology Stack & Operations Plan
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="text-sm text-muted-foreground">Analyzing technology stack and operations requirements...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (technologyQuery.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Technology Stack & Operations Plan
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Failed to load technology operations plan</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const technologyData = technologyQuery.data
  if (!technologyData) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Technology Stack & Operations Plan
          <Badge variant="secondary">Premium</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Tech Stack Recommendations */}
          <div className="space-y-4">
            <h4 className="font-semibold">Recommended Technology Stack</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technologyData.technologyStack?.mvp?.concat(technologyData.technologyStack?.production || []).slice(0, 4).map((tech, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h5 className="font-semibold text-blue-600 dark:text-blue-400">{tech.category}</h5>
                    <div className="space-y-2 mt-2">
                      <div className="text-sm font-medium">{tech.technology}</div>
                      <div className="text-sm text-muted-foreground">{tech.reasoning}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Cost: {tech.cost}</span>
                        <span>Learning: {tech.learningCurve}</span>
                      </div>
                      {tech.alternatives && (
                        <div className="text-xs text-muted-foreground">
                          Alternatives: {tech.alternatives.join(', ')}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Requirements */}
          {technologyData.team && (
            <div className="space-y-4">
              <h4 className="font-semibold">Team & Resource Planning</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-3">MVP Phase</h5>
                  <div className="space-y-2 text-sm">
                    <div>Developers: {technologyData.team.mvpPhase?.developers}</div>
                    <div>Designer: {technologyData.team.mvpPhase?.designer}</div>
                    <div>Duration: {technologyData.team.mvpPhase?.duration}</div>
                    <div className="font-medium">Monthly Cost: ${technologyData.team.mvpPhase?.monthlyCost?.toLocaleString()}</div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-3">Growth Phase</h5>
                  <div className="space-y-2 text-sm">
                    <div>Developers: {technologyData.team.growthPhase?.developers}</div>
                    <div>Designer: {technologyData.team.growthPhase?.designer}</div>
                    <div>DevOps: {technologyData.team.growthPhase?.devops}</div>
                    <div>Duration: {technologyData.team.growthPhase?.duration}</div>
                    <div className="font-medium">Monthly Cost: ${technologyData.team.growthPhase?.monthlyCost?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Infrastructure */}
          {technologyData.infrastructure && (
            <div className="space-y-4">
              <h4 className="font-semibold">Infrastructure & Hosting</h4>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">Hosting Costs (AWS/Vercel)</h5>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold">${technologyData.infrastructure.hosting?.estimatedCosts?.month1}</div>
                    <div className="text-muted-foreground">Month 1</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">${technologyData.infrastructure.hosting?.estimatedCosts?.month6}</div>
                    <div className="text-muted-foreground">Month 6</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">${technologyData.infrastructure.hosting?.estimatedCosts?.month12}</div>
                    <div className="text-muted-foreground">Month 12</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">${technologyData.infrastructure.hosting?.estimatedCosts?.month24}</div>
                    <div className="text-muted-foreground">Month 24</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Legal & Regulatory Section
function LegalRegulatorySection({ analysisId, industry }: { analysisId: string, industry: string }) {
  const { isPremium } = usePremium()
  const legalQuery = usePremiumLegal(analysisId, isPremium)
  const generateLegal = useGenerateLegal()

  useEffect(() => {
    if (isPremium && analysisId && industry && !legalQuery.data && !legalQuery.isLoading) {
      generateLegal.mutate({
        analysisId,
        businessType: "technology",
        jurisdiction: "Delaware"
      })
    }
  }, [isPremium, analysisId, industry])

  if (!isPremium) return null

  if (legalQuery.isLoading || generateLegal.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Legal & Regulatory Requirements
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="text-sm text-muted-foreground">Analyzing legal requirements and regulatory compliance...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (legalQuery.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Legal & Regulatory Requirements
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Failed to load legal regulatory analysis</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const legalData = legalQuery.data
  if (!legalData) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Legal & Regulatory Requirements
          <Badge variant="secondary">Premium</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Business Structure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <h5 className="font-semibold text-blue-600 dark:text-blue-400">Business Structure</h5>
                <div className="space-y-2 mt-2 text-sm">
                  <div>Recommended: {legalData.businessStructure?.recommended}</div>
                  <div>Alternatives: {legalData.businessStructure?.alternatives?.join(', ')}</div>
                  <div>Filing Cost: ${legalData.businessStructure?.incorporationCosts?.filing}</div>
                  <div>Timeline: {legalData.businessStructure?.timeline}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <h5 className="font-semibold text-green-600 dark:text-green-400">Intellectual Property</h5>
                <div className="space-y-2 mt-2 text-sm">
                  <div>Trademarks: ${legalData.intellectualProperty?.trademarks?.companyName?.cost}</div>
                  <div>Copyrights: ${legalData.intellectualProperty?.copyrights?.softwareCode?.cost}</div>
                  <div>Timeline: {legalData.intellectualProperty?.trademarks?.companyName?.timeline}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <h5 className="font-semibold text-purple-600 dark:text-purple-400">Compliance</h5>
                <div className="space-y-2 mt-2 text-sm">
                  <div>Privacy Policy: Required</div>
                  <div>Terms of Service: Required</div>
                  <div>GDPR: {legalData.compliance?.dataPrivacy?.[0]?.penalties}</div>
                  <div>Cost: $800-3500</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Legal Timeline */}
          {legalData.timeline && (
            <div className="space-y-4">
              <h4 className="font-semibold">Legal Implementation Timeline</h4>
              <div className="space-y-3">
                {legalData.timeline.map((phase, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h5 className="font-medium">{phase.phase}</h5>
                    <p className="text-sm text-muted-foreground mt-1">{phase.tasks?.join(', ')}</p>
                    <div className="flex justify-between text-sm mt-2">
                      <span>Cost: ${phase.cost?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// 12-Month Launch Roadmap Section
function LaunchRoadmapSection({ analysisId, industry }: { analysisId: string, industry: string }) {
  const { isPremium } = usePremium()
  const roadmapQuery = usePremiumRoadmap(analysisId, isPremium)
  const generateRoadmap = useGenerateRoadmap()

  useEffect(() => {
    if (isPremium && analysisId && industry && !roadmapQuery.data && !roadmapQuery.isLoading) {
      generateRoadmap.mutate({
        analysisId,
        industry,
        targetLaunchDate: undefined
      })
    }
  }, [isPremium, analysisId, industry])

  if (!isPremium) return null

  if (roadmapQuery.isLoading || generateRoadmap.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            12-Month Launch Roadmap
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="text-sm text-muted-foreground">Generating comprehensive 12-month launch roadmap...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (roadmapQuery.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            12-Month Launch Roadmap
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Failed to load launch roadmap</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const roadmapData = roadmapQuery.data
  if (!roadmapData) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          12-Month Launch Roadmap
          <Badge variant="secondary">Premium</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quarterly Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roadmapData.quarters?.map((quarter, index) => (
              <Card key={index} className={`border-l-4 ${index === 0 ? 'border-l-blue-500' : index === 1 ? 'border-l-green-500' : index === 2 ? 'border-l-purple-500' : 'border-l-orange-500'}`}>
                <CardHeader className="pb-2">
                  <h4 className={`font-semibold ${index === 0 ? 'text-blue-600 dark:text-blue-400' : index === 1 ? 'text-green-600 dark:text-green-400' : index === 2 ? 'text-purple-600 dark:text-purple-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {quarter.quarter}: {quarter.title}
                  </h4>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    {quarter.objectives?.slice(0, 4).map((objective, objIndex) => (
                      <div key={objIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {objective}
                      </div>
                    ))}
                    <div className="text-xs text-muted-foreground mt-2">
                      Budget: ${quarter.budget?.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Metrics Timeline */}
          {roadmapData.metricTargets && (
            <div className="space-y-4">
              <h4 className="font-semibold">Growth Metrics Timeline</h4>
              <div className="overflow-x-auto">
                <table className="w-full border rounded-lg">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-3 font-medium">Metric</th>
                      <th className="text-center p-3 font-medium">Month 3</th>
                      <th className="text-center p-3 font-medium">Month 6</th>
                      <th className="text-center p-3 font-medium">Month 9</th>
                      <th className="text-center p-3 font-medium">Month 12</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roadmapData.metricTargets.map((target, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3 font-medium">{target.metric}</td>
                        <td className="p-3 text-center">{target.month3}</td>
                        <td className="p-3 text-center">{target.month6}</td>
                        <td className="p-3 text-center">{target.month9}</td>
                        <td className="p-3 text-center">{target.month12}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


// Enhanced Competitor Matrix Component
function CompetitorMatrixSection({ analysisId, industry }: { analysisId: string, industry: string }) {
  const { isPremium } = usePremium()
  const competitorsQuery = usePremiumCompetitors(analysisId, isPremium)
  const generateCompetitors = useGenerateCompetitors()

  useEffect(() => {
    if (isPremium && analysisId && !competitorsQuery.data && !competitorsQuery.isLoading) {
      generateCompetitors.mutate({
        analysisId,
        industry,
        targetKeyword: industry
      })
    }
  }, [isPremium, analysisId, industry])

  if (!isPremium) return null
  if (competitorsQuery.isLoading || generateCompetitors.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Competitor Matrix & Market Positioning
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const competitorData: CompetitorMatrix | undefined = competitorsQuery.data as CompetitorMatrix | undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Competitor Matrix & Market Positioning
          <Badge variant="secondary">Premium</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {competitorData && (
          <div className="space-y-6">
            {/* Competitor Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Pricing (Start)</TableHead>
                    <TableHead>Market Share</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Founded</TableHead>
                    <TableHead>Funding</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitorData.competitors?.map((competitor, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{competitor.name}</div>
                          <div className="text-sm text-muted-foreground">{competitor.targetAudience}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {competitor.pricing?.[0] ? (
                          <div>
                            <div className="font-medium">${competitor.pricing[0].price}/{competitor.pricing[0].billingCycle}</div>
                            <div className="text-sm text-muted-foreground">{competitor.pricing[0].tier}</div>
                          </div>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>{competitor.marketShare ? `${competitor.marketShare}%` : 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {competitor.sentimentScore >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={competitor.sentimentScore >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {((competitor.sentimentScore || 0) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{competitor.yearFounded || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{competitor.fundingStage || 'Unknown'}</Badge>
                      </TableCell>
                    </TableRow>
                  )) || []}
                </TableBody>
              </Table>
            </div>

            {/* Market Gaps and Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Market Gaps Identified</h4>
                <div className="space-y-2">
                  {competitorData.marketGaps?.map((gap, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                      <p className="text-sm">{gap}</p>
                    </div>
                  )) || []}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Competitive Advantages</h4>
                <div className="space-y-2">
                  {competitorData.competitiveAdvantages?.map((advantage, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <p className="text-sm">{advantage}</p>
                    </div>
                  )) || []}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// GTM Planning Component
function GtmPlanningSection({ analysisId, productDescription }: { analysisId: string, productDescription: string }) {
  const { isPremium } = usePremium()
  const gtmQuery = usePremiumGtm(analysisId, isPremium)
  const generateGtm = useGenerateGtm()

  useEffect(() => {
    if (isPremium && analysisId && !gtmQuery.data && !gtmQuery.isLoading) {
      generateGtm.mutate({
        analysisId,
        productDescription,
        targetAudience: "General market",
        budget: 50000
      })
    }
  }, [isPremium, analysisId, productDescription])

  if (!isPremium) return null
  if (gtmQuery.isLoading || generateGtm.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            90-Day Go-to-Market Plan & Risk Analysis
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const gtmData: GtmPlan | undefined = gtmQuery.data as GtmPlan | undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          90-Day Go-to-Market Plan & Risk Analysis
          <Badge variant="secondary">Premium</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {gtmData && (
          <div className="space-y-6">
            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${gtmData.totalBudget?.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Budget</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{gtmData.phases?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Phases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{gtmData.successMetrics?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Success Metrics</div>
              </div>
            </div>

            <Separator />

            {/* GTM Phases */}
            <Tabs defaultValue="phases" className="w-full">
              <TabsList>
                <TabsTrigger value="phases">Execution Phases</TabsTrigger>
                <TabsTrigger value="risks">Risks & Mitigation</TabsTrigger>
                <TabsTrigger value="criteria">Kill Criteria</TabsTrigger>
              </TabsList>
              
              <TabsContent value="phases">
                <div className="space-y-4">
                  {gtmData.phases?.map((phase, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{phase.phase}</CardTitle>
                          <Badge variant="outline">{phase.weeks}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Objectives</h5>
                            <ul className="list-disc list-inside space-y-1">
                              {phase.objectives?.map((objective, idx) => (
                                <li key={idx} className="text-sm">{objective}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-2">Key Tactics</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {phase.tactics?.slice(0, 4).map((tactic, idx) => (
                                <div key={idx} className="p-2 border rounded text-sm">
                                  <div className="font-medium">{tactic.name}</div>
                                  <div className="text-muted-foreground text-xs">{tactic.timeline}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Success Metrics</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {phase.kpis?.map((kpi, idx) => (
                                <div key={idx} className="text-center p-2 bg-muted rounded">
                                  <div className="font-bold">{kpi.target} {kpi.unit}</div>
                                  <div className="text-xs text-muted-foreground">{kpi.metric}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="risks">
                <div className="space-y-4">
                  <h4 className="font-semibold">Risk Assessment & Mitigation</h4>
                  <div className="space-y-4">
                    {gtmData.risks?.map((risk, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium">{risk.risk}</h5>
                            <div className="flex gap-2">
                              <Badge variant={risk.probability === 'high' ? 'destructive' : risk.probability === 'medium' ? 'default' : 'secondary'}>
                                {risk.probability} probability
                              </Badge>
                              <Badge variant={risk.impact === 'high' ? 'destructive' : risk.impact === 'medium' ? 'default' : 'secondary'}>
                                {risk.impact} impact
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium">Mitigation: </span>
                              <span className="text-sm">{risk.mitigation}</span>
                            </div>
                            {risk.contingency && (
                              <div>
                                <span className="text-sm font-medium">Contingency: </span>
                                <span className="text-sm">{risk.contingency}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="criteria">
                <div className="space-y-4">
                  <h4 className="font-semibold">Kill Criteria - When to Pivot or Stop</h4>
                  <div className="space-y-4">
                    {gtmData.killCriteria?.map((criteria, index) => (
                      <Card key={index} className="border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{criteria.metric}</h5>
                            <Badge variant="destructive">Threshold: {criteria.threshold}</Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">Time Window: </span>
                              {criteria.timeWindow}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Rationale: </span>
                              {criteria.rationale}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Market Sizing Component  
function MarketSizingSection({ analysisId, industry }: { analysisId: string, industry: string }) {
  const { isPremium } = usePremium()
  const marketQuery = usePremiumMarket(analysisId, isPremium)
  const generateMarket = useGenerateMarket()

  useEffect(() => {
    if (isPremium && analysisId && !marketQuery.data && !marketQuery.isLoading) {
      generateMarket.mutate({
        analysisId,
        industry,
        productCategory: industry,
        geography: "Global"
      })
    }
  }, [isPremium, analysisId, industry])

  if (!isPremium) return null
  if (marketQuery.isLoading || generateMarket.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Market Sizing Analysis (TAM/SAM/SOM)
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const marketData: MarketSizing | undefined = marketQuery.data as MarketSizing | undefined

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
    return `$${value?.toFixed(0)}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Market Sizing Analysis (TAM/SAM/SOM)
          <Badge variant="secondary">Premium</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {marketData && (
          <div className="space-y-6">
            {/* Market Size Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-600">TAM (Total Addressable Market)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{formatCurrency(marketData.tam?.value || 0)}</div>
                    <div className="text-sm text-muted-foreground mt-2">{marketData.tam?.method?.description}</div>
                    <div className="mt-3">
                      <Badge variant="outline">Confidence: {Math.round((marketData.tam?.method?.confidence || 0) * 100)}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-600">SAM (Serviceable Addressable Market)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{formatCurrency(marketData.sam?.value || 0)}</div>
                    <div className="text-sm text-muted-foreground mt-2">{marketData.sam?.method?.description}</div>
                    <div className="mt-3">
                      <Badge variant="outline">Confidence: {Math.round((marketData.sam?.method?.confidence || 0) * 100)}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-600">SOM (Serviceable Obtainable Market)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{formatCurrency(marketData.som?.value || 0)}</div>
                    <div className="text-sm text-muted-foreground mt-2">Realistic market capture</div>
                    <div className="mt-3">
                      <Badge variant="outline">{marketData.som?.timeToCapture} years to capture</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Market Segments */}
            {marketData.tam?.segments && marketData.tam.segments.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Market Segments Analysis</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Segment</TableHead>
                        <TableHead>Market Size</TableHead>
                        <TableHead>Growth Rate</TableHead>
                        <TableHead>Accessibility</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {marketData.tam.segments.map((segment, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{segment.segment}</TableCell>
                          <TableCell>{formatCurrency(segment.size)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span>{(segment.growthRate * 100).toFixed(1)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Progress value={segment.accessibility * 100} className="w-16" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Bottom-up Analysis */}
            {marketData.bottomUpAnalysis && (
              <div className="space-y-4">
                <h4 className="font-semibold">Bottom-up Revenue Projection</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold">{marketData.bottomUpAnalysis.unitEconomics?.units?.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Target Units</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">${marketData.bottomUpAnalysis.unitEconomics?.pricePerUnit}</div>
                    <div className="text-sm text-muted-foreground">Price per Unit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{(marketData.bottomUpAnalysis.unitEconomics?.adoptionRate * 100).toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Adoption Rate</div>
                  </div>
                </div>
                
                {marketData.bottomUpAnalysis.scaling && (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={marketData.bottomUpAnalysis.scaling}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => [formatCurrency(value), ""]} />
                        <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function PremiumResults() {
  const [location, setLocation] = useLocation()
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null)
  const [analysisId, setAnalysisId] = useState<string | null>(null)
  const { isPremium, setShowUpgradeModal } = usePremium()

  useEffect(() => {
    // Set document title for SEO
    document.title = "Premium Business Intelligence Report - Reddit Idea Validator"
    
    // Get results from sessionStorage (set by dashboard after analysis)
    const savedResults = sessionStorage.getItem('analysis-results')
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults)
        setAnalysisResults(parsedResults)
        // Extract the analysisId from the stored results
        if (parsedResults.analysisId) {
          setAnalysisId(parsedResults.analysisId)
        } else {
          // Fallback: generate an ID if not present
          setAnalysisId(`analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
        }
      } catch (error) {
        console.error('Failed to parse analysis results:', error)
        // Fallback ID in case of error
        setAnalysisId(`analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
      }
    } else {
      // No saved results, generate a fallback ID
      setAnalysisId(`analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    }

    // Cleanup title on unmount
    return () => {
      document.title = "Reddit Idea Validator - Discover Market Opportunities"
    }
  }, [])

  // Auto-open upgrade modal for non-premium users
  useEffect(() => {
    if (!isPremium) {
      setShowUpgradeModal(true)
    }
  }, [isPremium, setShowUpgradeModal])

  if (!analysisResults || !analysisId) {
    return (
      <div className="min-h-screen bg-background">
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
                  Back to Home
                </Button>
                <h1 className="text-xl font-semibold">Premium Analysis</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <Crown className="h-16 w-16 text-primary mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Premium Analysis Access</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Complete a startup analysis first, then upgrade to premium to unlock comprehensive business intelligence and market insights.
              </p>
            </div>
            <div className="space-y-4">
              <Button onClick={() => setLocation('/')} size="lg" data-testid="button-start-analysis">
                Start New Analysis
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <Card>
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Keyword Intelligence</h3>
                    <p className="text-sm text-muted-foreground">Search volumes, CPC data, and 24-month trends</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calculator className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Financial Modeling</h3>
                    <p className="text-sm text-muted-foreground">CAC/LTV simulator with payback analysis</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">GTM Planning</h3>
                    <p className="text-sm text-muted-foreground">90-day plans with risks and kill criteria</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleNewAnalysis = () => {
    sessionStorage.removeItem('analysis-results')
    setLocation('/')
  }

  const handleExport = () => {
    // TODO: Implement comprehensive export functionality
    console.log('Export functionality will be implemented')
  }

  // Extract key data for premium analytics
  const primaryKeyword = analysisResults.keywords?.[0] || 'startup'
  const industry = 'Technology' // Could be extracted from analysis
  const productDescription = `Startup idea: ${primaryKeyword} solution for ${industry} market`

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <h1 className="text-xl font-semibold flex items-center gap-2" data-testid="premium-results-page-title">
                Premium Business Intelligence Report
                <Crown className="h-5 w-5 text-primary" />
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" data-testid="button-share">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} data-testid="button-download">
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

      {/* Premium Status Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {isPremium ? (
          <Card className="bg-gradient-to-r from-[hsl(var(--neon-green))]/10 to-primary/10 border-[hsl(var(--neon-green))]/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="h-5 w-5 text-[hsl(var(--neon-green))]" />
                <div className="text-center">
                  <h3 className="font-semibold text-[hsl(var(--neon-green))]">🚀 Premium Business Intelligence Active - All Features Unlocked!</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive market analysis with keyword research, financial modeling, competitor intelligence, and GTM planning</p>
                </div>
                <Sparkles className="h-5 w-5 text-[hsl(var(--neon-green))]" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-r from-primary/5 to-[hsl(var(--hot-pink))]/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-3">
                <Crown className="h-5 w-5 text-primary" />
                <div className="text-center">
                  <h3 className="font-semibold">Premium Business Intelligence Preview</h3>
                  <p className="text-sm text-muted-foreground">Complete the upgrade to unlock advanced analytics, financial modeling, and comprehensive market intelligence</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Premium Analytics Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="premium-analysis-results">
        <div className="space-y-8">
          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-primary/10 to-[hsl(var(--hot-pink))]/10 rounded-2xl p-6 border border-primary/20">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Executive Summary
                <Badge variant="secondary">Premium</Badge>
              </h2>
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
                  <div className="text-sm text-muted-foreground">Data Points Analyzed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Analytics Sections */}
          <KeywordIntelligenceSection 
            analysisId={analysisId} 
            industry={industry} 
            primaryKeyword={primaryKeyword} 
          />

          <RedditAnalysisSection 
            analysisId={analysisId} 
            subreddits={analysisResults.subreddits || []} 
            keywords={analysisResults.keywords || []} 
          />

          <CustomerIntelligenceSection analysisId={analysisId} industry={industry} />

          <FinancialProjectionsSection analysisId={analysisId} industry={industry} />

          <TechnologyOperationsSection analysisId={analysisId} industry={industry} />

          <LegalRegulatorySection analysisId={analysisId} industry={industry} />

          <LaunchRoadmapSection analysisId={analysisId} industry={industry} />

          <CompetitorMatrixSection analysisId={analysisId} industry={industry} />

          <GtmPlanningSection analysisId={analysisId} productDescription={productDescription} />

          <MarketSizingSection analysisId={analysisId} industry={industry} />

          {/* Success Message for Premium Users */}
          {isPremium && (
            <div className="mt-12 mb-8">
              <Card className="bg-gradient-to-r from-[hsl(var(--neon-green))]/10 to-primary/10 border-[hsl(var(--neon-green))]/30">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="h-8 w-8 text-[hsl(var(--neon-green))]" />
                      <h3 className="text-2xl font-bold">Complete Premium Business Intelligence Report</h3>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                      You now have access to comprehensive keyword research, financial modeling, competitive intelligence, 
                      go-to-market planning, and market sizing analysis. Use these insights to validate, plan, and execute your startup strategy.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <Button onClick={handleExport} size="lg" variant="outline" data-testid="button-export-report">
                        <Download className="h-4 w-4 mr-2" />
                        Export Complete Report
                      </Button>
                      <Button onClick={handleNewAnalysis} size="lg" data-testid="button-new-analysis">
                        Analyze Another Idea
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}