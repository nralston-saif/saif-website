import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Apply for Funding | SAIF',
  description: 'Apply for investment from the Safe Artificial Intelligence Fund.',
}

export default function ApplyPage() {
  return (
    <div className="py-24">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight">Apply for Funding</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We&apos;re looking for great founders with deep expertise in their chosen
            domain and a scalable and monetizable idea that aligns with AI Safety.
          </p>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">$100,000 Investment</p>
                  <p className="text-sm text-muted-foreground">
                    On a SAFE with a $10mm cap to get your startup off the ground.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Weekly Office Hours</p>
                  <p className="text-sm text-muted-foreground">
                    Direct access to Geoff Ralston for mentorship and strategic advice.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Investor Network</p>
                  <p className="text-sm text-muted-foreground">
                    Introductions to leading AI-focused VCs and institutional investors.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Strategic Partners</p>
                  <p className="text-sm text-muted-foreground">
                    Connections to corporate partners in the AI safety space.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>What We Look For</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Great founders with deep expertise in their chosen domain</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>A scalable and monetizable idea</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Clear alignment with AI safety, security, or responsible deployment</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Predominantly US-based, but open to exceptional global opportunities</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">
              Ready to build something that makes AI safer?
            </p>
            <a
              href="mailto:apply@saif.vc"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Contact Us to Apply
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <p className="mt-4 text-sm text-muted-foreground">
              Or check out our{' '}
              <Link href="/thesis" className="text-primary hover:underline">
                investment thesis
              </Link>{' '}
              to learn more about what we&apos;re looking for.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
