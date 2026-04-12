import Link from "next/link"
import Image from "next/image"
import { chapters } from "@/lib/chapters"

export default function ChapterNav({
  currentChapterId,
}: {
  currentChapterId?: string
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
      {chapters.map((ch) => {
        const isActive = ch.id === currentChapterId

        return (
          <Link
            key={ch.id}
            href={`/luku/${ch.id}`}
            className={`group block rounded-lg border overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${
              isActive
                ? "border-brand bg-brand-bg shadow-sm"
                : "border-gray-200 bg-white hover:border-brand"
            }`}
          >
            <div className="relative h-32 overflow-hidden">
              <Image
                src={ch.image}
                alt={ch.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white/70">
                  {ch.number}
                </span>
                <h3 className="text-base font-bold text-white">
                  {ch.shortTitle}
                </h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted line-clamp-2 mb-2">
                {ch.description}
              </p>
              <span className="text-xs text-muted">
                {ch.articleCount} {ch.articleCount === 1 ? "artikkeli" : "artikkelia"}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
