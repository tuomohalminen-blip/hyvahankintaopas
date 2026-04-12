import Link from "next/link"
import { chapters } from "@/lib/chapters"

export default function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Site info */}
          <div>
            <h3 className="text-lg font-bold mb-2">hyvahankintaopas.fi</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Käytännön opas taksialan julkisiin hankintoihin. Hankintamallit,
              kilpailutus, sopimukset ja laadunvalvonta yhdessä paikassa.
            </p>
          </div>

          {/* Column 2: Table of contents */}
          <div>
            <h3 className="text-lg font-bold mb-2">Sisällysluettelo</h3>
            <ul className="space-y-1">
              {chapters.map((ch) => (
                <li key={ch.id}>
                  <Link
                    href={`/luku/${ch.id}`}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {ch.number}. {ch.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social links */}
          <div>
            <h3 className="text-lg font-bold mb-2">Seuraa</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://linkedin.com/in/tuomo-halminen-4bb21510a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/80 hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/TuomoHal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/80 hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/80 hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/60">
          <p>&copy; 2026 hyvahankintaopas.fi</p>
          <p>Kirjoittanut Tuomo Halminen</p>
        </div>
      </div>
    </footer>
  )
}
