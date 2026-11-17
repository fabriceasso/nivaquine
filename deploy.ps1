<#
  Mise en ligne du site NIVAQUINE
  -----------------------------------------------------
  Le projet Cloudflare Pages est connecté au dépôt GitHub :
  tout push sur la branche `main` déclenche automatiquement
  un build et un déploiement sur nivaquine.com.

  Usage :
    .\deploy.ps1                    # committe tout + push (message par défaut)
    .\deploy.ps1 "Mon message"      # committe tout + push avec un message
    .\deploy.ps1 -NoCommit          # push seulement (si déjà committé)
#>

param(
  [string]$Message = 'Mise a jour du site',
  [switch]$NoCommit
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

# 1. État du dépôt
$branch = git rev-parse --abbrev-ref HEAD
if ($branch -ne 'main') {
  Write-Warning "Vous etes sur la branche '$branch' (production = main)."
}

$dirty = git status --porcelain
if ($dirty) {
  if ($NoCommit) {
    Write-Error "Modifications non committees en attente :`n$dirty`nLancez sans -NoCommit."
  }
  Write-Host "Commit des modifications..." -ForegroundColor Cyan
  git add -A
  git commit -m $Message
} elseif (-not $NoCommit) {
  Write-Host "Rien a committer." -ForegroundColor DarkGray
}

# 2. Push → déploiement automatique Cloudflare Pages
Write-Host "Push vers GitHub (deploiement automatique)..." -ForegroundColor Cyan
git push

Write-Host ""
Write-Host "Deploiement declenche." -ForegroundColor Green
Write-Host "Suivi en direct : https://dash.cloudflare.com/?to=/:account/workers-and-pages" -ForegroundColor DarkGray
Write-Host "  -> projet 'nivaquine' -> Build & deployments" -ForegroundColor DarkGray
Write-Host "  ou : npx wrangler pages deployment list --project-name nivaquine" -ForegroundColor DarkGray
