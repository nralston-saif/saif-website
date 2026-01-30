import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { PortfolioCarousel } from '@/components/PortfolioCarousel'
import type { BlogPost, TeamMember, PortfolioCompany } from '@/types/database'

export const revalidate = 3600 // Revalidate every hour

type BlogPostWithAuthor = BlogPost & { author: TeamMember | null }

async function getAllCompanies(): Promise<PortfolioCompany[]> {
  const { data } = await supabase
    .from('website_portfolio_companies')
    .select('*')
    .order('name')
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
    getAllCompanies(),
    getLatestPost(),
  ])

  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Safe Artificial Intelligence Fund
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Investing in startups to build a safer future with AI
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-8 border-y border-gray-200/60">
        <div className="container">
          <h2 className="text-lg font-semibold tracking-tight text-center mb-4">What We Offer</h2>
          <div className="flex justify-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-full bg-white text-sm font-medium">$100K Investment</span>
            <span className="px-4 py-2 rounded-full bg-white text-sm font-medium">Mentorship</span>
            <span className="px-4 py-2 rounded-full bg-white text-sm font-medium">Network Access</span>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
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
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <PortfolioCarousel companies={companies} />
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
                  {latestPost.source_url ? (
                    <a
                      href={latestPost.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors inline-flex items-center gap-2"
                    >
                      {latestPost.title}
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <Link href={`/blog/${latestPost.slug}`} className="hover:text-primary transition-colors">
                      {latestPost.title}
                    </Link>
                  )}
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
      <section className="py-16 border-t border-gray-200/60">
        <div className="container text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Building something that makes AI safer?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            We&apos;re looking for founders with deep expertise and scalable ideas.
          </p>
          <Link
            href="/request"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-foreground text-background px-5 text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Request Funding
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
