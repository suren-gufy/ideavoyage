# Comprehensive Reddit Analysis Test
$headers = @{
    'Content-Type' = 'application/json'
}

# Test with a clear idea that should have good Reddit data
$body = @{
    idea = "AI-powered fitness app that creates personalized workout plans"
    industry = "fitness"
    targetAudience = "young professionals"
    country = "global"
    platform = "web-app" 
    fundingMethod = "self-funded"
    timeRange = "month"
} | ConvertTo-Json

try {
    Write-Host "=== TESTING REDDIT ANALYSIS FUNCTIONALITY ==="
    Write-Host "Testing idea: AI-powered fitness app"
    Write-Host ""
    
    $response = Invoke-RestMethod -Uri "https://ideavoyage.vercel.app/api" -Method POST -Body $body -Headers $headers
    
    Write-Host "✅ API RESPONSE RECEIVED"
    Write-Host "Analysis Confidence: $($response.analysis_confidence)"
    Write-Host "Data Source: $($response.data_source)"
    Write-Host "Overall Score: $($response.overall_score)"
    Write-Host "Viability Score: $($response.viability_score)"
    Write-Host ""
    
    # Reddit Analysis Check
    if ($response.debug) {
        Write-Host "=== REDDIT DATA ANALYSIS ==="
        Write-Host "Posts Fetched: $($response.debug.postsFetched)"
        Write-Host "Real Reddit Posts: $($response.debug.realPosts)"
        Write-Host "Synthetic Posts: $($response.debug.syntheticPosts)"
        Write-Host "Reddit OAuth Used: $($response.debug.reddit_oauth_used)"
        Write-Host "Reddit Creds Available: $($response.debug.reddit_creds_available)"
        Write-Host "Mode: $($response.debug.mode)"
        Write-Host "OpenAI Available: $($response.debug.openai_available)"
        Write-Host "API Version: $($response.debug.api_version)"
        Write-Host ""
    }
    
    # Subreddits Analysis
    if ($response.subreddits) {
        Write-Host "=== SUBREDDITS FOUND ==="
        Write-Host "Count: $($response.subreddits.length)"
        Write-Host "List: $($response.subreddits -join ', ')"
        Write-Host ""
    }
    
    # Pain Points Analysis
    if ($response.pain_points) {
        Write-Host "=== PAIN POINTS ANALYSIS ==="
        Write-Host "Pain Points Count: $($response.pain_points.length)"
        if ($response.pain_points.length -gt 0) {
            for ($i = 0; $i -lt [Math]::Min(3, $response.pain_points.length); $i++) {
                $pp = $response.pain_points[$i]
                Write-Host "Pain Point $($i + 1):"
                Write-Host "  Title: $($pp.title)"
                Write-Host "  Frequency: $($pp.frequency)"
                Write-Host "  Urgency: $($pp.urgency)"
                if ($pp.examples) {
                    Write-Host "  Examples Count: $($pp.examples.length)"
                }
                Write-Host ""
            }
        } else {
            Write-Host "⚠️  No pain points found"
        }
    }
    
    # Evidence Analysis
    if ($response.evidence) {
        Write-Host "=== EVIDENCE SUMMARY ==="
        Write-Host "Real Post Count: $($response.evidence.real_post_count)"
        Write-Host "Synthetic Post Count: $($response.evidence.synthetic_post_count)"
        Write-Host "Subreddits Used: $($response.evidence.subreddits_used -join ', ')"
        
        if ($response.evidence.sample_reddit_posts) {
            Write-Host ""
            Write-Host "=== SAMPLE REDDIT POSTS ==="
            for ($i = 0; $i -lt [Math]::Min(3, $response.evidence.sample_reddit_posts.length); $i++) {
                $post = $response.evidence.sample_reddit_posts[$i]
                Write-Host "Post $($i + 1): '$($post.title)' ($($post.score) upvotes, $($post.comments) comments) - r/$($post.subreddit)"
            }
        }
    }
    
    # Analysis Quality Check
    Write-Host ""
    Write-Host "=== ANALYSIS QUALITY CHECK ==="
    
    # Check if it's using real Reddit data
    $usingRealData = $response.data_source -eq "real_reddit_data" -or $response.data_source -eq "reddit_plus_ai"
    Write-Host "Using Real Reddit Data: $(if ($usingRealData) { '✅ YES' } else { '❌ NO' })"
    
    # Check if Reddit OAuth is working
    $oauthWorking = $response.debug.reddit_oauth_used -eq $true
    Write-Host "Reddit OAuth Working: $(if ($oauthWorking) { '✅ YES' } else { '❌ NO' })"
    
    # Check if we have real posts
    $hasRealPosts = $response.debug.realPosts -gt 0
    Write-Host "Has Real Posts: $(if ($hasRealPosts) { "✅ YES ($($response.debug.realPosts) posts)" } else { '❌ NO' })"
    
    # Check analysis confidence
    $highConfidence = $response.analysis_confidence -eq "high" -or $response.analysis_confidence -eq "premium_enhanced"
    Write-Host "High Confidence: $(if ($highConfidence) { '✅ YES' } else { '❌ NO' })"
    
    # Overall status
    Write-Host ""
    if ($usingRealData -and $oauthWorking -and $hasRealPosts -and $highConfidence) {
        Write-Host "🎯 OVERALL STATUS: ✅ REDDIT ANALYSIS FULLY WORKING"
    } elseif ($usingRealData -and $hasRealPosts) {
        Write-Host "🎯 OVERALL STATUS: ⚠️  REDDIT ANALYSIS PARTIALLY WORKING"
    } else {
        Write-Host "🎯 OVERALL STATUS: ❌ REDDIT ANALYSIS NOT WORKING"
    }
    
} catch {
    Write-Host ""
    Write-Host "=== ERROR DETECTED ==="
    Write-Host "❌ Error Message: $($_.Exception.Message)"
    Write-Host "❌ Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "❌ REDDIT ANALYSIS: FAILED"
}