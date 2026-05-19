# Deployment Notes

## Current Public Demo

The current free public fallback is GitHub Pages:

https://dodhon.github.io/missed-lead-followup-demo/

## Cloudflare Pages

Cloudflare deployment is ready but blocked until Wrangler is authenticated on the local machine.

```bash
npx wrangler login
npm run build
npx wrangler pages project create missed-lead-followup-demo --production-branch main
npx wrangler pages deploy dist --project-name missed-lead-followup-demo --branch main
```

Expected production URL if the project name is available:

```text
https://missed-lead-followup-demo.pages.dev
```

Source: Cloudflare Pages Direct Upload docs describe `wrangler login`, `wrangler pages project create`, and `wrangler pages deploy <BUILD_OUTPUT_DIRECTORY>` for deploying static assets.
