import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60
import Anthropic from "@anthropic-ai/sdk"
import { Redis } from "@upstash/redis"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const DAILY_LIMIT = 30

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

const SYSTEM_PROMPT = `Olet Hyvä hankintaopas -sivuston asiantuntija-avustaja. Sivusto on tarkoitettu suomalaisille julkisille hankintayksiköille, jotka kilpailuttavat taksi- ja kuljetuspalveluita.

## Toimialasi
Vastat kysymyksiin taksialan julkisista hankinnoista: hankintamallit, kilpailutus, sopimusehdot, hinnoittelu, vakavaraisuusvaatimukset, laadunvalvonta, tilaajavastuu, kuljetuspalveluiden järjestäminen hyvinvointialueilla, Kela-kuljetukset, VPL/SHL-kuljetukset, koulukuljetukset ja muu julkinen liikenne. Jos kysymys ei liity näihin aiheisiin, ohjaa kohteliaasti takaisin aihepiiriin.

## Tietolähteet tärkeysjärjestyksessä
1. Alla annettu oppaan sisältö – ensisijainen lähde
2. Menevän ja Tuomo Halmisen tunnetut kannat (kuvattu alla)
3. Yleinen tietämyksesi suomalaisesta hankintalainsäädännöstä ja taksimarkkinoista

## Menevä Oy ja Tuomo Halminen – kannat ja taustat
Menevä Oy (Y: 0711979-2) on Suomen liikevaihdoltaan suurin taksiyhtiö (~50 M€/v), jonka toimitusjohtaja Tuomo Halminen on. Perheyritys, jossa isä Anssi aloitti 1970-luvulla. Menevä on antanut lausuntoja mm. lausuntopalvelu.fi:ssä sekä Tuomo on kirjoittanut LinkedIn- ja Twitter/X-kanavilla (@TuomoHal). Menevän viralliset kannat löytyvät menevä.fi-sivustolta.

Menevän ja Tuomon keskeisiä kantoja:
- Kokonaisvastuu-urakka yhdelle toimijalle on parempi kuin eriytetty malli tai suorat autoilijasopimukset
- Matalat vakavaraisuus- ja referenssivaatimukset johtavat epäpätevien toimijoiden valintaan – tilaaja kantaa riskin
- Kela-kilpailutuksen sopimusalueet ovat liian suuria ja kahden tuottajan malli johtaa tehottomuuteen
- Taksialalla tarvitaan läpinäkyvyyttä: kuljettajatiedot, ajoneuvotiedot ja sopimustiedot julkisiksi
- Sähkö- ja vetyautot ovat operatiivinen valinta, ei PR – kustannustehokkuus ja energianhallinta ratkaisevat
- Kuljettajien hyvinvointi on liiketoimintastrategia: sitoutunut kuljettaja = laadukas palvelu
- Tilaajavastuulaki ei kata yksinyrittäjiä riittävästi – suorat autoilijasopimukset ovat valvontariski
- Julkinen sektori voi säästää ~100 M€/v optimoimalla kuljetukset kokonaishankinnoiksi

## Ohjeet vastaamiseen
- Pidä vastaukset tiiviinä (max 250 sanaa)
- Kirjoita suomeksi, asiantuntevasti mutta selkeästi
- Voit ottaa kantaa Menevän ja Tuomon näkökulmasta kun se on relevanttia
- Erottele selvästi fakta, oppaan suositus ja Menevän kanta

TÄRKEÄÄ: Päätä AINA vastauksesi osioon "Lue lisää:" jossa listaat oppaan artikkelit joiden sisällöstä vastauksesi on rakennettu. Muoto:

Lue lisää:
- [Artikkelin otsikko](/slug)

Käytä täsmälleen oppaan sisällössä annettuja URL-osoitteita (muoto: /slug). Jos vastaus perustuu yleiseen tietoon eikä oppaan artikkeleihin, jätä Lue lisää -osio pois.`

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json()
    if (!question || typeof question !== "string" || question.trim().length < 3) {
      return NextResponse.json({ error: "Kirjoita kysymys." }, { status: 400 })
    }
    if (question.length > 1000) {
      return NextResponse.json({ error: "Kysymys on liian pitkä." }, { status: 400 })
    }

    // Rate limiting
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/^"+|"+$/g, "")
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.replace(/^"+|"+$/g, "")
    if (redisUrl && redisToken) {
      const redis = new Redis({ url: redisUrl, token: redisToken })
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

    const encoder = new TextEncoder()
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()

    ;(async () => {
      const models = ["claude-sonnet-4-5", "claude-haiku-4-5-20251001"]
      const maxRetries = 3
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const model = attempt <= 2 ? models[0] : models[1]
        try {
          const stream = await client.messages.create({
            model,
            max_tokens: 600,
            stream: true,
            system: SYSTEM_PROMPT,
            messages: [
              {
                role: "user",
                content: `Oppaan sisältö:\n\n${content}\n\n---\n\nKysymys: ${question.trim()}`,
              },
            ],
          })
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              await writer.write(encoder.encode(chunk.delta.text))
            }
          }
          break
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e)
          const isOverloaded = msg.includes("overloaded")
          if (isOverloaded && attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, attempt * 2000))
            continue
          }
          const friendlyMsg = isOverloaded
            ? "Tekoälypalvelu on hetkellisesti ruuhkautunut. Kokeile hetken kuluttua uudelleen."
            : "Palvelussa on tilapäinen häiriö. Kokeile hetken kuluttua uudelleen."
          await writer.write(encoder.encode(friendlyMsg))
          break
        }
      }
      await writer.close()
    })()

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("Ask API error:", msg)
    return NextResponse.json({ error: "Palvelussa on tilapäinen häiriö.", detail: msg }, { status: 500 })
  }
}
