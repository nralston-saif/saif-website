import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import type { BlogPost, TeamMember, PortfolioCompany } from '@/types/database'

export const revalidate = 3600 // Revalidate every hour

type BlogPostWithAuthor = BlogPost & { author: TeamMember | null }

async function getFeaturedCompanies(): Promise<PortfolioCompany[]> {
  const { data } = await supabase
    .from('website_portfolio_companies')
    .select('*')
    .eq('featured', true)
    .order('sort_order')
    .limit(6)
  return (data as PortfolioCompany[]) || []
}

async function getLatestPost(): Promise<BlogPostWithAuthor | null> {
  const { data } = await supabase
    .from('website_blog_posts')
    .select('*, author:website_team_members(*)')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single()
  return data as BlogPostWithAuthor | null
}

export default async function Home() {
  const [companies, latestPost] = await Promise.all([
    getFeaturedCompanies(),
    getLatestPost(),
  ])

  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
              Early-Stage Venture Fund
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Building a Safer Future with AI
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              SAIF invests in startups developing tools to enhance AI safety, security, and responsible deployment.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/request"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Request Funding
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/thesis"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Our Investment Thesis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight">What We Offer</h2>
            <p className="mt-2 text-muted-foreground">
              $100K on a SAFE with a $10mm cap, plus mentorship and network access
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">$100K Investment</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SAFE with $10mm cap to help you build your initial product
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Mentorship</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Weekly office hours to discuss strategy and product
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Network Access</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Intros to AI-focused VCs and strategic partners
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolio Section */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Portfolio</h2>
              <p className="text-sm text-muted-foreground">
                Companies building the future of AI safety
              </p>
            </div>
            <Link
              href="/portfolio"
              className="hidden sm:inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <a
                key={company.id}
                href={company.website_url || '#'}
                target={company.website_url ? '_blank' : undefined}
                rel={company.website_url ? 'noopener noreferrer' : undefined}
                className={`group block rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:border-primary/20 ${
                  company.website_url ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="flex items-center justify-center h-16 mb-3">
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="max-h-16 max-w-full object-contain"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-lg font-semibold text-muted-foreground">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">{company.name}</h3>
                  {company.tagline && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {company.tagline}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/portfolio"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              View all companies
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Post */}
      {latestPost && (
        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Latest News</h2>
              <Link
                href="/blog"
                className="text-sm font-medium text-primary hover:underline"
              >
                All posts →
              </Link>
            </div>
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  {latestPost.author?.name && <span>{latestPost.author.name}</span>}
                  {latestPost.published_at && (
                    <>
                      <span>•</span>
                      <span>
                        {new Date(latestPost.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </>
                  )}
                </div>
                <CardTitle className="text-xl">
                  <Link href={`/blog/${latestPost.slug}`} className="hover:text-primary transition-colors">
                    {latestPost.title}
                  </Link>
                </CardTitle>
                {latestPost.excerpt && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {latestPost.excerpt}
                  </p>
                )}
              </CardHeader>
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Building something that makes AI safer?
          </h2>
          <p className="mt-3 text-primary-foreground/80 max-w-lg mx-auto">
            We&apos;re looking for founders with deep expertise and scalable ideas in AI Safety.
          </p>
          <Link
            href="/request"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-background text-foreground px-5 text-sm font-medium hover:bg-background/90 transition-colors"
          >
            Request Funding
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
