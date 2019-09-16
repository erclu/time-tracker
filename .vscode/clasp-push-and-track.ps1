Set-Location $PSScriptRoot/../

if (git status -s "src/" ".clasp.json") {
  Write-Output "Some source files have uncommitted changes; clasp push aborted."
  exit 1
}

Write-Output "Pushing to clasp remote..."
npx clasp push
Write-Output "DONE."

# Update tag
$CLASP_TAG = "clasp-head"
$PreviousCommit = git rev-parse --short $CLASP_TAG

git tag -f -a -m " " $CLASP_TAG
Write-Output "Tag moved from $PreviousCommit to HEAD"
