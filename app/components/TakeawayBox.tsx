export default function TakeawayBox({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border-l-4 border-brand-border bg-brand-bg p-5 my-6">
      <p className="font-bold text-brand mb-2">Muista hankinnoissa</p>
      <div className="text-sm leading-relaxed text-gray-800">{children}</div>
    </div>
  )
}
