export type Database = {
  public: {
    Tables: {
      website_investment_themes: {
        Row: {
          id: string
          name: string
          description: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      website_portfolio_companies: {
        Row: {
          id: string
          name: string
          tagline: string | null
          description: string | null
          logo_url: string | null
          website_url: string | null
          theme_id: string | null
          featured: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          tagline?: string | null
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          theme_id?: string | null
          featured?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          tagline?: string | null
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          theme_id?: string | null
          featured?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      website_team_members: {
        Row: {
          id: string
          name: string
          role: string
          bio: string | null
          photo_url: string | null
          linkedin_url: string | null
          twitter_url: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          bio?: string | null
          photo_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          bio?: string | null
          photo_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      website_blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          author_id: string | null
          source: string | null
          source_url: string | null
          published: boolean
          published_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content?: string | null
          author_id?: string | null
          source?: string | null
          source_url?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string | null
          author_id?: string | null
          source?: string | null
          source_url?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Convenience types
export type InvestmentTheme = Database['public']['Tables']['website_investment_themes']['Row']
export type PortfolioCompany = Database['public']['Tables']['website_portfolio_companies']['Row']
export type TeamMember = Database['public']['Tables']['website_team_members']['Row']
export type BlogPost = Database['public']['Tables']['website_blog_posts']['Row']

// Blog post with author info
export type BlogPostWithAuthor = BlogPost & {
  author: TeamMember | null
}
