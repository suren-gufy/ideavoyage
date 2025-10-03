/**
 * Test the deployed API with Perplexity configuration
 * Should now use ai_enhanced mode instead of synthetic_only
 */

async function testPerplexityAPI() {
    console.log('Testing deployed API with Perplexity configuration...\n');
    
    const testIdea = "AI-powered fitness app";
    const testUrl = `https://ideavoyage.vercel.app/api?idea=${encodeURIComponent(testIdea)}`;
    
    try {
        console.log(`Testing URL: ${testUrl}\n`);
        
        const response = await fetch(testUrl);
        const data = await response.json();
        
        console.log('=== API Response Analysis ===');
        console.log(`Status: ${response.status}`);
        console.log(`Analysis Mode: ${data.metadata?.analysisMode || 'Not specified'}`);
        console.log(`Data Source: ${data.metadata?.dataSource || 'Not specified'}`);
        console.log(`AI Provider: ${data.metadata?.aiProvider || 'Not specified'}`);
        console.log(`Keyword Fallback: ${data.metadata?.keywordFallback || 'Not specified'}\n`);
        
        // Check if we're getting real analysis instead of demo
        if (data.metadata?.analysisMode === 'ai_enhanced') {
            console.log('✅ SUCCESS: Using AI-enhanced analysis mode with Perplexity!');
        } else if (data.metadata?.analysisMode === 'synthetic_only') {
            console.log('❌ ISSUE: Still using synthetic_only mode (demo data)');
            console.log('This suggests the API is not recognizing Perplexity as a valid AI provider');
        } else {
            console.log('⚠️  UNKNOWN: Analysis mode not clearly specified');
        }
        
        // Show a sample of the analysis
        console.log('\n=== Sample Analysis Data ===');
        if (data.analysis) {
            console.log('Market Analysis:', data.analysis.marketAnalysis?.slice(0, 150) + '...');
            console.log('Competition:', data.analysis.competition?.slice(0, 150) + '...');
        }
        
        // Check Reddit data source
        if (data.redditData && data.redditData.posts) {
            console.log(`\nReddit Posts Found: ${data.redditData.posts.length}`);
            if (data.redditData.posts.length > 0) {
                console.log('✅ Reddit data integration working');
            }
        }
        
    } catch (error) {
        console.error('❌ Error testing API:', error.message);
    }
}

testPerplexityAPI();