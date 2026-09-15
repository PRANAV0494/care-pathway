# Contributing — Care Pathway

## Hard rules

1. **`main` is protected.** Do not commit on it. Do not merge into it locally. Do not `gh pr merge`. Open a pull request and stop.
2. **Always prune first:** `git fetch -p`
3. **Always work in a worktree**, not in the main checkout.

## New work

From the main clone (this folder stays on `main` and stays clean):

```powershell
git fetch -p
.\scripts\new-worktree.ps1 feat/short-name
```

That creates `.worktrees/feat-short-name` on branch `feat/short-name` from `origin/main`. Edit there. Commit there. Push the branch. Open a PR against `main`.

```powershell
git -C .worktrees/feat-short-name push -u origin HEAD
gh pr create --base main --head feat/short-name --title "..." --body "..."
```

Do **not** merge the PR.

## PR checklist

- [ ] Branch is not `main`
- [ ] No invented metrics
- [ ] LLM is still loaded, not trained
- [ ] GEPA is still offline-only if mentioned
- [ ] Watermark / not-a-diagnosis language unchanged unless the PR is about that text
