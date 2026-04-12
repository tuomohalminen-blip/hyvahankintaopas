export interface Chapter {
  id: string
  number: number
  title: string
  shortTitle: string
  description: string
  articleCount: number
  image: string
}

export const chapters: Chapter[] = [
  {
    id: "1-perusteet",
    number: 1,
    title: "Julkisten hankintojen perusteet",
    shortTitle: "Perusteet",
    description: "Miksi taksihankinnat ovat poikkeuksellisen vaikeita, mitä hyvällä hankinnalla voi saavuttaa ja ketkä vaikuttavat päätöksentekoon.",
    articleCount: 7,
    image: "/pictures/Gemini_Generated_Image_khdgoykhdgoykhdg-copy.jpg",
  },
  {
    id: "2-taksimarkkinat",
    number: 2,
    title: "Taksimarkkinat",
    shortTitle: "Markkinat",
    description: "Miten taksimarkkinat toimivat, millaisia yritystyyppejä markkinoilla on ja mitä julkiset hankinnat merkitsevät alan kehitykselle.",
    articleCount: 12,
    image: "/pictures/Meneva-taksi-kadunvarrella-1536x954.jpg",
  },
  {
    id: "3-tuottaminen",
    number: 3,
    title: "Taksipalveluiden tuottaminen",
    shortTitle: "Tuottaminen",
    description: "Resurssit, teknologia, kustannusrakenne ja tehokkuus – mitä palveluntuottajalta vaaditaan ja miten sitä arvioidaan.",
    articleCount: 12,
    image: "/pictures/yksityiskohta-taksilaitteista-tilataksissa-1536x864.jpg",
  },
  {
    id: "4-hankintamallit",
    number: 4,
    title: "Hankintamallit ja sopimus",
    shortTitle: "Hankintamallit",
    description: "Hinnoittelumallit, urakkamuodot, sopimusehdot ja valvonta – käytännön työkalut hankinnan tekijälle.",
    articleCount: 16,
    image: "/pictures/taksinkuljettaja-kavelemassa-sairaalaan-asiakkaan-kanssa-kainuussa-1536x838.jpg",
  },
  {
    id: "5-kilpailutus",
    number: 5,
    title: "Kilpailutuksen järjestäminen",
    shortTitle: "Kilpailutus",
    description: "Datan hyödyntäminen, markkinoiden rakentaminen, lainsäädäntö ja harmaan talouden torjunta.",
    articleCount: 5,
    image: "/pictures/kupu3-1536x833.jpg",
  },
  {
    id: "6-toteutuneet",
    number: 6,
    title: "Toteutuneet hankinnat",
    shortTitle: "Toteutuneet",
    description: "Käytännön esimerkkejä ja oppeja toteutuneista hankinnoista – mikä toimi ja mikä ei.",
    articleCount: 1,
    image: "/pictures/naiskuljettaja-hakemassa-lapsia-koululaiskyytiin-1536x967.jpg",
  },
]

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id)
}

export function getChapterByNumber(num: number): Chapter | undefined {
  return chapters.find((c) => c.number === num)
}
