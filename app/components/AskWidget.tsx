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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [messages, open])

  useEffect(() => {
    const handler = () => setOpen(true)
    document.addEventListener("open-ask-widget", handler)
    return () => document.removeEventListener("open-ask-widget", handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
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

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: "80vh" }}>

            {/* Header */}
            <div className="bg-[#004D46] text-white px-6 py-4 rounded-t-2xl flex items-start justify-between">
              <div>
                <p className="font-semibold text-base">Kysy oppaalta</p>
                <p className="text-sm opacity-75 mt-0.5">Vastaukset perustuvat oppaan sisältöön – voit kysyä useita lauseita</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white text-xl leading-none ml-4 mt-0.5">✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-sm">
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-[#6b7280] text-sm font-medium">Esimerkkikysymyksiä:</p>
                  {[
                    "Mitä vakavaraisuusvaatimuksia palveluntuottajalle suositellaan?",
                    "Mitä eroa on yksikköhinta- ja urakkamallilla?",
                    "Miten sanktiot kannattaa rakentaa kuljetussopimukseen?",
                  ].map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setInput(ex)}
                      className="block w-full text-left px-4 py-2.5 rounded-xl border border-[#E0F2F1] text-[#004D46] hover:bg-[#E0F2F1] transition-colors text-sm"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.role === "user"
                        ? "bg-[#004D46] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] whitespace-pre-wrap"
                        : "bg-[#E0F2F1] text-[#004D46] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] whitespace-pre-wrap leading-relaxed"
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#E0F2F1] text-[#004D46] rounded-2xl rounded-tl-sm px-4 py-3">
                    <span className="animate-pulse text-lg tracking-widest">···</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-3 border-t border-[#E0F2F1]">
              <div className="flex gap-3 items-end">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      send()
                    }
                  }}
                  placeholder="Kirjoita kysymys... (Enter lähettää, Shift+Enter uusi rivi)"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004D46] resize-none leading-relaxed"
                  rows={3}
                  maxLength={1000}
                  disabled={loading}
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="bg-[#004D46] text-white rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-40 hover:bg-[#006B5E] transition-colors self-end"
                >
                  Lähetä
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5 px-1">10 kysymystä päivässä · Vastaukset oppaan sisällöstä</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
