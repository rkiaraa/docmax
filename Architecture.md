# DocMax — Architecture Note
 
## What I Prioritized and Why
 
### 1. Platform over infrastructure
I chose Base44 as the platform rather than building on raw infrastructure. This meant trading backend control for speed and reliability — auth, storage, and hosting are all managed. For a document editor at this scope, that was the right call: it let me focus entirely on product decisions rather than plumbing.
 
### 2. Privacy-first sharing model
I chose explicit email-based sharing over shareable links. Documents are private by default — access has to be actively granted to a specific person. This is a more secure default and mirrors how enterprise tools like Google Docs handle permissions. The tradeoff is slightly more friction for the user, which I think is worth it.
 
### 3. Scoping file uploads to .txt and .html
An early version attempted to support multiple file types. This required platform-incompatible dependencies, so rather than ship something fragile, I cut scope to the two formats that worked reliably out of the box. Reliability over feature breadth.
 
### 4. Letter-size canvas with orientation and zoom
The editor is constrained to an 8.5 x 11-inch canvas with portrait/landscape toggle and zoom controls. This was a deliberate product decision — it makes DocMax feel like a real document tool rather than a generic text area, and keeps output print-ready by default.
 
### 5. Client-side filtering and search
Document filtering and search run client-side after a single fetch. This keeps the UI instant without an extra round trip. It's the right trade-off for a personal document library, which is typically small enough that local filtering is fast and cheap.
 
---
 
## What I Would Do Differently With More Time
- Real-time multiplayer cursors
- Document version history / restore
- Folder/tag organization
- Richer text formatting (tables, embeds)
- Add Export to PDF
- Add a commenting system 
- Add more fonts and sizes
