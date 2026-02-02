import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { PortfolioCarousel } from '@/components/PortfolioCarousel'
import { RealtimeRefresh } from '@/components/RealtimeRefresh'
import { ScrollReveal, CollapsibleHero } from '@/components/ScrollReveal'
import { OfferPill } from '@/components/OfferPill'
import type { BlogPost, TeamMember, PortfolioCompany } from '@/types/database'

export const revalidate = 5 // Revalidate every 5 seconds for near-instant updates

type BlogPostWithAuthor = BlogPost & { author: TeamMember | null }

async function getAllCompanies(): Promise<PortfolioCompany[]> {
  const { data } = await supabase
    .from('website_portfolio_companies')
    .select('*')
    .order('name')
  return (data as PortfolioCompany[]) || []
}

async function getLatestPosts(): Promise<BlogPostWithAuthor[]> {
  const { data } = await supabase
    .from('website_blog_posts')
    .select('*, author:website_team_members(*)')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(3)
  return (data as BlogPostWithAuthor[]) || []
}

export default async function Home() {
  const [companies, latestPosts] = await Promise.all([
    getAllCompanies(),
    getLatestPosts(),
  ])

  return (
    <RealtimeRefresh table="website_portfolio_companies">
    <div>
      {/* Hero Section - Collapses when scrolled */}
      <CollapsibleHero>
        <div className="container">
          <ScrollReveal direction="down">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Safe Artificial Intelligence Fund
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground">
                Investing in startups to build a safer future with AI
              </p>
              <div className="mt-12 flex justify-center gap-4 flex-wrap">
                <OfferPill
                  label="$100K Investment"
                  description="Our standard investment is $100,000 on a $10mm cap post-money YC-standard SAFE. However, we can be flexible depending on the circumstances."
                />
                <OfferPill
                  label="Mentorship"
                  description="SAIF founder Geoff Ralston is a longtime Silicon Valley entrepreneur, investor, and technologist committed to building a safer future with AI. He served as President of Y Combinator and previously co-founded Imagine K12—an edtech accelerator that merged with YC."
                />
                <OfferPill
                  label="Network Access"
                  description="Access to SAIF's network of other safety focused funds along with Geoff's broader startup and founder network."
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="h-6 w-6 text-muted-foreground animate-bounce" />
        </div>
      </CollapsibleHero>

      {/* Below-fold content with unified animation */}
      <ScrollReveal>
        {/* Portfolio Section */}
        <section className="py-12">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Portfolio</h2>
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

        {/* Latest News */}
        {latestPosts.length > 0 && (
          <section className="py-12">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Latest News</h2>
                <Link
                  href="/blog"
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-2">
                {latestPosts.map((post) =>
                  post.source_url ? (
                    <a
                      key={post.id}
                      href={post.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-3 px-4 bg-white/60 rounded-lg border border-transparent hover:border-primary/20 hover:shadow-sm transition-all"
                    >
                      <span className="text-sm font-medium truncate min-w-0 group-hover:underline">{post.title}</span>
                      {post.published_at && (
                        <span className="text-xs text-muted-foreground ml-4 flex-shrink-0">
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </a>
                  ) : (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group flex items-center justify-between py-3 px-4 bg-white/60 rounded-lg border border-transparent hover:border-primary/20 hover:shadow-sm transition-all"
                    >
                      <span className="text-sm font-medium truncate min-w-0 group-hover:underline">{post.title}</span>
                      {post.published_at && (
                        <span className="text-xs text-muted-foreground ml-4 flex-shrink-0">
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </Link>
                  )
                )}
              </div>
            </div>
          </section>
        )}

      </ScrollReveal>
    </div>
    </RealtimeRefresh>
  )
}
