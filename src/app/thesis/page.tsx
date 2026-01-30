import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { InvestmentTheme } from '@/types/database'

export const revalidate = 3600

async function getThemes(): Promise<InvestmentTheme[]> {
  const { data } = await supabase
    .from('website_investment_themes')
    .select('*')
    .order('sort_order')
  return (data as InvestmentTheme[]) || []
}

export const metadata = {
  title: 'Investment Thesis | SAIF',
  description: 'The themes and areas we focus on when investing in AI safety startups.',
}

export default async function ThesisPage() {
  const themes = await getThemes()

  return (
    <div className="py-12 sm:py-24">
      <div className="container">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Investment Thesis</h1>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            These are some of the themes in which we are most interested, but this
            is not meant to be a complete list of all possible categories of AI safety.
          </p>
        </div>

        <div className="mt-8 sm:mt-16 grid gap-4 sm:gap-6 md:grid-cols-2">
          {themes.map((theme, index) => (
            <Card key={theme.id} className="p-6">
              <div className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold leading-8">{theme.name}</h3>
                  {theme.description && (
                    <p className="mt-2 text-muted-foreground">{theme.description}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
