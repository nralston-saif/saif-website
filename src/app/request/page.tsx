import Link from 'next/link'
import { FundingRequestForm } from '@/components/FundingRequestForm'

export const metadata = {
  title: 'Request Funding | SAIF',
  description: 'Request investment from the Safe Artificial Intelligence Fund.',
}

export default function RequestPage() {
  return (
    <div className="py-12">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">Request Funding</h1>
          <p className="mt-2 mb-6 text-muted-foreground">
            Learn more about our <Link href="/thesis" className="underline hover:no-underline">focus areas</Link>.
          </p>
          <div className="rounded-xl border bg-card p-6 sm:p-8 shadow-sm">
            <FundingRequestForm />
          </div>
        </div>
      </div>
    </div>
  )
}
