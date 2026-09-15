# Create a git worktree from origin/main after pruning.
# Usage:  .\scripts\new-worktree.ps1 feat/verifier-v0
param(
  [Parameter(Mandatory = $true)]
  [string]$Branch
)

$ErrorActionPreference = "Stop"
if ($Branch -eq "main") {
  Write-Error "Refusing to create a worktree named main."
}

git fetch -p
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$safe = $Branch -replace "[\\/]", "-"
$dest = Join-Path ".worktrees" $safe
New-Item -ItemType Directory -Force -Path ".worktrees" | Out-Null

if (Test-Path $dest) {
  Write-Error "Worktree already exists: $dest"
}

git worktree add $dest -b $Branch origin/main
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Worktree ready: $dest"
Write-Host "Next:  cd $dest"
Write-Host "Then:  git push -u origin HEAD; gh pr create --base main"
Write-Host "Do not merge to main."
