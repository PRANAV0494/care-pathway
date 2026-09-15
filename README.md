# Care Pathway

**Guideline-Grounded Health Assistant with Specialist Tools and Fail-Closed Answering**

GEU B.Tech CSE Core · Phase-1 major project · team **MP2026CSE344** · solo  
Student: Pranav Maheshwari (`GE-232023518`) · Guide: Dr. Narayan Chaturvedi

This is an **educational research prototype**. It is **not a doctor**, **not a hospital HIS**, and **not software as a medical device**. Every answer card is watermarked: not a diagnosis. The large language model is **loaded, not trained**. GEPA runs **offline only**.

## Repo rules

- Public GitHub. All changes go through **pull requests**.
- **Never merge to `main` from a laptop** (`git merge`, `git push origin main`, `gh pr merge` are forbidden here). Open a PR and leave it for review.
- Before any work: `git fetch -p`.
- Implementation happens in a **git worktree**, never on the `main` checkout.

See [CONTRIBUTING.md](CONTRIBUTING.md).

## What lives here (Phase 1)

| Path | What |
|------|------|
| `synopsis/Guideline_Grounded_Health_Assistant_GEU_Phase1_Synopsis.pdf` | Official synopsis |
| `synopsis/generate_health_synopsis.js` | Rebuild the Word synopsis |
| `synopsis/presentation/` | Evaluator deck builders |
| `synopsis/Project_Explain_Hinglish.md` | Viva notes |

No experimental accuracy number is claimed in this repository until it is measured.

## Status

Phase-1 synopsis and decks. Host v0 (`host/`): dummy tools, code verifier, watermarked card. Further work on feature branches via PRs.
