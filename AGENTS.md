# Agent rules — Care Pathway

GitHub: public repo `care-pathway`. Default branch `main` is protected.

## Git (mandatory)

- Run `git fetch -p` before you inspect branches or start work.
- Do not commit, cherry-pick, or merge on the `main` checkout.
- Put every change in a **git worktree** on a `feat/…` or `fix/…` branch created from `origin/main`.
- Push the branch and **open a pull request**. Do **not** merge to `main` (`git merge`, `git push origin main`, `gh pr merge` are all forbidden).
- After a PR is opened, stop and tell the user the URL.

Helper: `.\scripts\new-worktree.ps1 feat/name`

## Product locks (do not “improve” these away)

- Not a doctor, not HIS, not SaMD. Watermark: not a diagnosis.
- LLM loaded, not trained. GEPA offline only.
- No fake AUROC / invented percentages.
- Phase-1 catalogue: `cxr_tool`, `skin_tool`, `document_tool`, `nlem_lookup`, `cdsco_lookup`, `stw_retrieve`, `out_of_scope`.
- Extra tools later join as JSON functions, not chatting agents.
