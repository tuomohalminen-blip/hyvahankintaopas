"use client"

import { useState, useRef, useEffect } from "react"

interface Message {
  role: "user" | "assistant"
  text: string
}

export default function AskWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open])

  useEffect(() => {
    const handler = () => setOpen(true)
    document.addEventListener("open-ask-widget", handler)
    return () => document.removeEventListener("open-ask-widget", handler)
  }, [])

  async function send() {
    const q = input.trim()
    if (!q || loading) return
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text: q }])
    setLoading(true)
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer || data.error || "Jokin meni pieleen." },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Palvelussa on tilapäinen häiriö." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 bg-[#004D46] text-white rounded-full shadow-lg px-5 py-3 text-sm font-medium hover:bg-[#006B5E] transition-colors flex items-center gap-2"
        aria-label="Kysy oppaalta"
      >
        <span>{open ? "✕ Sulje" : "💬 Kysy oppaalta"}</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-[#E0F2F1] flex flex-col" style={{ maxHeight: "70vh" }}>
          {/* Header */}
          <div className="bg-[#004D46] text-white px-4 py-3 rounded-t-2xl">
            <p className="font-semibold text-sm">Kysy oppaalta</p>
            <p className="text-xs opacity-75 mt-0.5">Vastaukset perustuvat oppaan sisältöön</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
            {messages.length === 0 && (
              <p className="text-[#6b7280] text-xs">
                Voit kysyä esimerkiksi: &ldquo;Mitä vakavaraisuusvaatimuksia suositellaan?&rdquo; tai &ldquo;Mitä eroa on yksikköhinta- ja urakkamallilla?&rdquo;
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={
                    m.role === "user"
                      ? "inline-block bg-[#004D46] text-white rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]"
                      : "inline-block bg-[#E0F2F1] text-[#004D46] rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%] whitespace-pre-wrap"
                  }
                >
                  {m.text}
                </span>
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <span className="inline-block bg-[#E0F2F1] text-[#004D46] rounded-2xl rounded-tl-sm px-3 py-2">
                  <span className="animate-pulse">···</span>
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-[#E0F2F1] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Kirjoita kysymys..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#004D46]"
              maxLength={500}
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-[#004D46] text-white rounded-xl px-3 py-2 text-sm font-medium disabled:opacity-40 hover:bg-[#006B5E] transition-colors"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
