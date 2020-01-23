Set-Location $PSScriptRoot/../

if (git status -s "src/") {
  Write-Output "Some source files have uncommitted changes; clasp push aborted."
  exit 1
}

if (-not (Test-Path ".clasp.json")) {
  Write-Output "clasp is not configured. There needs to be a .clasp.json file in the repository root."
}

Write-Output "Pushing to clasp remote..."
npx clasp push
Write-Output "DONE."

# Update tag
$CLASP_TAG = "clasp-head"
$PreviousCommit = git rev-parse --short $CLASP_TAG

# FIXME kind of does not work.
git tag -f -a -m "current code pushed to the cloud" $CLASP_TAG
git push --tags --force
Write-Output "Tag moved from $PreviousCommit to HEAD"
