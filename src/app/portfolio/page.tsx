import { supabase } from '@/lib/supabase'
import { ExternalLink } from 'lucide-react'
import type { PortfolioCompany } from '@/types/database'
import { RealtimeRefresh } from '@/components/RealtimeRefresh'

export const revalidate = 5 // Revalidate every 5 seconds for near-instant updates

async function getCompanies(): Promise<PortfolioCompany[]> {
  const { data } = await supabase
    .from('website_portfolio_companies')
    .select('*')
    .order('name')
  return (data as PortfolioCompany[]) || []
}

export const metadata = {
  title: 'Portfolio | SAIF',
  description: 'Companies building the future of AI safety, security, and responsible deployment.',
}

export default async function PortfolioPage() {
  const companies = await getCompanies()

  return (
    <RealtimeRefresh table="website_portfolio_companies">
    <div className="py-12 sm:py-24">
      <div className="container">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Portfolio</h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            We invest in great founders building tools to enhance AI safety,
            security, and responsible deployment. Here are the companies we&apos;re
            proud to support.
          </p>
        </div>

        <div className="mt-8 sm:mt-16 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <a
              key={company.id}
              href={company.website_url || '#'}
              target={company.website_url ? '_blank' : undefined}
              rel={company.website_url ? 'noopener noreferrer' : undefined}
              className={`group block rounded-lg border bg-white/60 p-6 transition-all hover:shadow-lg hover:border-primary/20 ${
                company.website_url ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {/* Logo Section */}
              <div className="flex items-center justify-center h-24 mb-6">
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="max-h-24 max-w-full object-contain"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Company Info */}
              <div className="text-center">
                <h3 className="font-semibold text-lg flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="truncate">{company.name}</span>
                  {company.website_url && (
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </h3>
                {company.tagline && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {company.tagline}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
    </RealtimeRefresh>
  )
}
