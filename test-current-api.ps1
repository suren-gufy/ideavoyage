# Test the current API to see what's happening
$headers = @{
    'Content-Type' = 'application/json'
}

$body = @{
    idea = "AI-powered fitness app that creates personalized workout plans"
    industry = "fitness"
    targetAudience = "young professionals"
} | ConvertTo-Json

try {
    Write-Host "Testing current API with fitness app idea..."
    $response = Invoke-RestMethod -Uri "https://ideavoyage.vercel.app/api" -Method POST -Body $body -Headers $headers
    
    Write-Host "`n=== API Response Analysis ==="
    Write-Host "Analysis Confidence: $($response.analysis_confidence)"
    Write-Host "Data Source: $($response.data_source)"
    Write-Host "Overall Score: $($response.overall_score)"
    Write-Host "Notes: $($response.notes)"
    
    if ($response.debug) {
        Write-Host "`n=== Debug Info ==="
        Write-Host "Posts Fetched: $($response.debug.postsFetched)"
        Write-Host "Real Posts: $($response.debug.realPosts)"
        Write-Host "Synthetic Posts: $($response.debug.syntheticPosts)"
        Write-Host "Reddit OAuth Used: $($response.debug.reddit_oauth_used)"
        Write-Host "Reddit Creds Available: $($response.debug.reddit_creds_available)"
        Write-Host "Mode: $($response.debug.mode)"
        Write-Host "OpenAI Available: $($response.debug.openai_available)"
    }
    
    if ($response.evidence) {
        Write-Host "`n=== Evidence ==="
        Write-Host "Real Post Count: $($response.evidence.real_post_count)"
        Write-Host "Synthetic Post Count: $($response.evidence.synthetic_post_count)"
        Write-Host "Subreddits Used: $($response.evidence.subreddits_used -join ', ')"
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode)"
}