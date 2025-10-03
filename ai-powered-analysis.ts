// 🤖 TRUE AI-POWERED UNIVERSAL STARTUP ANALYSIS
// This replaces the limited keyword system with intelligent AI analysis

const analyzeStartupWithAI = async (idea: string) => {
  console.log('🤖 Starting AI-powered universal startup analysis...');
  console.log(`🎯 Analyzing idea: "${idea}"`);
  
  const hasPerplexityKey = !!process.env.PERPLEXITY_API_KEY?.trim();
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY?.trim();
  
  console.log(`🔑 AI Keys available: Perplexity=${hasPerplexityKey}, OpenAI=${hasOpenAIKey}`);
  
  // Try AI-powered analysis first
  if (hasPerplexityKey || hasOpenAIKey) {
    try {
      const aiPrompt = `Analyze this startup idea and provide comprehensive market research data:

Startup Idea: "${idea}"

Please provide detailed analysis in JSON format:
{
  "industry": "Primary industry/domain",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "subreddits": ["subreddit1", "subreddit2", "subreddit3", "subreddit4", "subreddit5", "subreddit6"],
  "target_audience": "Description of target users",
  "market_size": "Estimated market size (e.g., '$50B globally')",
  "business_model": "Suggested business model (subscription, marketplace, etc.)",
  "key_competitors": ["competitor1", "competitor2", "competitor3"],
  "unique_value": "What makes this idea unique",
  "main_challenges": ["challenge1", "challenge2", "challenge3"],
  "revenue_potential": "High/Medium/Low with reasoning",
  "reasoning": "Why these subreddits and analysis are relevant"
}`;

      let aiResponse;
      
      if (hasPerplexityKey) {
        console.log('🔥 Using Perplexity AI for analysis...');
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              { role: 'system', content: 'You are an expert startup analyst. Always respond with properly formatted JSON.' },
              { role: 'user', content: aiPrompt }
            ],
            max_tokens: 1500,
            temperature: 0.1
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          const content = result.choices[0].message.content;
          // Extract JSON from response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            aiResponse = JSON.parse(jsonMatch[0]);
          }
        }
      } else if (hasOpenAIKey) {
        console.log('🔥 Using OpenAI for analysis...');
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are an expert startup analyst. Always respond with valid JSON.' },
              { role: 'user', content: aiPrompt }
            ],
            max_tokens: 1500,
            temperature: 0.1,
            response_format: { type: 'json_object' }
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          aiResponse = JSON.parse(result.choices[0].message.content);
        }
      }
      
      if (aiResponse && aiResponse.subreddits) {
        console.log('✅ AI ANALYSIS SUCCESS!');
        console.log(`   🏭 Industry: ${aiResponse.industry}`);
        console.log(`   💰 Market Size: ${aiResponse.market_size}`);
        console.log(`   🔤 Keywords: [${aiResponse.keywords?.slice(0, 5).join(', ') || 'N/A'}]`);
        console.log(`   📋 AI-suggested subreddits: [${aiResponse.subreddits?.slice(0, 6).join(', ')}]`);
        console.log(`   👥 Target: ${aiResponse.target_audience}`);
        console.log(`   💼 Business Model: ${aiResponse.business_model}`);
        console.log(`   📈 Revenue Potential: ${aiResponse.revenue_potential}`);
        
        return {
          success: true,
          data: aiResponse,
          subreddits: aiResponse.subreddits.slice(0, 8)
        };
      }
      
    } catch (aiError: unknown) {
      const errorMessage = aiError instanceof Error ? aiError.message : 'Unknown error';
      console.log(`⚠️ AI analysis failed: ${errorMessage}`);
    }
  }
  
  // Enhanced fallback system for when AI isn't available
  console.log('🔄 Using enhanced keyword fallback system...');
  
  const tokens = idea
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .map(word => word.replace(/-/g, ''));
    
  console.log(`📝 Key tokens: [${tokens.slice(0, 8).join(', ')}]`);
  
  // Comprehensive keyword mapping
  const keywordMap: { [key: string]: string[] } = {
    // AI & Technology
    'ai': ['MachineLearning', 'artificial', 'ChatGPT', 'singularity', 'technology', 'futurology'],
    'artificial': ['artificial', 'MachineLearning', 'singularity', 'technology', 'ChatGPT'],
    'blockchain': ['CryptoCurrency', 'Bitcoin', 'ethereum', 'CryptoMarkets', 'defi', 'CryptoTechnology'],
    'crypto': ['CryptoCurrency', 'Bitcoin', 'ethereum', 'CryptoMarkets', 'defi', 'BitcoinBeginners'],
    
    // Health & Wellness
    'health': ['Health', 'fitness', 'HealthyFood', 'nutrition', 'wellness', 'medical'],
    'medical': ['medicine', 'healthcare', 'AskDocs', 'Health', 'nursing', 'medicalschool'],
    'fitness': ['fitness', 'loseit', 'bodyweightfitness', 'getmotivated', 'Health', 'Fitness'],
    'mental': ['mentalhealth', 'anxiety', 'depression', 'therapy', 'psychology'],
    
    // Business & Finance
    'finance': ['personalfinance', 'investing', 'SecurityAnalysis', 'StockMarket', 'financialindependence'],
    'business': ['Entrepreneur', 'smallbusiness', 'startups', 'business', 'marketing'],
    'startup': ['startups', 'Entrepreneur', 'business', 'smallbusiness', 'ycombinator'],
    'ecommerce': ['ecommerce', 'shopify', 'FulfillmentByAmazon', 'dropship', 'Entrepreneur'],
    
    // Technology & Development
    'app': ['webdev', 'mobiledev', 'technology', 'SaaS', 'programming', 'reactjs'],
    'software': ['programming', 'webdev', 'technology', 'SoftwareEngineering', 'coding'],
    'platform': ['webdev', 'technology', 'SaaS', 'Entrepreneur', 'startups', 'programming'],
    'web': ['webdev', 'web_design', 'technology', 'javascript', 'reactjs'],
    
    // Creative & Media
    'design': ['Design', 'graphic_design', 'web_design', 'UI_Design', 'userexperience'],
    'music': ['WeAreTheMusicMakers', 'edmproduction', 'musicians', 'trapproduction', 'makinghiphop'],
    'photo': ['photography', 'photocritique', 'itookapicture', 'AskPhotography', 'portraits'],
    'video': ['videography', 'VideoEditing', 'filmmakers', 'cinematography'],
    
    // Lifestyle & Services
    'food': ['Cooking', 'recipes', 'MealPrepSunday', 'food', 'nutrition', 'KitchenConfidential'],
    'travel': ['travel', 'solotravel', 'backpacking', 'digitalnomad', 'flights'],
    'education': ['education', 'GetStudying', 'Teachers', 'OnlineEducation', 'studytips'],
    'pet': ['pets', 'dogs', 'cats', 'DogTraining', 'AskVet', 'puppy101'],
    
    // Real Estate & Property
    'real': ['RealEstate', 'realestateinvesting', 'FirstTimeHomeBuyer', 'landlord'],
    'estate': ['RealEstate', 'realestateinvesting', 'landlord', 'PropertyManagement'],
    'property': ['RealEstate', 'realestateinvesting', 'landlord', 'PropertyManagement'],
    
    // Gaming & Entertainment
    'game': ['gamedev', 'gaming', 'IndieGaming', 'Unity3D', 'unrealengine'],
    'gaming': ['gaming', 'gamedev', 'pcgaming', 'NintendoSwitch', 'PS5'],
    'stream': ['Twitch', 'streaming', 'content_creation', 'youtube', 'LivestreamFail'],
    
    // Social & Community
    'social': ['socialmedia', 'marketing', 'community', 'relationships', 'socialskills'],
    'dating': ['dating', 'relationships', 'datingoverthirty', 'Tinder', 'OnlineDating'],
    'community': ['community', 'socialmedia', 'ModSupport', 'relationships'],
    
    // Productivity & Work
    'productivity': ['productivity', 'getmotivated', 'selfimprovement', 'gtd', 'organization'],
    'work': ['careerguidance', 'jobs', 'cscareerquestions', 'ITCareerQuestions'],
    'organization': ['organization', 'productivity', 'lifehacks', 'bujo'],
    
    // Transportation & Automotive
    'car': ['cars', 'whatcarshouldIbuy', 'MechanicAdvice', 'AutoDetailing'],
    'transportation': ['transportation', 'transit', 'cars', 'bicycling'],
    'ride': ['uber', 'lyft', 'rideshare', 'transportation'],
    
    // Environment & Sustainability
    'environment': ['environment', 'sustainability', 'ZeroWaste', 'climatechange'],
    'green': ['sustainability', 'ZeroWaste', 'environment', 'renewable'],
    'sustainable': ['sustainability', 'ZeroWaste', 'environment', 'climatechange'],
    
    // Legal & Professional
    'legal': ['legaladvice', 'law', 'Ask_Lawyers', 'LawSchool'],
    'law': ['law', 'legaladvice', 'LawSchool', 'Ask_Lawyers'],
    
    // Special context-aware mappings
    'smart': ['gadgets', 'technology', 'smarthome', 'HomeAutomation'],
    'iot': ['InternetOfThings', 'gadgets', 'technology', 'smarthome'],
    'device': ['gadgets', 'technology', 'electronics', 'DIY'],
    'rental': ['sharingeconomy', 'Entrepreneur', 'realestateinvesting'],
    'sharing': ['sharingeconomy', 'Entrepreneur', 'startups', 'community'],
    'subscription': ['SaaS', 'Entrepreneur', 'startups', 'subscriptions'],
    'marketplace': ['Entrepreneur', 'startups', 'ecommerce', 'sharingeconomy']
  };
  
  // Find matching subreddits
  const matchedSubreddits = [];
  const matchedKeywords = [];
  
  for (const token of tokens) {
    if (keywordMap[token]) {
      console.log(`🎯 Matched "${token}" → [${keywordMap[token].slice(0, 3).join(', ')}...]`);
      matchedSubreddits.push(...keywordMap[token]);
      matchedKeywords.push(token);
    }
    
    // Check for partial matches in compound words
    for (const [keyword, subs] of Object.entries(keywordMap)) {
      if (token.includes(keyword) && keyword.length > 3) {
        console.log(`🎯 Partial match "${token}" contains "${keyword}"`);
        matchedSubreddits.push(...subs.slice(0, 3));
        matchedKeywords.push(keyword);
      }
    }
  }
  
  let finalSubreddits = [];
  
  if (matchedSubreddits.length > 0) {
    // Remove duplicates and prioritize by frequency
    const subredditCounts = matchedSubreddits.reduce((acc: {[key: string]: number}, sub) => {
      acc[sub] = (acc[sub] || 0) + 1;
      return acc;
    }, {});
    
    finalSubreddits = Object.entries(subredditCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 8)
      .map(([sub]) => sub);
      
    console.log(`✅ Enhanced analysis found ${finalSubreddits.length} communities`);
    console.log(`📝 Matched keywords: [${matchedKeywords.slice(0, 5).join(', ')}]`);
  } else {
    // Intelligent fallback based on idea characteristics
    console.log('🌐 Using intelligent pattern-based fallback...');
    
    const ideaLower = idea.toLowerCase();
    if (ideaLower.includes('smart') || ideaLower.includes('iot')) {
      finalSubreddits = ['gadgets', 'technology', 'smarthome', 'Entrepreneur', 'startups'];
    } else if (ideaLower.includes('app') || ideaLower.includes('mobile')) {
      finalSubreddits = ['webdev', 'mobiledev', 'technology', 'Entrepreneur', 'startups'];
    } else if (ideaLower.includes('ai') || ideaLower.includes('artificial')) {
      finalSubreddits = ['MachineLearning', 'artificial', 'technology', 'Entrepreneur', 'startups'];
    } else if (ideaLower.includes('marketplace') || ideaLower.includes('platform')) {
      finalSubreddits = ['Entrepreneur', 'startups', 'ecommerce', 'webdev', 'business'];
    } else {
      finalSubreddits = ['Entrepreneur', 'startups', 'business', 'technology', 'AskReddit'];
    }
    
    console.log('✅ Pattern-based communities selected');
  }
  
  return {
    success: false, // Indicates fallback was used
    data: {
      industry: 'General Business',
      keywords: matchedKeywords.slice(0, 5),
      target_audience: 'General consumers and businesses',
      business_model: 'To be determined based on market research'
    },
    subreddits: finalSubreddits
  };
};

export { analyzeStartupWithAI };