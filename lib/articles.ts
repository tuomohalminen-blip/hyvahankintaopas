import fs from "fs"
import path from "path"
import matter from "gray-matter"

const contentDir = path.join(process.cwd(), "content")

export interface ArticleMeta {
  title: string
  chapter: number
  articleNumber: number
  slug: string
  description: string
}

export interface Article {
  meta: ArticleMeta
  content: string
  filePath: string
}

export function getArticlesByChapter(chapterId: string): Article[] {
  const chapterDir = path.join(contentDir, chapterId)
  if (!fs.existsSync(chapterDir)) return []

  const files = fs.readdirSync(chapterDir).filter((f) => f.endsWith(".mdx"))
  files.sort()

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(chapterDir, file), "utf-8")
    const { data, content } = matter(raw)
    return {
      meta: data as ArticleMeta,
      content,
      filePath: path.join(chapterId, file),
    }
  })
}

export function getArticleBySlug(slug: string): Article | null {
  // Search all chapter folders
  if (!fs.existsSync(contentDir)) return null
  const chapters = fs.readdirSync(contentDir).filter((d) => {
    return fs.statSync(path.join(contentDir, d)).isDirectory()
  })

  for (const ch of chapters) {
    const files = fs.readdirSync(path.join(contentDir, ch)).filter((f) => f.endsWith(".mdx"))
    for (const file of files) {
      const raw = fs.readFileSync(path.join(contentDir, ch, file), "utf-8")
      const { data, content } = matter(raw)
      if ((data as ArticleMeta).slug === slug) {
        return {
          meta: data as ArticleMeta,
          content,
          filePath: path.join(ch, file),
        }
      }
    }
  }
  return null
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(contentDir)) return []
  const chapters = fs.readdirSync(contentDir).filter((d) => {
    return fs.statSync(path.join(contentDir, d)).isDirectory()
  })
  chapters.sort()

  const all: Article[] = []
  for (const ch of chapters) {
    all.push(...getArticlesByChapter(ch))
  }
  return all
}
