import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Safe Artificial Intelligence Fund",
  description: "An early-stage venture fund dedicated to supporting startups developing tools to enhance AI safety, security, and responsible deployment.",
  openGraph: {
    title: "SAIF - Safe Artificial Intelligence Fund",
    description: "Investing in the future of AI safety",
    url: "https://saif.vc",
    siteName: "SAIF",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAIF - Safe Artificial Intelligence Fund",
    description: "Investing in the future of AI safety",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Safe Artificial Intelligence Fund",
  alternateName: "SAIF",
  url: "https://saif.vc",
  description: "An early-stage venture fund dedicated to supporting startups developing tools to enhance AI safety, security, and responsible deployment.",
  foundingDate: "2024",
  areaServed: "Worldwide",
  knowsAbout: ["Artificial Intelligence", "AI Safety", "Machine Learning", "Venture Capital"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SAIF - Safe Artificial Intelligence Fund",
  url: "https://saif.vc",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://saif.vc/portfolio?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
