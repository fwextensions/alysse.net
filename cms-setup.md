# Keystatic CMS Setup for Astro + Cloudflare Workers

This document outlines the steps to enable Keystatic CMS with GitHub mode for an Astro site deployed to Cloudflare Workers.

## Overview

- **Public site**: Deployed to GitHub Pages (static)
- **CMS admin**: Deployed to Cloudflare Workers (SSR for `/keystatic` routes)
- **Content storage**: GitHub repository (via Keystatic GitHub mode)

## Prerequisites

- Node.js 22+
- Cloudflare account
- GitHub account with repo access

---

## 1. Install Dependencies

```bash
npm install @astrojs/cloudflare @keystatic/astro @keystatic/core
npm install -D wrangler
```

## 2. Configure Astro

In `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
	site: isGitHubPages ? "https://YOUR_ORG.github.io" : undefined,
	base: isGitHubPages ? "/YOUR_REPO" : undefined,

	// static for GitHub Pages, static with adapter for Cloudflare (Keystatic handles its own SSR routes)
	output: "static",
	adapter: isGitHubPages ? undefined : cloudflare({ imageService: "passthrough" }),

	integrations: isGitHubPages
		? [react(), markdoc()]
		: [react(), markdoc(), keystatic()],
});
```

## 3. Configure Keystatic

In `keystatic.config.ts`:

```ts
import { config } from "@keystatic/core";

export default config({
	storage: {
		kind: "github",
		repo: "YOUR_ORG/YOUR_REPO",
	},
	// ... collections and singletons
});
```

## 4. Configure Wrangler

Create `wrangler.toml`:

```toml
name = "your-project-name"
compatibility_date = "2024-12-01"
compatibility_flags = ["nodejs_compat", "expose_global_message_channel"]
main = "./dist/_worker.js/index.js"
assets = { directory = "./dist", binding = "ASSETS" }
```

## 5. Create Assets Ignore File

Create `public/.assetsignore` to prevent uploading the worker code as a static asset:

```
_worker.js
```

## 6. Update package.json Scripts

```json
{
	"scripts": {
		"dev": "astro dev",
		"build": "astro build",
		"deploy": "astro build && wrangler deploy",
		"deploy:cf": "wrangler deploy"
	}
}
```

---

## 7. Set Up GitHub App for Keystatic

1. Run `npm run dev` and visit `http://localhost:4321/keystatic`
2. Click "Login with GitHub" - this initiates the GitHub App creation flow
3. Follow the prompts to create a GitHub App
4. Grant the app access to your repository
5. A `.env` file will be created with these variables:
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `KEYSTATIC_SECRET`
   - `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`

## 8. Configure GitHub App Callback URL

After deploying to Cloudflare Workers, add the production callback URL:

1. Go to **GitHub** → **Settings** → **Developer settings** → **GitHub Apps**
2. Select your Keystatic app
3. Add callback URL:
   ```
   https://YOUR_WORKER.workers.dev/api/keystatic/github/oauth/callback
   ```

---

## 9. Deploy to Cloudflare Workers

### First-time setup:

```bash
# Login to Cloudflare
npx wrangler login

# Add secrets (you'll be prompted to paste each value from .env)
npx wrangler secret put KEYSTATIC_GITHUB_CLIENT_ID
npx wrangler secret put KEYSTATIC_GITHUB_CLIENT_SECRET
npx wrangler secret put KEYSTATIC_SECRET
npx wrangler secret put PUBLIC_KEYSTATIC_GITHUB_APP_SLUG

# Deploy
npm run deploy
```

### Subsequent deploys:

```bash
npm run deploy
```

---

## 10. Set Up GitHub Actions for Auto-Deploy

Create `.github/workflows/deploy-cloudflare.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: ["main"]
  workflow_dispatch:

defaults:
  run:
    working-directory: ./astro-site

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy to Cloudflare Workers
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Workers
        run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### Add GitHub Repository Secrets:

1. Go to **GitHub repo** → **Settings** → **Secrets and variables** → **Actions**
2. Add:
   - `CLOUDFLARE_API_TOKEN` - Create at [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) with "Edit Cloudflare Workers" permissions
   - `CLOUDFLARE_ACCOUNT_ID` - Found in Cloudflare dashboard

---

## Moving to a New GitHub Organization

When moving the repo to a new org:

1. **Update `keystatic.config.ts`** - Change `repo` to new org/repo
2. **Update `astro.config.mjs`** - Change `site` and `base` for GitHub Pages
3. **Create new GitHub App** - Run through the Keystatic setup flow again at `/keystatic`
4. **Update `.env`** - New credentials will be generated
5. **Update Cloudflare secrets** - Run `wrangler secret put` for all 4 variables
6. **Update GitHub App callback URL** - Add the production URL
7. **Update GitHub Actions secrets** - Add Cloudflare API token and account ID

---

## Troubleshooting

### "MessageChannel is not defined" error
Add `expose_global_message_channel` to `compatibility_flags` in `wrangler.toml`.

### Images not loading on Cloudflare
Use `imageService: "passthrough"` in the Cloudflare adapter config.

### "redirect_uri is not associated with this application"
Add the callback URL to your GitHub App settings.

### "GitHub App is unable to commit"
Ensure:
- GitHub App is installed on the repo with write access
- All 4 Keystatic environment variables are set in Cloudflare Workers
