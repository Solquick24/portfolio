# S3에 사이트 파일을 올리고 CloudFront 캐시를 무효화한다.
# 사용법: ./scripts/deploy.ps1
param(
  [string]$Bucket = "solquick24-portfolio",
  [string]$DistributionId = "E3EBX10YEJY6LC"
)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

aws s3 sync $root "s3://$Bucket" `
  --exclude ".git/*" --exclude ".claude/*" --exclude "scripts/*" `
  --exclude "README.md" --exclude "CLAUDE.md" --exclude ".gitignore"

if ($DistributionId) {
  aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*"
} else {
  Write-Host "DistributionId가 없어 캐시 무효화는 건너뛴다."
}
