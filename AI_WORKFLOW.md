# DocMax — AI Workflow Note
## Overview 
This note documents how I used AI tools throughout the design, build, and submission process for DocMax. I used AI as a collaborator and thinking partner to move faster and fill gaps in technical knowledge.

## Tools Used and Their Purpose
Basee44 AI  - App generation, iteration, and feature implementation
Claude (Anthropic) Assessment interpretation documentation, gap filling

## How I Used Basee44's AI
1. Described the app concept - I prompted Basee44 with the core vision: a lightweight collaborative document editor with editing, file handling, sharing, and usability features inspired by Google Docs.
   
2. Iterated on features - I didn't accept the first output. I went back and forth with the AI to refine and extend the app:
  - Asked it to support uploading multiple file types - this required installing software dependencies that weren't compatible with the platform, so I decided to scope it down to .txt and .html only, rather than ship something broken
  - Asked it to set the editor canvas to letter size (8.5 x 11 inches)
  - Asked it to support both portrait and landscape orientation 
  - Asked it to add zoom controls to the editor

3. **Made deliberate tradeoffs - When a feature isn't working reliably (multi-format file uploads), I chose to cut scope rather than push through a fragile implementation. That decision was mine.

## How I Used Claude
1. Interpreting the assignment - Some of the assessment requirements used technical language I wasn't fully familiar with. I used Claude to help me understand what each requirement was actually asking for in plain terms, so I could address them properly.
2. Filling documentation gaps - Once I understood what was needed, I worked with Claude to produce the README. Claude had access to my source code, so the documentation reflects the real implementation.

## How I Verified Correctness, UX Quality, and Implementation Reliability
### 1. Correctness 
I manually walked through every user workflow end to end: creating a document, editing it, renaming it, sharing it with a second account, confirming the shared user could access it, and deleting it. I tested the sharing flow with two separate accounts to confirm that access control worked correctly from both the owner and recipient perspective.

### 2. UX Quality 
After each iteration in Base44, I used the app as if I were a first-time user and asked: Does every action give feedback, and does anything look broken or confusing? 
Things I checked:
- Every destructive action has a confirmation step and a toast notification
- The "New Document" button is disabled when not authenticated - no silent failures
- Empty states give the user a clear next step rather than a blank screen 
- The canvas behaved correctly in both portrait and landscape at multiple zoom levels

## Implementation Reliability 
I didn't keep prompting the AI to fix features that didn't work reliably (multi-format file uploads). I made the call to cut the features and scope down to .txt and .html only. This was the most important reliability decision I made: recognizing when to stop iterating on a broken path and simplify instead.
