import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-stone-100">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-3xl tracking-tight font-[family-name:var(--font-montserrat)]">
              S<span className="font-bold">AI</span>F
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              The Safe Artificial Intelligence Fund is an early-stage venture fund
              dedicated to supporting startups developing tools to enhance AI safety,
              security, and responsible deployment.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/portfolio" className="hover:text-foreground">Portfolio</Link></li>
              <li><Link href="/thesis" className="hover:text-foreground">Investment Thesis</Link></li>
              <li><Link href="/team" className="hover:text-foreground">Team</Link></li>
              <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/request" className="hover:text-foreground">Request Funding</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Safe Artificial Intelligence Fund. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
