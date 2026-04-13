import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { Redis } from "@upstash/redis"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const DAILY_LIMIT = 10

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

function loadAllContent(): string {
  const contentDir = path.join(process.cwd(), "content")
  if (!fs.existsSync(contentDir)) return ""

  const chapters = fs
    .readdirSync(contentDir)
    .filter((d) => fs.statSync(path.join(contentDir, d)).isDirectory())
    .sort()

  const parts: string[] = []
  for (const ch of chapters) {
    const files = fs
      .readdirSync(path.join(contentDir, ch))
      .filter((f) => f.endsWith(".mdx"))
      .sort()
    for (const file of files) {
      const raw = fs.readFileSync(path.join(contentDir, ch, file), "utf-8")
      const { data, content } = matter(raw)
      parts.push(`## ${data.title}\nURL: /${data.slug}\n${content}`)
    }
  }
  return parts.join("\n\n---\n\n")
}

const SYSTEM_PROMPT = `Olet Hyvä hankintaopas -sivuston avustaja. Sivusto on tarkoitettu suomalaisille julkisille hankintayksiköille, jotka kilpailuttavat taksi- ja kuljetuspalveluita.

Vastauksesi perustuvat YKSINOMAAN alla olevaan oppaan sisältöön. Et vastaa muihin kysymyksiin. Jos kysymys ei liity oppaan aiheisiin (taksialan julkiset hankinnat, kilpailutus, hankintamallit, kuljetuspalvelut), sano lyhyesti: "Tämä kysymys ei kuulu oppaan aihepiiriin. Voin auttaa taksialan julkisiin hankintoihin liittyvissä kysymyksissä."

Pidä vastaukset tiiviinä (max 200 sanaa). Kirjoita suomeksi.

TÄRKEÄÄ: Päätä AINA vastauksesi osioon "Lue lisää:" jossa listaat ne artikkelit joiden sisällöstä vastauksesi on rakennettu. Muoto:

Lue lisää:
- [Artikkelin otsikko](/slug)
- [Artikkelin otsikko](/slug)

Käytä täsmälleen oppaan sisällössä annettuja URL-osoitteita (muoto: /slug).`

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json()
    if (!question || typeof question !== "string" || question.trim().length < 3) {
      return NextResponse.json({ error: "Kirjoita kysymys." }, { status: 400 })
    }
    if (question.length > 500) {
      return NextResponse.json({ error: "Kysymys on liian pitkä." }, { status: 400 })
    }

    // Rate limiting
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/^"+|"+$/g, "")
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.replace(/^"+|"+$/g, "")
    if (redisUrl && redisToken) {
      const redis = new Redis({
        url: redisUrl,
        token: redisToken,
      })
      const ip = getClientIp(req)
      const key = `ask:${ip}:${new Date().toISOString().slice(0, 10)}`
      const count = await redis.incr(key)
      if (count === 1) await redis.expire(key, 86400)
      if (count > DAILY_LIMIT) {
        return NextResponse.json(
          { error: `Päivittäinen kysymysraja (${DAILY_LIMIT}) täynnä. Kokeile huomenna uudelleen.` },
          { status: 429 }
        )
      }
    }

    const content = loadAllContent()
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Oppaan sisältö:\n\n${content}\n\n---\n\nKysymys: ${question.trim()}`,
        },
      ],
    })

    const answer =
      message.content[0].type === "text" ? message.content[0].text : ""

    return NextResponse.json({ answer })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("Ask API error:", msg)
    return NextResponse.json({ error: "Palvelussa on tilapäinen häiriö.", detail: msg }, { status: 500 })
  }
}
