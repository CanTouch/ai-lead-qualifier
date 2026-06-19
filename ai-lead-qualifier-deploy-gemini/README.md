# AI Lead Qualifier (Gemini version) — Deploy Guide

- `index.html` — same demo UI, unchanged
- `api/chat.js` — server-side function that calls Google's Gemini API
  using a key stored as an environment variable (never exposed to visitors)
- `package.json` — tells Vercel this is a Node project

See the step-by-step walkthrough Claude gave you in chat for the full,
no-assumptions process (GitHub web upload + Vercel dashboard, no command
line required). Short version:

1. Get a free Gemini API key at https://aistudio.google.com (sign in →
   "Get API key" → "Create API key").
2. Create a GitHub account and a new repository, then upload these three
   items (index.html, package.json, and the api folder with chat.js inside)
   using GitHub's "Add file → Upload files" button.
3. Create a Vercel account (sign up with GitHub), then "Add New" → "Project"
   and import this repository.
4. In the project's Settings → Environment Variables, add a variable named
   `GEMINI_API_KEY` with your key as the value, then redeploy.
5. Vercel gives you the final live URL.
