# Test script for AI Comment Generator
# This script tests all the different AI personality styles

Write-Host "Testing AI Comment Generator API" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

$baseUrl = "http://localhost:3001/api/v1/comments"
$testComment = "This video is absolutely amazing! Best tutorial ever!"

$styles = @("nice", "funny", "mean", "sarcastic", "professional", "casual")

foreach ($style in $styles) {
    Write-Host "`nTesting style: $style" -ForegroundColor Yellow
    Write-Host "-------------------" -ForegroundColor Yellow
    
    $body = @{
        comment = $testComment
        style = $style
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $baseUrl -Method POST -ContentType "application/json" -Body $body
        Write-Host "Response: $($response.response)" -ForegroundColor White
        Write-Host "Style: $($response.style)" -ForegroundColor Gray
        Write-Host "Is Test: $($response.isTest)" -ForegroundColor Gray
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n`nTesting with different comments:" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

$testComments = @(
    "This video sucks!",
    "I love this content!",
    "Can someone explain the second part?",
    "First comment!"
)

foreach ($comment in $testComments) {
    Write-Host "`nComment: $comment" -ForegroundColor Yellow
    Write-Host "Style: sarcastic" -ForegroundColor Yellow
    Write-Host "-------------------" -ForegroundColor Yellow
    
    $body = @{
        comment = $comment
        style = "sarcastic"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $baseUrl -Method POST -ContentType "application/json" -Body $body
        Write-Host "Response: $($response.response)" -ForegroundColor White
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}