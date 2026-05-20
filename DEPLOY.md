# Deploy to Vercel (xujuntan.com)

## Project settings (already configured)

- **Framework:** Vite
- **Build:** `npm run build`
- **Output:** `dist`
- **SPA routing:** `vercel.json` rewrites all routes to `index.html`

## Option A — Deploy from terminal (fastest)

In the project folder, run:

```bash
cd /Users/yukkwantam/Downloads/xujun-tan-portfolio
npx vercel@latest login
npx vercel@latest --prod
```

Follow prompts: link to your Vercel account, create project name (e.g. `xujun-tan-portfolio`).

Production URL will be like `https://xujun-tan-portfolio.vercel.app`.

## Option B — Deploy via Vercel Dashboard

1. Push this folder to GitHub (new repo).
2. Go to [vercel.com/new](https://vercel.com/new) → Import Git Repository.
3. Select the repo — Vercel auto-detects Vite; keep defaults.
4. Deploy.

## Connect custom domain `xujuntan.com`

1. Vercel project → **Settings** → **Domains** → Add `xujuntan.com` and `www.xujuntan.com`.
2. At your domain registrar (where you bought the domain), set DNS:

| Type  | Name | Value                 |
|-------|------|------------------------|
| A     | `@`  | `76.76.21.21`          |
| CNAME | `www`| `cname.vercel-dns.com` |

3. Wait for DNS (often 5–30 minutes). Vercel will issue HTTPS automatically.

## Verify locally before deploy

```bash
npm run build
npm run preview
```

Open the preview URL and test `/category/photo`, `/category/ai`, etc.
