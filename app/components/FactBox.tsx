export default function FactBox({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border-l-4 border-fact-border bg-fact-bg p-5 my-6">
      {title && <p className="font-bold text-gray-900 mb-2">{title}</p>}
      <div className="text-sm leading-relaxed text-gray-800">{children}</div>
    </div>
  )
}
