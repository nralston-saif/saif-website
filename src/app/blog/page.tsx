import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { BlogPost, TeamMember } from '@/types/database'

export const revalidate = 600 // Revalidate every 10 minutes

type BlogPostWithAuthor = BlogPost & { author: TeamMember | null }

async function getBlogPosts(): Promise<BlogPostWithAuthor[]> {
  const { data } = await supabase
    .from('website_blog_posts')
    .select('*, author:website_team_members(*)')
    .eq('published', true)
    .order('published_at', { ascending: false })
  return (data as BlogPostWithAuthor[]) || []
}

export const metadata = {
  title: 'News/Blog | SAIF',
  description: 'News, thoughts, and insights on AI safety from our team and the press.',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="py-12 sm:py-24">
      <div className="container">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">News/Blog</h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Thoughts, news, and insights on AI safety from our team and the press.
          </p>
        </div>

        <div className="mt-8 sm:mt-16 space-y-4 sm:space-y-8">
          {posts.map((post) =>
            post.source_url ? (
              <a
                key={post.id}
                href={post.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Card className="transition-all hover:shadow-md hover:border-primary/20 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {post.source && <Badge variant="outline">{post.source}</Badge>}
                      {post.published_at && (
                        <>
                          {post.source && <span>•</span>}
                          <span>
                            {new Date(post.published_at).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </>
                      )}
                    </div>
                    <CardTitle className="text-xl sm:text-2xl group-hover:underline">{post.title}</CardTitle>
                    {post.excerpt && (
                      <CardDescription className="text-base">{post.excerpt}</CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </a>
            ) : (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <Card className="transition-all hover:shadow-md hover:border-primary/20 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {post.author?.name && <span>{post.author.name}</span>}
                      {post.published_at && (
                        <>
                          {post.author?.name && <span>•</span>}
                          <span>
                            {new Date(post.published_at).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </>
                      )}
                    </div>
                    <CardTitle className="text-xl sm:text-2xl group-hover:underline">{post.title}</CardTitle>
                    {post.excerpt && (
                      <CardDescription className="text-base">{post.excerpt}</CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  )
}
