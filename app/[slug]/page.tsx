import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getArticleBySlug, getAllArticles } from "@/lib/articles"
import { getChapterByNumber } from "@/lib/chapters"
import ShareButtons from "@/app/components/ShareButtons"
import TakeawayBox from "@/app/components/TakeawayBox"
import OpinionNote from "@/app/components/OpinionNote"
import FactBox from "@/app/components/FactBox"
import DownloadButton from "@/app/components/DownloadButton"

export function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((a) => ({ slug: a.meta.slug }))
}

// Poistaa intro-kappaleen joka on # otsikon ja ensimmäisen ## väliotsikon välissä
function removeLeadingRepeat(content: string, _description: string): string {
  const lines = content.split("\n")
  const firstH2 = lines.findIndex((l) => l.startsWith("## "))
  if (firstH2 === -1) return content
  // Poista kaikki rivit ennen ensimmäistä ## jotka eivät ole # otsikko
  const before = lines.slice(0, firstH2).filter((l) => l.startsWith("# "))
  const after = lines.slice(firstH2)
  return [...before, ...after].join("\n")
}

// Simple MDX-like renderer: converts markdown content to React elements
function renderContent(content: string) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip empty lines
    if (line.trim() === "") {
      i++
      continue
    }

    // TakeawayBox component
    if (line.trim() === "<TakeawayBox>") {
      const items: string[] = []
      i++
      while (i < lines.length && lines[i].trim() !== "</TakeawayBox>") {
        const item = lines[i].trim()
        if (item.startsWith("- ")) {
          items.push(item.substring(2))
        }
        i++
      }
      i++ // skip closing tag
      elements.push(
        <TakeawayBox key={key++}>
          <ul>
            {items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        </TakeawayBox>
      )
      continue
    }

    // OpinionNote component
    if (line.trim() === "<OpinionNote>") {
      const textLines: string[] = []
      i++
      while (i < lines.length && lines[i].trim() !== "</OpinionNote>") {
        if (lines[i].trim()) textLines.push(lines[i].trim())
        i++
      }
      i++
      const hasMixed = textLines.some((l) => l.startsWith("- ")) && textLines.some((l) => !l.startsWith("- "))
      const isListOnly = textLines.every((l) => l.startsWith("- "))
      elements.push(
        <OpinionNote key={key++}>
          {hasMixed ? (
            <div>
              {(() => {
                const nodes: React.ReactNode[] = []
                let items: string[] = []
                let k = 0
                const flush = () => {
                  if (items.length) {
                    nodes.push(<ul key={k++} className="list-disc pl-4 space-y-1 mb-2">{items.map((it, j) => <li key={j}>{it}</li>)}</ul>)
                    items = []
                  }
                }
                for (const tl of textLines) {
                  if (tl.startsWith("- ")) {
                    items.push(tl.slice(2))
                  } else {
                    flush()
                    nodes.push(<p key={k++} className="font-bold mt-2 mb-1" dangerouslySetInnerHTML={{ __html: formatInline(tl) }} />)
                  }
                }
                flush()
                return nodes
              })()}
            </div>
          ) : isListOnly ? (
            <ul className="list-disc pl-4 space-y-1">
              {textLines.map((l, j) => <li key={j}>{l.slice(2)}</li>)}
            </ul>
          ) : textLines.join(" ")}
        </OpinionNote>
      )
      continue
    }

    // FactBox component
    const factMatch = line.trim().match(/^<FactBox title="([^"]*)"?>?$/)
    if (factMatch) {
      const title = factMatch[1]
      const textLines: string[] = []
      i++
      while (i < lines.length && lines[i].trim() !== "</FactBox>") {
        if (lines[i].trim()) textLines.push(lines[i].trim())
        i++
      }
      i++
      const renderFactLines = () => {
        const nodes: React.ReactNode[] = []
        let listItems: string[] = []
        let k = 0
        const flushList = () => {
          if (listItems.length) {
            nodes.push(<ul key={k++} className="list-disc pl-4 space-y-1 mb-2">{listItems.map((it, j) => <li key={j}>{it}</li>)}</ul>)
            listItems = []
          }
        }
        for (const tl of textLines) {
          const imgM = tl.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
          if (imgM) {
            flushList()
            nodes.push(<figure key={k++} className="my-3"><Image src={imgM[2]} alt={imgM[1]} width={1200} height={900} className="w-full h-auto rounded" />{imgM[1] && <figcaption className="mt-1 text-xs text-center text-[#6b7280]">{imgM[1]}</figcaption>}</figure>)
          } else if (tl.startsWith("- ")) {
            listItems.push(tl.slice(2))
          } else {
            flushList()
            nodes.push(<p key={k++} className="mb-2" dangerouslySetInnerHTML={{ __html: formatInline(tl) }} />)
          }
        }
        flushList()
        return nodes
      }
      elements.push(
        <FactBox key={key++} title={title}>
          <div>{renderFactLines()}</div>
        </FactBox>
      )
      continue
    }

    // DownloadButton component: <DownloadButton href="..." label="..." type="pdf" />
    const dlMatch = line.trim().match(/^<DownloadButton\s+href="([^"]+)"\s+label="([^"]+)"(?:\s+type="([^"]+)")?\s*\/>$/)
    if (dlMatch) {
      const [, href, label, type] = dlMatch
      elements.push(<DownloadButton key={key++} href={href} label={label} type={type} />)
      i++
      continue
    }

    // Markdown image: ![alt](src)
    const imgMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgMatch) {
      const [, alt, src] = imgMatch
      elements.push(
        <figure key={key++} className="my-6">
          <Image src={src} alt={alt} width={1200} height={900} className="w-full h-auto rounded" />
          {alt && <figcaption className="mt-2 text-sm text-center text-[#6b7280]">{alt}</figcaption>}
        </figure>
      )
      i++
      continue
    }

    // H1 heading (skip, already in page title)
    if (line.startsWith("# ") && !line.startsWith("## ")) {
      i++
      continue
    }

    // H2 heading
    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={key++} className="text-xl font-bold text-[#004D46] mt-8 mb-3">
          {line.substring(3)}
        </h3>
      )
      i++
      continue
    }

    // Numbered list item (e.g., "1. **Bold text** ...")
    if (/^\d+\.\s/.test(line.trim())) {
      // Collect paragraph (may span multiple lines)
      let para = line
      i++
      while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("<") && !/^\d+\.\s/.test(lines[i].trim()) && !lines[i].trim().startsWith("- ")) {
        para += " " + lines[i]
        i++
      }
      elements.push(
        <p key={key++} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(para) }} />
      )
      continue
    }

    // Bullet list
    if (line.trim().startsWith("- ")) {
      const items: string[] = []
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().substring(2))
        i++
      }
      elements.push(
        <ul key={key++} className="list-disc list-inside mb-4 space-y-1">
          {items.map((item, j) => (
            <li key={j} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      )
      continue
    }

    // Regular paragraph
    let para = line
    i++
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("<") && !lines[i].trim().startsWith("- ") && !/^\d+\.\s/.test(lines[i].trim())) {
      para += " " + lines[i]
      i++
    }
    elements.push(
      <p key={key++} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(para.trim()) }} />
    )
  }

  return elements
}

