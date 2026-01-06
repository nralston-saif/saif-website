import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Building2, Users, Lightbulb } from 'lucide-react'
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

async function getStats() {
  // Get total portfolio count from CRM investments (includes stealth companies)
  const { count: companyCount } = await supabase
    .from('saifcrm_investments')
    .select('*', { count: 'exact', head: true })

  const { count: themeCount } = await supabase
    .from('website_investment_themes')
    .select('*', { count: 'exact', head: true })

  return { companyCount: companyCount || 0, themeCount: themeCount || 0 }
}

export default async function Home() {
  const [companies, latestPost, stats] = await Promise.all([
    getFeaturedCompanies(),
    getLatestPost(),
    getStats(),
  ])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="container">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              Early-Stage Venture Fund
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Building a Safer Future with AI
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              The Safe Artificial Intelligence Fund invests in startups developing tools
              to enhance AI safety, security, and responsible deployment.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/apply"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                Request Funding
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/thesis"
                className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                Our Investment Thesis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.companyCount}</p>
                <p className="text-sm text-muted-foreground">Portfolio Companies</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.themeCount}</p>
                <p className="text-sm text-muted-foreground">Investment Themes</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">$100K</p>
                <p className="text-sm text-muted-foreground">Initial Investment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">What We Do</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              SAIF provides initial funding of $100,000 on a SAFE with a $10mm cap,
              along with mentorship and access to our network of AI-focused investors
              and strategic partners.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Financial Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  $100,000 on a SAFE with a $10mm cap to help you get started
                  and build your initial product.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mentorship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Weekly office hours with Geoff Ralston to discuss strategy,
                  product, and the state of your business.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Network Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Introductions to leading AI-focused VCs, institutional investors,
                  and strategic corporate partners.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Portfolio Section */}
      <section className="border-t bg-muted/30 py-24">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
              <p className="mt-2 text-muted-foreground">
                Companies building the future of AI safety
              </p>
            </div>
            <Link
              href="/portfolio"
              className="hidden sm:inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              View all companies
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <a
                key={company.id}
                href={company.website_url || '#'}
                target={company.website_url ? '_blank' : undefined}
                rel={company.website_url ? 'noopener noreferrer' : undefined}
                className={`group block rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20 ${
                  company.website_url ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="flex items-center justify-center h-20 mb-4">
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="max-h-20 max-w-full object-contain"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-xl font-bold text-muted-foreground">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">{company.name}</h3>
                  {company.tagline && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {company.tagline}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
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
        <section className="py-24">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tight">Latest from the Blog</h2>
            <Card className="mt-8">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {latestPost.author?.name && <span>{latestPost.author.name}</span>}
                  {latestPost.published_at && (
                    <>
                      <span>•</span>
                      <span>
                        {new Date(latestPost.published_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </>
                  )}
                </div>
                <CardTitle className="text-2xl">
                  <Link href={`/blog/${latestPost.slug}`} className="hover:underline">
                    {latestPost.title}
                  </Link>
                </CardTitle>
                {latestPost.excerpt && (
                  <CardDescription className="text-base">
                    {latestPost.excerpt}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <Link
                  href="/blog"
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  Read more articles
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="border-t bg-primary text-primary-foreground py-24">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Building something that makes AI safer?
          </h2>
          <p className="mt-4 text-lg opacity-90">
            We&apos;re looking for great founders with deep expertise and scalable ideas
            that align with AI Safety.
          </p>
          <Link
            href="/apply"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-background text-foreground px-8 text-sm font-medium shadow hover:bg-background/90"
          >
            Request Funding
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
