# hyvahankintaopas.fi – Projektikuvaus

Päivitetty: 2026-04-12

## Mikä tämä on

Verkkosivusto julkisten taksihankintojen kehittämiseen. Tuomo Halminen (Menevä Oy) kirjoittanut oppaan, joka on julkaistu osoitteessa **hyvahankintaopas.fi**.

Sisältö: 6 lukua, yhteensä ~58 artikkelia. Tavoite on ohjata kuntien ja hyvinvointialueiden hankintahenkilöitä tekemään parempia taksihankintoja kokonaisvastuumallilla.

---

## Tekninen pino

| Asia | Tieto |
|------|-------|
| Framework | Next.js (App Router) + React + TypeScript |
| UI | Tailwind CSS v4 |
| Sisältö | MDX-tiedostot `content/`-kansiossa |
| Hosting | Vercel (Pro) |
| Repo | github.com/tuomohalminen-blip/hyvahankintaopas |
| Haara | `main` → tuotanto automaattisesti |
| Domain | hyvahankintaopas.fi (Zoner/Louhi DNS) |
| Dev-serveri | `hankintaopas`-profiili portissa 3002 (launch.json) |

---

## Hakemistorakenne

```
hankintaopas/
  app/
    page.tsx                  – Etusivu
    [slug]/page.tsx           – Artikkelin sivu (custom MDX-renderer)
    luku/[id]/page.tsx        – Luvun artikkelilista
    tietoa/page.tsx           – Tietoa kirjoittajasta
    components/
      ArticleCard.tsx
      ChapterNav.tsx
      FactBox.tsx             – Sininen faktalaatikko
      Footer.tsx
      Header.tsx
      OpinionNote.tsx         – Keltainen mielipidelaatikko
      ShareButtons.tsx        – LinkedIn / X / Facebook (pystysuora)
      TakeawayBox.tsx         – Vihreä muistilista
  content/
    1-perusteet/              – 7 artikkelia ✅
    2-taksimarkkinat/         – 12 artikkelia ✅
    3-tuottaminen/            – 12 artikkelia ✅
    4-hankintamallit/         – 16 artikkelia ✅
    5-kilpailutus/            – 5 artikkelia ✅
    6-toteutuneet/            – 1 artikkeli ⏳ (Word-tiedosto tekemättä)
  lib/
    articles.ts               – Lukee MDX-tiedostot fs:llä
    chapters.ts               – Luvut ja niiden metadata
  public/pictures/            – Kaikki kuvat
  next.config.ts              – outputFileTracingIncludes content/
```

---

## Sisällön lisääminen (workflow)

1. Tuomo kommentoi Word-tiedoston (`hankintaopas-lukuX.docx`)
2. Aja agentti: lue docx Pythonilla, luo MDX-tiedostot `content/X-kansionimi/`
3. Tarkista yksi artikkeli selaimessa (localhost:3002)
4. `git add content/... && git commit -m "..." && git push`
5. Vercel buildaa automaattisesti → hyvahankintaopas.fi päivittyy

### MDX-tiedoston rakenne

```mdx
---
title: "Artikkelin otsikko"
chapter: 2
articleNumber: 1
slug: "url-slug-suomeksi"
description: "Lyhyt kuvaus (näkyy ingressinä vihreässä laatikossa)"
---

# Artikkelin otsikko

## Väliotsikko

Tekstiä...

<FactBox title="Otsikko">
Faktateksti
</FactBox>

<OpinionNote>
Kirjoittajan näkemys
</OpinionNote>

<TakeawayBox>
- Muistipiste 1
- Muistipiste 2
</TakeawayBox>
```

**Tärkeää:** Älä kirjoita intro-kappaletta `# otsikon` ja ensimmäisen `## väliotsikon` väliin – se poistetaan automaattisesti koska ingressi (description) näyttää saman asian.

### Kuvan lisääminen artikkeliin

```mdx
![Kuvan alt-teksti](/pictures/tiedostonimi.png)
```

Kopioi kuva ensin kansioon `public/pictures/` (siistillä nimellä, ei välilyöntejä).

---

## Tärkeät koodikodat

### Custom MDX-renderer (`app/[slug]/page.tsx`)
- Ei käytä `@next/mdx` – parsii MDX-sisällön itse
- Tukee: `## otsikot`, `**bold**`, `*italic*`, `-` listat, `1.` numeroidut listat, `![]()`-kuvat
- Komponentit: `<TakeawayBox>`, `<OpinionNote>`, `<FactBox title="...">`
- `removeLeadingRepeat()` poistaa intro-kappaleen automaattisesti

### Artikkelien lataus (`lib/articles.ts`)
- `getArticlesByChapter(id)` – luvun kaikki artikkelit
- `getArticleBySlug(slug)` – yksittäinen artikkeli
- `getAllArticles()` – kaikki artikkelit järjestyksessä
- `next.config.ts`: `outputFileTracingIncludes` pakottaa content/-kansion mukaan Vercel-bundleen

---

## Etusivun kaaviot

| Tiedosto | Kuvaus |
|----------|--------|
| `/pictures/kaavio-hinnan-kehitys.png` | Kela-matkojen hinnan kehitys 2016–2033 |
| `/pictures/kaavio-matkojen-maara.png` | Kelamatkojen määrä, toteuma ja ennuste |
| `/pictures/kaavio-kustannusennuste.png` | Kustannusennuste: nykyinen vs. tehokas malli |

---

## Git-workflow

```bash
# Normaali muutos
git add tiedosto
git commit -m "Lyhyt kuvaus"
git push   # → main-haara → Vercel buildaa automaattisesti
```

**Huom:** Paikallinen dev-serveri käynnistyy `preview_start`-työkalulla nimellä `hankintaopas` (portti 3002). Vercel-deploymentin tila näkyy github.com/tuomohalminen-blip/hyvahankintaopas tai Vercel-dashboardissa.

---

## Avoimet asiat

- [ ] **Luku 6** – `hankintaopas-luku6.docx` tekemättä (1 artikkeli)
- [ ] Luvut 5–6 eivät ehkä näy vielä oikein mobiilissa (testaa)
- [ ] Harkitse: Google Analytics tai Vercel Web Analytics käyttöön
- [ ] Harkitse: hakutoiminto sivustolle (kaikki artikkelit haettavissa)

---

## Brändi

- Pääväri: `#004D46` (tumma vihreä)
- Korostus: `#006B5E`
- Taustasävy: `#E0F2F1`
- Ingressilaatikko: vihreä vasen reunus + `#E0F2F1` tausta
- Font: järjestelmäfontti (ei erikoisfonttia)
- Tone of voice: asiantunteva mutta selkeä, ei virastokieltä
