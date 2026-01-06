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
    <div className="py-24">
      <div className="container">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">Investment Thesis</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We fund great founders and great companies who are broadly interested
            in building commercial tools which will help protect us from negative
            outcomes from the deployment of AI everywhere in business and society.
          </p>
          <p className="mt-4 text-muted-foreground">
            These are some of the themes in which we are most interested, but this
            is not meant to be a complete list of all possible categories of AI safety.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {themes.map((theme, index) => (
            <Card key={theme.id}>
              <CardHeader>
                <CardTitle className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span>{theme.name}</span>
                </CardTitle>
              </CardHeader>
              {theme.description && (
                <CardContent className="pl-16">
                  <p className="text-muted-foreground">{theme.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
