import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAIF - Safe Artificial Intelligence Fund",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
