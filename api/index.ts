import type { VercelRequest, VercelResponse } from '@vercel/node';

// Utility: clamp numbers
const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

interface RawRedditPost {
  title: string;
  selftext?: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  subreddit: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const url = req.url || '';

    // Health
    if (req.method === 'GET') {
      return res.json({
        message: 'IdeaVoyage API live',
        mode: process.env.OPENAI_API_KEY ? 'enhanced' : 'heuristic',
        timestamp: new Date().toISOString(),
        url
      });
    }

    // Treat any POST under this function as /api/analyze for compatibility
    if (req.method === 'POST') {
      const { idea, industry, targetAudience, country = 'global', platform = 'web-app', fundingMethod = 'self-funded', timeRange = 'month' } = req.body || {};
      if (!idea || typeof idea !== 'string' || idea.trim().length < 10) {
        return res.status(400).json({ error: 'Please provide a more detailed description (>= 10 chars) in "idea" field.' });
      }

      // Attempt real analysis
      const result = await performRealAnalysis({ idea: idea.trim(), industry, targetAudience, country, platform, fundingMethod, timeRange });
      return res.json(result);
    }

    return res.status(404).json({ error: 'Not found', method: req.method, url });
  } catch (err) {
    console.error('Fatal API error', err);
    return res.status(500).json({ error: 'Internal server error', detail: err instanceof Error ? err.message : String(err) });
  }
}

