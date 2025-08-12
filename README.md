# 90-Day CSM Tracker (HubSpot-style)

Interactive one-pager to manage your first 90 days as a Senior CSM. Built with Vite, React, Tailwind, framer-motion, lucide-react, and canvas-confetti.

## Local Development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages (project site)
1. Create a new GitHub repo (e.g., `hs-90day-tracker`) and push this project.
2. In `vite.config.ts`, set:
   ```ts
   export default defineConfig({
     plugins: [react()],
     base: '/<REPO_NAME>/' // e.g., '/hs-90day-tracker/'
   })
   ```
3. Deploy:
   ```bash
   npm run build
   npm run deploy
   ```
4. In GitHub, enable Pages: **Settings → Pages → Deploy from branch: `gh-pages`**.

## Deploy with GitHub Actions (optional, automatic)
- Add this workflow at `.github/workflows/pages.yml` (included here) and push to `main`. It will build and publish to Pages automatically.

## Notes
- State is stored in `localStorage` on the client.
- Start date defaults to `2025-09-01` (your actual start). You can change it in the UI.
