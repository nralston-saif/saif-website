import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'

export const revalidate = 600 // Revalidate every 10 minutes

async function getBlogPosts() {
  const { data } = await supabase
    .from('website_blog_posts')
    .select('*, author:website_team_members(*)')
    .eq('published', true)
    .order('published_at', { ascending: false })
  return data || []
}

export const metadata = {
  title: 'Blog | SAIF',
  description: 'Thoughts on AI safety, security, and responsible deployment.',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="py-24">
      <div className="container">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Thoughts, news, and insights on AI safety from our team and the press.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {post.source ? (
                    <Badge variant="outline">{post.source}</Badge>
                  ) : post.author?.name ? (
                    <span>{post.author.name}</span>
                  ) : null}
                  {post.published_at && (
                    <>
                      <span>•</span>
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
                <CardTitle className="text-2xl">
                  {post.source_url ? (
                    <a
                      href={post.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline inline-flex items-center gap-2"
                    >
                      {post.title}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  )}
                </CardTitle>
                {post.excerpt && (
                  <CardDescription className="text-base">
                    {post.excerpt}
                  </CardDescription>
                )}
              </CardHeader>
              {!post.source_url && (
                <CardContent>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Read more →
                  </Link>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
