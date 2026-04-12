import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "./components/Header"
import Footer from "./components/Footer"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Hyvä hankintaopas – Taksialan julkiset hankinnat",
  description:
    "Käytännön opas taksialan julkisiin hankintoihin: hankintamallit, kilpailutus, sopimukset ja laadunvalvonta. Kirjoittanut Tuomo Halminen.",
  openGraph: {
    title: "Hyvä hankintaopas – Taksialan julkiset hankinnat",
    description:
      "Käytännön opas taksialan julkisiin hankintoihin: hankintamallit, kilpailutus, sopimukset ja laadunvalvonta.",
    url: "https://hyvahankintaopas.fi",
    siteName: "hyvahankintaopas.fi",
    locale: "fi_FI",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fi" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
