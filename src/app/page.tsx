import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, DollarSign, Users, Network, Sparkles } from 'lucide-react'
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
      <section className="relative py-12 lg:py-16 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              Early-Stage Venture Fund
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Building a Safer Future with AI
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              SAIF invests in startups developing tools to enhance AI safety, security, and responsible deployment.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/request"
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Request Funding
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/thesis"
                className="inline-flex h-11 items-center justify-center rounded-full border-2 border-border bg-background px-6 text-sm font-medium hover:bg-muted transition-all"
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

          <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            <Card className="border-0 shadow-sm bg-background hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">$100K Investment</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  SAFE with $10mm cap to help you build your initial product
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-background hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Mentorship</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  Weekly office hours to discuss strategy and product
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-background hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2">
                  <Network className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Network Access</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  Intros to AI-focused VCs and strategic partners
                </p>
              </CardContent>
            </Card>
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
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
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
      <section className="py-16 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Building something that makes AI safer?
          </h2>
          <p className="mt-3 text-primary-foreground/80 max-w-lg mx-auto">
            We&apos;re looking for founders with deep expertise and scalable ideas in AI Safety.
          </p>
          <Link
            href="/request"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-background text-foreground px-6 text-sm font-medium shadow-lg hover:bg-background/90 transition-all"
          >
            Request Funding
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
