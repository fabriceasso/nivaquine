<#
  Mise en ligne du site NIVAQUINE sur Cloudflare Pages
  -----------------------------------------------------
  Usage :  .\deploy.ps1
  Prérequis : npx wrangler login (une seule fois)
#>

$ErrorActionPreference = 'Stop'

$project = 'nivaquine'
$stage   = '_deploy'
$root    = $PSScriptRoot

# 1. Fichiers et dossiers publiés
$assets = @(
  'index.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'styles.css',
  'script.js',
  'pics'
)

# Images inutilisées par le site (exclues de la publication)
$skipPatterns = @(
  'Gemini_Generated_Image_*.jfif',
  'Cartographie futuriste*',
  'logo_nivaquine_blanc.png',
  'logo_nivaquine_noir.png',
  '1x'
)

# 2. Reconstruction du dossier de publication
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Path $stage | Out-Null

foreach ($a in $assets) {
  $src = Join-Path $root $a
  if (-not (Test-Path $src)) { throw "Fichier introuvable : $a" }
  Copy-Item $src (Join-Path $stage $a) -Recurse
}

foreach ($pattern in $skipPatterns) {
  Get-ChildItem -Path (Join-Path $stage 'pics') -Filter $pattern -File -ErrorAction SilentlyContinue |
    Remove-Item -Force
}

$size = [math]::Round(((Get-ChildItem $stage -Recurse -File | Measure-Object Length -Sum).Sum / 1MB), 2)
Write-Host "Dossier de publication pret : $stage ($size Mo)" -ForegroundColor Cyan

# 3. Déploiement sur Cloudflare Pages
npx wrangler pages deploy $stage --project-name $project --branch main