async function performRealAnalysis(input: { idea: string; industry?: string; targetAudience?: string; country: string; platform: string; fundingMethod: string; timeRange: string; }) {
  const started = Date.now();
  // 1. Derive seed keywords + candidate subreddits
  const seed = input.idea.toLowerCase();
  const tokens = Array.from(new Set(seed.split(/[^a-z0-9+]+/).filter(Boolean)));
  const isAI = tokens.some(t => ['ai','artificial','intelligence','machine','ml','gpt'].includes(t));
  const isFitness = tokens.some(t => ['fitness','health','workout','exercise','gym','wellness'].includes(t));
  const isEdu = tokens.some(t => ['edu','education','learning','course','tutor'].includes(t));
  const isFin = tokens.some(t => ['fintech','finance','trading','invest','stock','crypto'].includes(t));

  const baseSubs = ['startups','Entrepreneur','smallbusiness'];
  if (isAI) baseSubs.push('MachineLearning','ArtificialInteligence','ChatGPT');
  if (isFitness) baseSubs.push('fitness','loseit');
  if (isEdu) baseSubs.push('edtech','learnprogramming');
  if (isFin) baseSubs.push('fintech','personalfinance');
  // Deduplicate and cap
  const subreddits = Array.from(new Set(baseSubs)).slice(0,6);

  // 2. Fetch Reddit data (best-effort, non-fatal)
  const fetchedPosts: RawRedditPost[] = [];
  for (const sub of subreddits) {
    if (fetchedPosts.length > 30) break; // cap total
    try {
      const url = `https://www.reddit.com/r/${sub}/top.json?t=month&limit=10`;
      const r = await fetch(url, { headers: { 'User-Agent': 'IdeaVoyageBot/1.0 (+https://ideavoyage.vercel.app)' } });
      if (!r.ok) continue;
      const json: any = await r.json();
      const posts = (json?.data?.children || []).map((c: any) => c.data).filter((p: any) => p && p.title).slice(0,10);
      posts.forEach((p: any) => {
        fetchedPosts.push({
          title: p.title,
            selftext: p.selftext,
            score: p.score ?? 0,
            num_comments: p.num_comments ?? 0,
            created_utc: p.created_utc ?? Math.floor(Date.now()/1000),
            permalink: p.permalink,
            subreddit: p.subreddit
        });
      });
    } catch (e) {
      // ignore sub error
    }
    // small delay to be nicer
    await new Promise(r => setTimeout(r, 120));
  }

  // 3. Simple heuristic extraction from posts
  const textCorpus = fetchedPosts.map(p => `${p.title} ${p.selftext||''}`).join('\n');
  const freq: Record<string, number> = {};
  for (const token of textCorpus.toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>3)) {
    freq[token] = (freq[token]||0)+1;
  }
  const frequentTerms = Object.entries(freq)
    .filter(([w,c]) => c>1 && !['with','that','have','this','about','from','https','reddit','they','their','will','your','just'].includes(w))
    .sort((a,b)=>b[1]-a[1])
    .slice(0,15)
    .map(([w])=>w);

  // Heuristic pain point candidates
  const painCandidates: Record<string, {count:number; examples:Set<string>}> = {};
  const painSignals = ['problem','issue','struggle','hard','difficult','confusing','annoying','need','pain','frustrated'];
  fetchedPosts.slice(0,40).forEach(p => {
    const lower = (p.title + ' ' + (p.selftext||'')).toLowerCase();
    if (painSignals.some(sig => lower.includes(sig))) {
      // pick a term present
      const key = painSignals.find(sig => lower.includes(sig)) || 'problem';
      if (!painCandidates[key]) painCandidates[key] = {count:0, examples:new Set()};
      painCandidates[key].count++;
      if (painCandidates[key].examples.size < 3) painCandidates[key].examples.add(p.title.substring(0,120));
    }
  });
  const pain_points_heuristic = Object.entries(painCandidates).map(([k,v]) => ({
    title: k.charAt(0).toUpperCase()+k.slice(1),
    frequency: clamp(v.count*15, 10, 95),
    urgency: v.count > 5 ? 'high' : v.count > 2 ? 'medium' : 'low',
    examples: Array.from(v.examples)
  })).slice(0,6);

  // 4. Optional OpenAI enrichment
  let enriched: Partial<ReturnType<typeof buildBaseResponse>> | null = null;
  if (process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const samplePosts = fetchedPosts.slice(0,12).map(p => `- ${p.title}`).join('\n');
      const system = 'You are a startup market validation analyst. Return ONLY valid JSON.';
      const user = `Startup Idea: ${input.idea}\nIndustry: ${input.industry || 'Unknown'}\nTarget Audience: ${input.targetAudience || 'General'}\nPosts Sample (titles):\n${samplePosts}\n\nUsing the sample, extract: keywords (<=10), 3-6 pain points (title, frequency 10-95, urgency low|medium|high, examples array), 1-2 app ideas (title, description, market_validation low|medium|high, difficulty easy|medium|hard), 1-3 competitors (name, description, strengths[], weaknesses[], market_share, pricing_model), 1-2 revenue models (model_type, description, pros[], cons[], implementation_difficulty easy|medium|hard, potential_revenue High|Medium|Moderate). Return JSON with keys: keywords, pain_points, app_ideas, competitors, revenue_models.`;
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [ { role:'system', content: system }, { role:'user', content: user } ],
        temperature: 0.5,
        response_format: { type: 'json_object' }
      });
      const raw = completion.choices[0].message.content || '{}';
      enriched = JSON.parse(raw);
    } catch (e) {
      console.warn('OpenAI enrichment failed:', (e as Error).message);
    }
  }

  // 5. Build response
  const response = buildBaseResponse({
    idea: input.idea,
    industry: input.industry,
    targetAudience: input.targetAudience,
    isAI, isFitness, tokens,
    keywords: enriched?.keywords || frequentTerms.slice(0,7),
    subreddits,
    pain_points: (enriched?.pain_points as any) || pain_points_heuristic.length ? pain_points_heuristic : [
      { title: 'Validation Gap', frequency: 55, urgency: 'medium', examples: ['Need better evidence for idea viability'] }
    ],
    app_ideas: (enriched?.app_ideas as any) || [
      { title: `Smart ${tokens[0]||'Market'} Analyzer`, description: 'Tool that synthesizes community signals into actionable validation metrics', market_validation: 'medium', difficulty: isAI ? 'hard' : 'medium' }
    ],
    competitors: (enriched?.competitors as any) || [
      { name: 'Generic Tools', description: 'Existing broad solutions lacking niche focus', strengths: ['Brand'], weaknesses: ['Low specialization'], market_share: 'Fragmented', pricing_model: 'Subscription' }
    ],
    revenue_models: (enriched?.revenue_models as any) || [
      { model_type: 'Subscription', description: 'Monthly access to analysis dashboard', pros: ['Predictable revenue'], cons: ['Churn risk'], implementation_difficulty: 'medium', potential_revenue: 'Medium' }
    ],
    fetchedPosts
  });

  const durationMs = Date.now() - started;
  (response as any).debug = { postsFetched: fetchedPosts.length, enriched: !!enriched, ms: durationMs };
  return response;
}

