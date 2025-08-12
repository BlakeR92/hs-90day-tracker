import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: set 'base' to '/<REPO_NAME>/' if deploying to GitHub Pages as a project site.
// Example: base: '/hs-90day-tracker/'
export default defineConfig({
  plugins: [react()],
  // When deploying to GitHub Pages the site is served from a subpath
  // matching the repository name. Set the `base` option to the repo name
  // with leading and trailing slashes so that asset paths resolve correctly.
  // In this deployment the repository is named `hs-90day-tracker`,
  // therefore we set base to '/hs-90day-tracker/'.
  base: '/hs-90day-tracker/'
})
