#!/bin/bash
# Squash March 16-17 bulk commits into one
# Run from repo root: ./fix-march-commits.sh

set -e
cd "$(dirname "$0")"

# Safety: create backup branch first
BACKUP_BRANCH="backup-before-squash-$(date +%Y%m%d-%H%M)"
echo "Creating backup branch: $BACKUP_BRANCH"
git branch "$BACKUP_BRANCH"

# Parent of first March 16 commit
BASE="fdfaeeb"
# We'll rebase interactively and squash commits c168864..9abf85c (32 commits)

# Use sed to automate: first of the 32 is "pick", rest are "fixup"
# git rebase -i lists oldest first, so c168864 is first, 9abf85c is 32nd
export GIT_SEQUENCE_EDITOR='
# For each line in the todo: if it is one of the 32 March 16-17 commits, 
# change to fixup except the first (c168864) which stays pick
count=0
/^pick [a-f0-9]+ (feat|fix|chore|docs)\(/ {
  count++
  if (count >= 1 && count <= 32) {
    if (count == 1) { sub(/^pick/, "pick"); print; next }
    sub(/^pick/, "fixup"); print; next
  }
}
{ print }
'
# Script: among lines starting with "pick ", change 2nd–32nd to "fixup"
SCRIPT=$(mktemp)
cat > "$SCRIPT" << 'EDITOR_SCRIPT'
#!/bin/bash
FILE="$1"
pick_count=0
while IFS= read -r line; do
  if [[ "$line" =~ ^pick\  ]]; then
    pick_count=$((pick_count + 1))
    if [[ $pick_count -ge 2 && $pick_count -le 32 ]]; then
      echo "${line/#pick/fixup}"
    else
      echo "$line"
    fi
  else
    echo "$line"
  fi
done < "$FILE" > "$FILE.tmp"
mv "$FILE.tmp" "$FILE"
EDITOR_SCRIPT
chmod +x "$SCRIPT"

export GIT_SEQUENCE_EDITOR="$SCRIPT"
git rebase -i "$BASE"
unset GIT_SEQUENCE_EDITOR
rm -f "$SCRIPT"

echo ""
echo "Done! Your 32 March 16-17 commits are now squashed into one."
echo "Verify with: git log --oneline -20"
echo ""
echo "To push (rewrites remote history - coordinate with collaborators first):"
echo "  git push --force-with-lease origin main"
echo ""
echo "If something went wrong, restore with:"
echo "  git rebase --abort   # if still in progress"
echo "  git reset --hard $BACKUP_BRANCH   # to undo completely"