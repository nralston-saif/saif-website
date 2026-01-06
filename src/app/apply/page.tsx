import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Request Funding | SAIF',
  description: 'Request investment from the Safe Artificial Intelligence Fund.',
}

export default function ApplyPage() {
  return (
    <div className="py-24">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight">Request Funding</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We&apos;re looking for great founders with deep expertise in their chosen
            domain and a scalable and monetizable idea that aligns with AI Safety.
          </p>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 mb-12">
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
                      On a SAFE with a $10mm cap
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Weekly Office Hours</p>
                    <p className="text-sm text-muted-foreground">
                      Direct mentorship access
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Investor Network</p>
                    <p className="text-sm text-muted-foreground">
                      AI-focused VC introductions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What We Look For</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">Deep domain expertise</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">Scalable, monetizable idea</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">AI safety alignment</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">Predominantly US-based</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-8">
            <p className="text-muted-foreground">
              Ready to build something that makes AI safer? Fill out the form below.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Or check out our{' '}
              <Link href="/thesis" className="text-primary hover:underline">
                investment thesis
              </Link>{' '}
              to learn more.
            </p>
          </div>

          {/* JotForm Embed */}
          <div className="w-full">
            <iframe
              id="JotFormIFrame-250855326422152"
              title="SAIF Funding Request Form"
              src="https://form.jotform.com/250855326422152"
              style={{
                minWidth: '100%',
                maxWidth: '100%',
                height: '539px',
                border: 'none',
              }}
              scrolling="no"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
