export default function OpinionNote({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border-l-4 border-opinion-border bg-opinion-bg p-5 my-6">
      <p className="font-bold text-gray-900 mb-2">Kirjoittajan nakemys:</p>
      <div className="text-sm leading-relaxed text-gray-800">{children}</div>
    </div>
  )
}
