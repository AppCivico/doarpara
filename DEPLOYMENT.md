# Cloudflare Workers Deployment with NuxtHub

This project is configured to deploy to Cloudflare Workers using NuxtHub.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Already installed as a dev dependency

**Note**: A NuxtHub Admin account is **optional**. You can deploy directly to your own Cloudflare account using Wrangler or Cloudflare's Git integration. NuxtHub Admin is being sunset on December 31st, 2025, with the ecosystem moving towards self-hosted deployments.

## Local Development

### Standard Development

```bash
npm run dev
```

### Development with Remote Resources

To connect to remote Cloudflare resources (KV, D1, R2, etc.) during development:

```bash
npm run dev:remote
```

## Environment Variables

### Local Development

Environment variables for local development are stored in `.dev.vars` (already configured, not committed to git).

### Production/Preview

You have three options for setting environment variables:

#### Option 1: Cloudflare Dashboard (Easiest)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **Workers & Pages**
3. Select your project
4. Go to **Settings** → **Environment Variables**
5. Add your variables for Production and/or Preview environments

#### Option 2: NuxtHub Dashboard (Optional)

**Note**: NuxtHub Admin is optional and will be sunset on December 31st, 2025.

1. Go to [NuxtHub Admin](https://admin.hub.nuxt.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add your variables

#### Option 3: Wrangler CLI

```bash
# Set a secret for production
npx wrangler secret put SENTRY_AUTH_TOKEN --env production

# Set a secret for preview environment
npx wrangler secret put SENTRY_AUTH_TOKEN --env preview
```

#### Non-Sensitive Variables in wrangler.toml

For non-sensitive environment variables, you can also add them directly to `wrangler.toml`:

```toml
[env.production.vars]
API_TIMEOUT = "5000"

[env.preview.vars]
API_TIMEOUT = "3000"
```

**Important Notes:**

- **Dashboard variables take precedence**: If a variable is set in both `wrangler.toml` and the Cloudflare Dashboard, the Dashboard value wins
- **Secrets (via CLI or Dashboard) override everything**: Secrets are encrypted and always take precedence
- **`wrangler.toml` is committed to git**: Only put non-sensitive values here (API URLs, timeouts, feature flags, etc.)
- **Best practice**: Use `wrangler.toml` for default values and Dashboard/CLI for sensitive or environment-specific overrides

## Deployment

You have two deployment options:

1. **Manual CLI Deployment** - Deploy manually using `nuxthub deploy`
2. **Git-based CI/CD** - Automatic deployments on git push (recommended for most projects)

### Option A: Manual CLI Deployment

#### Deploy to Preview (Staging)

```bash
npm run deploy
```

This deploys to a preview environment with a unique URL like: `https://doarpara-<hash>.pages.dev`

#### Deploy to Production

```bash
npm run deploy:prod
```

This deploys to your production domain.

### Option B: Git-based CI/CD (Recommended)

Connect your repository for automatic deployments on every push.

#### Setup via Cloudflare Dashboard (Direct)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **Workers & Pages**
3. Click **Create Application** → **Pages** → **Connect to Git**
4. Connect your GitHub/GitLab repository
5. Configure build settings:
   - **Framework preset**: Nuxt.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.output/public`
   - **Node.js version**: Automatically detected from `.node-version` file (no manual configuration needed)
6. Configure branch settings:
   - **Production branch**: `main` (or your default branch)
   - **Preview branches**: All other branches get preview deployments

Once connected:

- Pushing to `main` automatically deploys to production
- Pushing to other branches creates preview deployments
- Pull requests get unique preview URLs

#### Setup via NuxtHub Dashboard (Optional, being sunset)

**Note**: NuxtHub Admin is being sunset on December 31st, 2025. Prefer the Cloudflare Dashboard method above.

1. Go to [NuxtHub Admin](https://admin.hub.nuxt.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **Git Integration**
4. Connect your GitHub/GitLab repository

#### Setup via GitHub Actions (Alternative)

If you prefer more control, use GitHub Actions workflow (see CI/CD Integration section below).

## First-Time Setup

### 1. Deploy to Cloudflare (Optional for CLI deployment)

If using manual CLI deployment with `npm run deploy`:

```bash
npm run deploy
```

Follow the prompts to:

- Authenticate with your Cloudflare account
- Create or link to a Cloudflare Workers project
- Deploy your application

**Note**: If using Git-based CI/CD, skip this step and use the Cloudflare Dashboard to connect your repository instead.

### 2. Configure Production Environment Variables

After first deployment, set your production secrets:

```bash
# Sentry (if using sourcemaps upload)
npx wrangler secret put SENTRY_AUTH_TOKEN --env production

# Add any other sensitive variables
npx wrangler secret put IUGU_API_KEY --env production
```

### 3. Set Up Custom Domain (Optional)

1. Go to [NuxtHub Dashboard](https://admin.hub.nuxt.com)
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain
5. Update DNS records as instructed (your domain must use Cloudflare nameservers)

## Project Structure

```
.
├── wrangler.toml          # Cloudflare Workers configuration
├── .dev.vars              # Local environment variables (not in git)
├── nuxt.config.ts         # Nuxt config with @nuxthub/core-nightly module
└── .output/               # Build output (generated on build)
```

## Monitoring & Logs

### View Deployment Logs

```bash
# Production logs
npm run tail:prod

# Preview logs
npm run tail:preview
```

### NuxtHub Dashboard

Visit [admin.hub.nuxt.com](https://admin.hub.nuxt.com) to:

- View deployment history
- Monitor real-time logs
- Manage environment variables
- Configure custom domains
- View analytics

## Differences from Cloudflare Pages

| Feature | Pages | Workers (NuxtHub) |
|---------|-------|-------------------|
| Deployment | Git-based CI/CD | CLI-based with `nuxthub deploy` |
| Static Assets | Automatic | Served via Workers with Assets binding |
| Environment Variables | Set in dashboard | Set via Wrangler CLI or wrangler.toml |
| Preview Environments | Automatic per commit | Manual deployment with `npm run deploy` |
| Custom Domains | Any domain | Requires Cloudflare nameservers |
| Function Execution | Pages Functions | Workers script |
| Additional Features | - | Durable Objects, Cron Triggers, KV, D1, R2 |

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .nuxt .output node_modules/.cache
npm run build
```

### Native Binding Errors (@oxc-parser, optional dependencies)

If you see errors like "Cannot find module '@oxc-parser/binding-linux-x64-gnu'" or "Cannot find native binding" during `nuxt prepare` or build:

**Root cause**: `@nuxtjs/mdc` and `@nuxt/devtools` have native dependencies that require Node.js 20.9+.

**Solutions** (all already configured in this project):

1. **`.node-version` file**: Specifies Node.js 20 for Cloudflare Pages builds ([.node-version](.node-version))
2. **package.json engines**: Specifies Node.js >= 20.9.0 ([package.json:5-7](package.json#L5-L7))
3. **Devtools disabled in production**: ([nuxt.config.ts:25](nuxt.config.ts#L25))
4. **Optional dependencies disabled**: (`.npmrc`)

**If still encountering issues:**

- Verify the `.node-version` file exists in your project root with content `20`
- For manual deployments: use Node.js 20.9 or higher locally
- Check that `NODE_ENV=production` is set during build

**References:**
- [Fix oxc-parser Module Error When Deploying Nuxt3 to Cloudflare](https://www.ubitools.com/fix-cloudflare-nuxt3-oxc-parser-module-error/)
- [Nuxt Issue #32525](https://github.com/nuxt/nuxt/issues/32525)

### Deployment Authentication Issues

```bash
# Re-authenticate with Wrangler
npx wrangler login

# Link project again
npm run deploy
```

### Environment Variables Not Working

- Check `.dev.vars` for local development
- Use `npx wrangler secret put KEY` for production secrets
- Non-sensitive vars go in `wrangler.toml` under `[vars]` or `[env.production.vars]`

### Check Wrangler Configuration

```bash
# Validate wrangler.toml
npx wrangler deploy --dry-run
```

## Resources

- [NuxtHub Documentation](https://hub.nuxt.com/docs)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Nuxt 3 Documentation](https://nuxt.com/docs)

## CI/CD Integration

For automated deployments from GitHub Actions, GitLab CI, or other CI/CD platforms:

```yaml
# Example GitHub Actions workflow
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npx nuxthub deploy --production
        env:
          NUXT_HUB_PROJECT_KEY: ${{ secrets.NUXT_HUB_PROJECT_KEY }}
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

Generate your project key from: [admin.hub.nuxt.com](https://admin.hub.nuxt.com) → Your Project → Settings → Tokens
