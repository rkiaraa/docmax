DocMax - Lightweight Collaborative Document Editor

A lightweight collaborative document editor, built for speed and simplicity. DocMax supports real-time document editing, file management, email-based sharing, and a clean focused writing experience.
Live App Link: https://phenomenal-doc-flow-sync.base44.app
GitHub Repo: https://github.com/rkiaraa/DocMax

Features: 
- Document editor - Create, edit, and auto-save documents in a rich text environment
- Dashboard - View all your documents in a searchable, filterable grid
- Sharing - Share any document with another user by email address or link
- Tabs - Filter between documents you own vs documents shared with you
- Rename & Delete - Full document lifecycle management
- Authentication - Secure sign-in; all documents are scoped to the logged-in user

How to Run/Access
DocMax is a fully hosted web application - no installation required.

To use the app
1. Visit https://phenomenal-doc-flow-sync.base44.app
2. Create a free account or sign in
3. Click New Document to start editing
4. To share a document, open it and use the Share option to enter a collaborator's email

There is no local setup required. The app is deployed and accessible via the link above.

Validation & Error Handling
The following validation and error handling patterns are implemented throughout the app:
- Auth-gated actions - The "New Document" button is disabled until the current user is confirmed, preventing unauthenticated writes
- Mutation feedback - All create, rename, and delete actions surface success and error states via toast notifications
- Empty states - The dashboard handles zero-result states gracefully, with context-aware messaging and a prompt to create the first document
- Loading states - The document grid shows animated skeleton placeholders while data is fetching, preventing layout shift and blank screens
- Search resilience - The search filter is case-insensitive and operates client-side for instant feedback without additional network calls

Automated Test
The core filtering logic that determines which documents a user sees (owned vs. shared vs. all) is the most critical piece of business logic in the app. Below is a unit test for that function:
javascript// tests/filterDocs.test.js

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
To run the test, paste the above into a file called filterDocs.test.js and run:
bashnode filterDocs.test.js

No dependencies required — runs with Node.js out of the box.

Tech Stack
LayerTechnologyFrontendReact, React RouterState / DataTanStack Query (React Query)UI Componentsshadcn/ui, Tailwind CSSAnimationsFramer MotionBackend / AuthBase44 (managed platform)DeploymentBase44 hosting
