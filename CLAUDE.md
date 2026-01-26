# SAIF Website

This is the website for the Safe Artificial Intelligence Fund (saif.vc).

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Supabase (shared with SAIF CRM project)
- **Hosting:** Vercel (planned)

## Database Tables

The website uses these tables in Supabase (prefixed with `website_` to separate from CRM):

- `website_investment_themes` - Investment focus areas
- `website_portfolio_companies` - Portfolio company listings
- `website_team_members` - Team member profiles
- `website_blog_posts` - Blog posts and press coverage

## Managing Content

Content is managed through the Supabase dashboard:
1. Go to https://supabase.com/dashboard/project/dxllkeajdtbtvsjjoaxr
2. Navigate to Table Editor
3. Edit the `website_*` tables directly

Changes will appear on the live site within 1 hour (due to ISR caching).

## Local Development

```bash
cd saif-website
npm install
npm run dev
```

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional:
- `REVALIDATION_SECRET` - Secret token for the `/api/revalidate` endpoint (recommended for production)

## Deployment

Deploy to Vercel and set the environment variables in the Vercel dashboard.
