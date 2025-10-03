# Test the EXACT same idea from the screenshot
$headers = @{
    'Content-Type' = 'application/json'
}

$body = @{
    idea = "My two year old bootstrapped startup does 1.7 million per year profit with one employee and I'm considering leaving. Wh"  # Truncated as shown in screenshot
} | ConvertTo-Json

try {
    Write-Host "Testing with the EXACT idea from screenshot..."
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
        Write-Host "Mode: $($response.debug.mode)"
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}