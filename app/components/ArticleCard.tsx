import Link from "next/link"

export default function ArticleCard({
  title,
  excerpt,
  href,
  chapterNumber,
  articleNumber,
}: {
  title: string
  excerpt: string
  href: string
  chapterNumber: number
  articleNumber: number
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 text-2xl font-bold text-brand/30">
          {chapterNumber}.{articleNumber}
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-muted line-clamp-2 mb-2">{excerpt}</p>
          <span className="text-sm font-medium text-brand">
            Lue artikkeli &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}
