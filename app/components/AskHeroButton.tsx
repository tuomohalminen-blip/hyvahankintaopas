"use client"

export default function AskHeroButton() {
  return (
    <button
      onClick={() => document.dispatchEvent(new CustomEvent("open-ask-widget"))}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FFA02F] text-white font-semibold hover:bg-[#e8901f] transition-colors"
    >
      <span>✦</span> Kysy asiantuntijalta
    </button>
  )
}