function buildBaseResponse(params: { idea: string; industry?: string; targetAudience?: string; isAI: boolean; isFitness: boolean; tokens: string[]; keywords: string[]; subreddits: string[]; pain_points: any[]; app_ideas: any[]; competitors: any[]; revenue_models: any[]; fetchedPosts: RawRedditPost[]; }) {
  const { isAI, isFitness, keywords, subreddits, pain_points, app_ideas, competitors, revenue_models, fetchedPosts, tokens } = params;
  // Sentiment heuristic based on post scores/comments
  const avgScore = fetchedPosts.length ? fetchedPosts.reduce((a,p)=>a+p.score,0)/fetchedPosts.length : 10;
  const avgComments = fetchedPosts.length ? fetchedPosts.reduce((a,p)=>a+p.num_comments,0)/fetchedPosts.length : 2;
  const enthusiasm = clamp(Math.round((avgScore/50)*60 + (avgComments/30)*20), 20, 70);
  const frustration = clamp( Math.round(pain_points.length*7 + (30 - enthusiasm)/2), 10, 40);
  const mixed = clamp(100 - enthusiasm - frustration, 10, 50);

  const sentiment_data = [
    { name: 'Enthusiastic', value: enthusiasm, color: 'hsl(var(--chart-2))', description: 'Positive market excitement & interest' },
    { name: 'Curious/Mixed', value: mixed, color: 'hsl(var(--chart-3))', description: 'Questions & evaluation behavior' },
    { name: 'Frustrated', value: frustration, color: 'hsl(var(--destructive))', description: 'Pain points & unmet needs' }
  ];

  // Scores
  const signalStrength = clamp( (enthusiasm + mixed/2) / 20, 2, 9 );
  const painDepth = clamp( (frustration/10) + pain_points.length, 2, 9 );
  const overall_score = clamp( (signalStrength*0.55 + painDepth*0.45), 1, 10 );
  const viability_score = clamp(overall_score - 0.5 + (isAI ? 0.8 : 0) + (isFitness ? 0.3 : 0), 1, 10);

  const google_trends = [
    {
      keyword: keywords[0] || tokens[0] || 'startup',
      trend_direction: isAI ? 'rising' : 'stable',
      interest_level: clamp(Math.round(overall_score*9),0,100),
      related_queries: keywords.slice(1,4)
    }
  ];

  return {
    keywords,
    subreddits,
    sentiment_data,
    pain_points,
    app_ideas: app_ideas.map(a => ({
      title: a.title,
      description: a.description,
      market_validation: a.market_validation || (overall_score>7 ? 'high': overall_score>5 ? 'medium':'low'),
      difficulty: a.difficulty || (isAI ? 'hard':'medium')
    })),
    google_trends,
    icp: {
      demographics: { age_range: isFitness ? '25-45' : isAI ? '28-40':'25-40', gender: 'Mixed', income_level: isAI ? 'High':'Middle to High', education: 'College Graduate' },
      psychographics: { interests: keywords.slice(0,3), values: ['Innovation','Efficiency','Growth'], lifestyle: isAI ? 'Tech-forward professional' : isFitness ? 'Health-conscious achiever':'Modern digital native' },
      behavioral: { pain_points: pain_points.map(p=>p.title), preferred_channels: ['Reddit','Communities','Search'], buying_behavior: 'Research & community influenced' }
    },
    problem_statements: [
      { problem: `${params.targetAudience || 'Users'} face recurring challenges related to ${params.idea.toLowerCase().split(' ').slice(0,6).join(' ')}`,
        impact: 'Leads to inefficiency and lost opportunity',
        evidence: pain_points.slice(0,3).map(p=>p.title),
        market_size: `Growing ${params.industry || 'technology'} interest signaled by community discussions` }
    ],
    financial_risks: [
      { risk_type:'Market Adoption', severity: overall_score<6 ? 'high': overall_score<8 ? 'medium':'low', description:'Need to convert curiosity into sustained usage', mitigation_strategy:'Ship focused MVP, rapid iteration, prove retention metrics' }
    ],
    competitors: competitors.map(c => ({
      name: c.name,
      description: c.description || 'Alternative solution in adjacent space',
      strengths: c.strengths || ['Brand'],
      weaknesses: c.weaknesses || ['Limited specialization'],
      market_share: c.market_share || 'Fragmented',
      pricing_model: c.pricing_model || 'Subscription'
    })),
    revenue_models: revenue_models.map(r => ({
      model_type: r.model_type,
      description: r.description,
      pros: r.pros || ['Scalable'],
      cons: r.cons || ['Churn risk'],
      implementation_difficulty: r.implementation_difficulty || (isAI ? 'hard':'medium'),
      potential_revenue: r.potential_revenue || (overall_score>7 ? 'High': overall_score>5 ? 'Medium':'Moderate')
    })),
    market_interest_level: overall_score>7.5 ? 'high' : overall_score>5.5 ? 'medium':'low',
    total_posts_analyzed: fetchedPosts.length,
    overall_score,
    viability_score
  };
}
