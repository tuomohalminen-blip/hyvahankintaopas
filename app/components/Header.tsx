"use client"

import { useState } from "react"
import Link from "next/link"
import { chapters } from "@/lib/chapters"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: site name */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex flex-col">
              <span className="text-lg font-bold text-brand">
                hyvahankintaopas.fi
              </span>
              <span className="text-xs text-muted hidden sm:block">
                Taksialan julkiset hankinnat – Opas
              </span>
            </Link>
          </div>

          {/* Right: desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {chapters.map((ch) => (
              <Link
                key={ch.id}
                href={`/luku/${ch.id}`}
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-brand hover:bg-brand-bg transition-colors"
              >
                {ch.number}. {ch.shortTitle}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-brand hover:bg-brand-bg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Avaa valikko"
          >
            {menuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {chapters.map((ch) => (
              <Link
                key={ch.id}
                href={`/luku/${ch.id}`}
                className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-brand hover:bg-brand-bg"
                onClick={() => setMenuOpen(false)}
              >
                {ch.number}. {ch.shortTitle}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
