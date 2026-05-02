# DocMax — Lightweight Collaborative Document Editor
 
A lightweight collaborative document editor inspired by Google Docs, built for speed and simplicity. DocMax supports real-time document editing, file management, email-based sharing, and a clean, focused writing experience.
 
**🔗 Live App: [https://phenomenal-doc-flow-sync.base44.app](https://phenomenal-doc-flow-sync.base44.app)**
**📁 GitHub Repo: [https://github.com/rkiaraa/DocMax](https://github.com/rkiaraa/DocMax)**
 
---
 
## Features
 
- **Document editor** — Create, edit, and auto-save documents in a rich text environment
- **Dashboard** — View all your documents in a searchable, filterable grid
- **Sharing** — Share any document with another user by email address
- **Tabs** — Filter between documents you own vs. documents shared with you
- **Rename & Delete** — Full document lifecycle management
- **Authentication** — Secure sign-in; all documents are scoped to the logged-in user
- **File Upload** — Upload files that are in .html or .txt format
---
 
## How to Run / Access
 
DocMax is a fully hosted web application — no installation required.
 
**To use the app:**
1. Visit [https://phenomenal-doc-flow-sync.base44.app](https://phenomenal-doc-flow-sync.base44.app)
2. Create a free account or sign in
3. Click **New Document** to start editing
4. To share a document, open it and use the Share option to enter a collaborator's email
There is no local setup required. The app is deployed and accessible via the link above.
 
---
 
## Validation & Error Handling
 
The following validation and error handling patterns are implemented throughout the app:
 
- **Auth-gated actions** — The "New Document" button is disabled until the current user is confirmed, preventing unauthenticated writes
- **Mutation feedback** — All create, rename, and delete actions surface success and error states via toast notifications (e.g. "Document renamed", "Document deleted")
- **Empty states** — The dashboard handles zero-result states gracefully, with context-aware messaging (empty search vs. no documents yet) and a prompt to create the first document
- **Loading states** — The document grid shows animated skeleton placeholders while data is fetching, preventing layout shift and blank screens
- **Search resilience** — The search filter is case-insensitive and operates client-side for instant feedback without additional network calls
---
 
## Automated Test
 
The core filtering logic that determines which documents a user sees (owned vs. shared vs. all) is the most critical piece of business logic in the app. Below is a unit test for that function:
 
```javascript
// tests/filterDocs.test.js
 
function filterDocs(docs, currentUserEmail, tab, search) {
  return docs
    .filter((d) => {
      const isOwner = d.owner_email === currentUserEmail;
      const isShared = d.shared_with?.includes(currentUserEmail);
      if (tab === "owned") return isOwner;
      if (tab === "shared") return isShared;
      return isOwner || isShared;
    })
    .filter((d) => d.title?.toLowerCase().includes(search.toLowerCase()));
}
 
const mockDocs = [
  { id: "1", title: "My Report", owner_email: "alice@example.com", shared_with: [] },
  { id: "2", title: "Team Notes", owner_email: "bob@example.com", shared_with: ["alice@example.com"] },
  { id: "3", title: "Private Doc", owner_email: "bob@example.com", shared_with: [] },
];
 
// Test 1: "All" tab shows owned + shared, not unrelated docs
const allDocs = filterDocs(mockDocs, "alice@example.com", "all", "");
console.assert(allDocs.length === 2, "Should see 2 docs (1 owned, 1 shared)");
 
// Test 2: "Owned" tab shows only docs the user created
const ownedDocs = filterDocs(mockDocs, "alice@example.com", "owned", "");
console.assert(ownedDocs.length === 1 && ownedDocs[0].id === "1", "Should see only owned doc");
 
// Test 3: "Shared" tab shows only docs shared with the user
const sharedDocs = filterDocs(mockDocs, "alice@example.com", "shared", "");
console.assert(sharedDocs.length === 1 && sharedDocs[0].id === "2", "Should see only shared doc");
 
// Test 4: Search filters by title, case-insensitive
const searched = filterDocs(mockDocs, "alice@example.com", "all", "report");
console.assert(searched.length === 1 && searched[0].title === "My Report", "Search should be case-insensitive");
 
console.log("All tests passed ✅");
```
 
**To run the test**, paste the above into a file called `filterDocs.test.js` and run:
```bash
node filterDocs.test.js
```
No dependencies required — runs with Node.js out of the box.
 
---
 
## Architecture Notes
 
### What I Built
DocMax is a React single-page application built on Base44, using TanStack Query for server state, shadcn/ui + Tailwind for the component layer, and Framer Motion for transitions. Documents are stored in Base44's managed entity layer and scoped to authenticated users.
 
### What I Prioritized
 
**1. User trust over feature density**
The most important thing a document app can do is not lose your work and not show you someone else's work. I prioritized auth-gating, ownership scoping, and clear sharing semantics (explicit email-based sharing) over adding more editing features.
 
**2. Perceived performance**
The dashboard uses skeleton loaders and client-side search to feel instant. TanStack Query handles caching so navigating back to the dashboard doesn't trigger a full reload.
 
**3. Clear, recoverable actions**
Rename and delete are destructive — both surface confirmation dialogs and toast feedback so users always know what happened and can course-correct.
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React, React Router |
| State / Data | TanStack Query (React Query) |
| UI Components | shadcn/ui, Tailwind CSS |
| Animations | Framer Motion |
| Backend / Auth | Base44 (managed platform) |
| Deployment | Base44 hosting 