function formatInline(text: string): string {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // Italic
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')
  return text
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const chapter = getChapterByNumber(article.meta.chapter)
  const allArticles = getAllArticles()
  const currentIndex = allArticles.findIndex((a) => a.meta.slug === slug)
  const prev = currentIndex > 0 ? allArticles[currentIndex - 1] : null
  const next = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Leivänmurut */}
      <nav className="text-sm text-[#6b7280] mb-6">
        <Link href="/" className="hover:text-[#004D46] transition-colors">
          Etusivu
        </Link>
        <span className="mx-2">/</span>
        {chapter && (
          <>
            <Link href={`/luku/${chapter.id}`} className="hover:text-[#004D46] transition-colors">
              {chapter.number}. {chapter.shortTitle}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-900 font-medium">{article.meta.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Pääsisältö */}
        <article className="flex-1 min-w-0 max-w-3xl prose">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            <span className="text-[#004D46]">{article.meta.chapter}.{article.meta.articleNumber}</span>{" "}
            {article.meta.title}
          </h1>

          <p className="text-lg font-medium text-[#004D46] border-l-4 border-[#004D46] pl-4 mb-8 leading-relaxed bg-[#E0F2F1] py-3 pr-3 rounded-r-lg">{article.meta.description}</p>

          {renderContent(removeLeadingRepeat(article.content, article.meta.description))}
        </article>

        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          {/* Jaa */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <ShareButtons
              url={`https://hyvahankintaopas.fi/${article.meta.slug}`}
              title={article.meta.title}
            />
          </div>
        </aside>
      </div>

      {/* Navigaatio edellinen/seuraava */}
      <div className="mt-12 flex justify-between items-center border-t border-gray-200 pt-6">
        {prev ? (
          <Link
            href={`/${prev.meta.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#004D46] hover:text-[#006B5E] transition-colors"
          >
            <span>&larr;</span>
            <span className="max-w-[200px] truncate">{prev.meta.chapter}.{prev.meta.articleNumber} {prev.meta.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/${next.meta.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#004D46] hover:text-[#006B5E] transition-colors"
          >
            <span className="max-w-[200px] truncate">{next.meta.chapter}.{next.meta.articleNumber} {next.meta.title}</span>
            <span>&rarr;</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
