# Test the specific idea about to-do list for designers
$headers = @{
    'Content-Type' = 'application/json'
}

$body = @{
    idea = "to-do-list for designer to keep track of there work"
    industry = ""
    targetAudience = ""
    country = "global"
    platform = "web-app" 
    fundingMethod = "self-funded"
    timeRange = "month"
} | ConvertTo-Json

try {
    Write-Host "Testing to-do list for designers idea..."
    Write-Host "Request body: $body"
    
    $response = Invoke-RestMethod -Uri "https://ideavoyage.vercel.app/api" -Method POST -Body $body -Headers $headers
    
    Write-Host "`n=== API RESPONSE STATUS ==="
    Write-Host "Success: API returned data"
    Write-Host "Analysis Confidence: $($response.analysis_confidence)"
    Write-Host "Data Source: $($response.data_source)"
    Write-Host "Overall Score: $($response.overall_score)"
    Write-Host "Viability Score: $($response.viability_score)"
    
    if ($response.debug) {
        Write-Host "`n=== DEBUG INFO ==="
        Write-Host "Posts Fetched: $($response.debug.postsFetched)"
        Write-Host "Real Posts: $($response.debug.realPosts)"
        Write-Host "Synthetic Posts: $($response.debug.syntheticPosts)"
        Write-Host "Reddit OAuth Used: $($response.debug.reddit_oauth_used)"
        Write-Host "Mode: $($response.debug.mode)"
        Write-Host "API Version: $($response.debug.api_version)"
    }
    
    if ($response.subreddits) {
        Write-Host "`n=== SUBREDDITS FOUND ==="
        Write-Host "Subreddits: $($response.subreddits -join ', ')"
    }
    
    if ($response.pain_points) {
        Write-Host "`n=== PAIN POINTS FOUND ==="
        Write-Host "Pain Points Count: $($response.pain_points.length)"
        $response.pain_points | ForEach-Object { Write-Host "- $($_.pain_point)" }
    }
    
    Write-Host "`n=== FRONTEND DEMO CHECK ==="
    $isDemoMode = ($response.data_source -eq 'synthetic_only') -and ($response.analysis_confidence -ne 'ai_enhanced')
    Write-Host "Would show demo mode: $isDemoMode"
    
} catch {
    Write-Host "`n=== ERROR DETECTED ==="
    Write-Host "Error Message: $($_.Exception.Message)"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Response Content: $($_.Exception.Response.Content)"
}