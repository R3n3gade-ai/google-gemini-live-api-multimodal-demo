# PowerShell script to start Google Gemini Live API Multimodal Demo

Write-Host "Starting Google Gemini Live API Multimodal Demo" -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

# Stop any existing Python processes related to our app
Write-Host "Stopping any existing Python processes..." -ForegroundColor Yellow
try {
    Stop-Process -Name python -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
} catch {
    # No processes to kill
}

# Make sure dependencies are installed
Write-Host "Checking dependencies..." -ForegroundColor Green
Set-Location -Path ".\backend"
pip install -r requirements.txt | Out-Null

# Start backend server in a new window
Write-Host "Starting backend server..." -ForegroundColor Green
$serverProcess = Start-Process -FilePath "python" -ArgumentList "app.py" -PassThru -WindowStyle Normal

Write-Host "Backend server started (PID: $($serverProcess.Id))" -ForegroundColor Green

# Wait for server to start
Write-Host "Waiting for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Open browser automatically
Write-Host "Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:8000"

Write-Host "App is running!" -ForegroundColor Cyan
Write-Host ""
Write-Host "USAGE INSTRUCTIONS:" -ForegroundColor Green
Write-Host "1. Close the System Prompt modal if it appears" -ForegroundColor White
Write-Host "2. To access Composio integrations, click on 'Connections' tab in the right panel" -ForegroundColor White
Write-Host "3. Click on any service (Gmail, Google Drive, etc.) to connect via Composio OAuth" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Yellow
Write-Host "For real Composio integration, set these environment variables:" -ForegroundColor White
Write-Host "- COMPOSIO_API_KEY: Your Composio API key from composio.dev" -ForegroundColor White
Write-Host "- GEMINI_API_KEY: Your Google Gemini API key" -ForegroundColor White
Write-Host ""
Write-Host "To stop the app, close this terminal or press Ctrl+C and then run:" -ForegroundColor Yellow
Write-Host "Stop-Process -Name python -Force" -ForegroundColor Yellow

# Keep the script running until the server is stopped
try {
    Wait-Process -Id $serverProcess.Id
} catch {
    Write-Host "Server process has ended." -ForegroundColor Red
}