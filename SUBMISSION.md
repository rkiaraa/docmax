# DocMax — Submission Checklist
 
## Candidate
**GitHub:** https://github.com/rkiaraa/DocMax
 
---
 
## Submitted Items
 
| Item | Status | Location |
|---|---|---|
| Live product URL | ✅ Included | https://phenomenal-doc-flow-sync.base44.app |
| Source code | ✅ Included | GitHub repo (link above) |
| README.md | ✅ Included | `/README.md` in repo |
| Architecture note | ✅ Included | `/ARCHITECTURE.md` in repo |
| AI workflow note | ✅ Included | `/AI_WORKFLOW.md` in repo |
| Automated test | ✅ Included | `/filterDocs.test.js` in repo — run with `node filterDocs.test.js` |
| Walkthrough video | ✅ Included | See `VIDEO.txt` in repo |
| Screenshots | ✅ Included | See `/screenshots` folder in repo |
| SUBMISSION.md | ✅ This file | `/SUBMISSION.md` in repo |
 
---
 
## Notes for Reviewers
 
- DocMax is fully hosted — no local setup is required. Visit the live URL to test the app directly. 
- The automated test (`filterDocs.test.js`) is a unit test for the core document filtering logic. It requires only Node.js and no additional dependencies.
- File upload is scoped to `.txt` and `.html` formats. Multi-format support was explored but depended on platform-incompatible dependencies and was intentionally cut in favour of reliability. This decision is documented in the architecture note.
 
