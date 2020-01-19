Set-Location $PSScriptRoot/../

if (git.exe status -s "src/" ".clasp.json") {
  Write-Output "Some source files have uncommitted changes; clasp push aborted."
  exit 1
}

Write-Output "Pushing to clasp remote..."
npx clasp push
Write-Output "DONE."

# Update tag
$CLASP_TAG = "clasp-head"
$PreviousCommit = git.exe rev-parse --short $CLASP_TAG

git.exe tag -f -a -m " " $CLASP_TAG
git.exe push --tags -force
Write-Output "Tag moved from $PreviousCommit to HEAD"
