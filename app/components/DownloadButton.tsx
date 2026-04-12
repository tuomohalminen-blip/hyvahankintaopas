export default function DownloadButton({
  href,
  label,
  type,
}: {
  href: string
  label: string
  type?: "pdf" | "xlsx" | "docx" | "png" | string
}) {
  const icons: Record<string, string> = {
    pdf: "📄",
    xlsx: "📊",
    docx: "📝",
    png: "🖼️",
  }
  const icon = type ? (icons[type] ?? "📎") : "📎"

  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-3 rounded-lg border border-[#004D46] bg-white px-4 py-3 text-sm font-medium text-[#004D46] hover:bg-[#E0F2F1] transition-colors no-underline my-1 w-full sm:w-auto"
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
      <span className="ml-auto text-xs text-[#6b7280]">Lataa →</span>
    </a>
  )
}
