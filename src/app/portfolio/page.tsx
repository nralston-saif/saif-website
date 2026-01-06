import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import type { PortfolioCompany } from '@/types/database'

export const revalidate = 3600

async function getCompanies(): Promise<PortfolioCompany[]> {
  const { data } = await supabase
    .from('website_portfolio_companies')
    .select('*')
    .order('sort_order')
  return (data as PortfolioCompany[]) || []
}

export const metadata = {
  title: 'Portfolio | SAIF',
  description: 'Companies building the future of AI safety, security, and responsible deployment.',
}

export default async function PortfolioPage() {
  const companies = await getCompanies()

  return (
    <div className="py-24">
      <div className="container">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">Portfolio</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We invest in great founders building tools to enhance AI safety,
            security, and responsible deployment. Here are the companies we&apos;re
            proud to support.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card key={company.id} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{company.name}</span>
                  {company.website_url && (
                    <a
                      href={company.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </a>
                  )}
                </CardTitle>
                {company.tagline && (
                  <CardDescription>{company.tagline}</CardDescription>
                )}
              </CardHeader>
              {company.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{company.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
