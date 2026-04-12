import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { chapters, getChapter } from "@/lib/chapters"
import { getArticlesByChapter } from "@/lib/articles"
import ChapterNav from "@/app/components/ChapterNav"
import ArticleCard from "@/app/components/ArticleCard"

export function generateStaticParams() {
  return chapters.map((ch) => ({ id: ch.id }))
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const chapter = getChapter(id)

  if (!chapter) {
    notFound()
  }

  const prevChapter =
    chapter.number > 1
      ? chapters.find((c) => c.number === chapter.number - 1)
      : null
  const nextChapter = chapters.find((c) => c.number === chapter.number + 1)

  return (
    <div>
      {/* Header-kuva */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <Image
          src={chapter.image}
          alt={chapter.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <nav className="text-sm text-white/70 mb-2">
            <Link href="/" className="hover:text-white transition-colors">
              Etusivu
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">{chapter.title}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            <span className="text-white/70">Luku {chapter.number}.</span>{" "}
            {chapter.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-lg text-muted max-w-3xl leading-relaxed">
          {chapter.description}
        </p>

        {/* Artikkelit */}
        {(() => {
          const articles = getArticlesByChapter(id)
          if (articles.length === 0) {
            return (
              <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 text-center">
                <p className="text-muted">Artikkelit lisätään pian</p>
              </div>
            )
          }
          return (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-muted">{articles.length} artikkelia tässä luvussa</p>
              {articles.map((a) => (
                <ArticleCard
                  key={a.meta.slug}
                  title={a.meta.title}
                  excerpt={a.meta.description}
                  href={`/${a.meta.slug}`}
                  chapterNumber={a.meta.chapter}
                  articleNumber={a.meta.articleNumber}
                />
              ))}
            </div>
          )
        })()}

        {/* Navigaatio edellinen/seuraava */}
        <div className="mt-12 flex justify-between items-center">
          {prevChapter ? (
            <Link
              href={`/luku/${prevChapter.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-light transition-colors"
            >
              <span>&larr;</span> Edellinen luku
            </Link>
          ) : (
            <div />
          )}
          {nextChapter ? (
            <Link
              href={`/luku/${nextChapter.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-light transition-colors"
            >
              Seuraava luku <span>&rarr;</span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Kaikki luvut */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Kaikki luvut</h2>
          <ChapterNav currentChapterId={chapter.id} />
        </div>
      </div>
    </div>
  )
}
