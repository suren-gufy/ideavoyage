# Test exactly what the frontend sends to the API
$headers = @{
    'Content-Type' = 'application/json'
    'credentials' = 'include'
}

$body = @{
    idea = "My two year old bootstrapped startup does $1.7 million per year profit with one employee and I'm considering leaving. Wh"
    industry = ""
    targetAudience = ""
    country = "global"
    platform = "web-app" 
    fundingMethod = "self-funded"
    timeRange = "month"
} | ConvertTo-Json

try {
    Write-Host "Testing with EXACT frontend parameters..."
    Write-Host "Body: $body"
    
    $response = Invoke-RestMethod -Uri "https://ideavoyage.vercel.app/api" -Method POST -Body $body -Headers $headers
    
    Write-Host "`n=== FRONTEND-STYLE API RESPONSE ==="
    Write-Host "Analysis Confidence: $($response.analysis_confidence)"
    Write-Host "Data Source: $($response.data_source)"
    Write-Host "Overall Score: $($response.overall_score)"
    Write-Host "Notes: $($response.notes)"
    
    if ($response.debug) {
        Write-Host "`n=== DEBUG INFO ==="
        Write-Host "Posts Fetched: $($response.debug.postsFetched)"
        Write-Host "Real Posts: $($response.debug.realPosts)"
        Write-Host "Synthetic Posts: $($response.debug.syntheticPosts)"
        Write-Host "Reddit OAuth Used: $($response.debug.reddit_oauth_used)"
        Write-Host "Reddit Creds Available: $($response.debug.reddit_creds_available)"
        Write-Host "Mode: $($response.debug.mode)"
        Write-Host "OpenAI Available: $($response.debug.openai_available)"
        Write-Host "API Version: $($response.debug.api_version)"
    }
    
    if ($response.evidence) {
        Write-Host "`n=== EVIDENCE ==="
        Write-Host "Real Post Count: $($response.evidence.real_post_count)"
        Write-Host "Synthetic Post Count: $($response.evidence.synthetic_post_count)"
        Write-Host "Subreddits Used: $($response.evidence.subreddits_used -join ', ')"
    }
    
    # Check what would trigger demo mode in frontend
    Write-Host "`n=== FRONTEND DEMO CHECK ==="
    $isDemoMode = ($response.data_source -eq 'synthetic_only') -and ($response.analysis_confidence -ne 'ai_enhanced')
    Write-Host "Would show demo mode: $isDemoMode"
    Write-Host "Condition 1 - data_source is 'synthetic_only': $($response.data_source -eq 'synthetic_only')"
    Write-Host "Condition 2 - analysis_confidence is NOT 'ai_enhanced': $($response.analysis_confidence -ne 'ai_enhanced')"
    
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
}