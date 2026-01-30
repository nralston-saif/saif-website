import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowRight } from 'lucide-react'
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
                  description="We offer $100K on a $10MM Cap SAFE as a standard but are open to negotiation."
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
              <p className="mt-24 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The Safe Artificial Intelligence Fund is an early-stage venture fund dedicated to supporting startups developing tools to enhance AI safety, security, and responsible deployment.
              </p>
            </div>
          </ScrollReveal>
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
          <section className="py-8 bg-muted/30">
            <div className="container">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold tracking-tight">Latest News</h2>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  All posts →
                </Link>
              </div>
              <div className="space-y-2">
                {latestPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between py-2 border-b border-gray-200/60 last:border-0">
                    <div className="flex-1 min-w-0">
                      {post.source_url ? (
                        <a
                          href={post.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          <span className="truncate">{post.title}</span>
                          <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <Link href={`/blog/${post.slug}`} className="text-sm font-medium hover:text-primary transition-colors truncate block">
                          {post.title}
                        </Link>
                      )}
                    </div>
                    {post.published_at && (
                      <span className="text-xs text-muted-foreground ml-4 flex-shrink-0">
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 border-t border-gray-200/60">
          <div className="container text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Build something that makes AI safe.
            </h2>
          </div>
        </section>
      </ScrollReveal>
    </div>
    </RealtimeRefresh>
  )
}
