import Link from "next/link"
import Image from "next/image"
import ChapterNav from "@/app/components/ChapterNav"
import AskHeroButton from "@/app/components/AskHeroButton"

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-brand text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/pictures/Taksijono-sairaalan-edustalla-e1770203858998.jpg"
            alt="Taksijono sairaalan edustalla"
            fill
            className="object-cover opacity-25"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-2xl">
            Taksialan julkiset hankinnat
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-lg">
            Opas hankintojen tekijöille ja päättäjille
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/luku/1-perusteet"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-brand font-semibold hover:bg-gray-100 transition-colors"
            >
              Aloita lukeminen
            </Link>
            <Link
              href="/tietoa"
              className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-white/60 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Tietoa oppaasta
            </Link>
            <AskHeroButton />
          </div>
          <p className="mt-3 text-sm text-white/60">
            Tekoälyavustaja vastaa oppaan sisällön pohjalta – ei yleisneuvoja, vaan alan asiantuntemus
          </p>
        </div>
      </section>

      {/* 25/25/25 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-brand">25%</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">säästöt</p>
            <p className="mt-2 text-sm text-muted">
              Optimoinnilla noin 100M&euro; vuosisäästö
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-brand">25%</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              parempi laatu
            </p>
            <p className="mt-2 text-sm text-muted">
              Selkeät vastuut ja tehokkaampi palvelu
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-brand">25%</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              paremmat palkat
            </p>
            <p className="mt-2 text-sm text-muted">
              Sitoutuneet kuljettajat, laadukas palvelu
            </p>
          </div>
        </div>
      </section>

      {/* Kuvarivi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image src="/pictures/mieskuljettaja-avustaa-vanhusta.jpg" alt="Kuljettaja avustaa vanhusta" fill className="object-cover" />
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image src="/pictures/naiskuljettaja-avustaa-rollaattorilla-liikkuvaa-asiakasta-02-e1770207999716.jpg" alt="Kuljettaja avustaa rollaattorilla liikkuvaa asiakasta" fill className="object-cover" />
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden hidden md:block">
            <Image src="/pictures/taksinkuljettaja-asiakkaan-kanssa-matkalla.jpg" alt="Kuljettaja asiakkaan kanssa matkalla" fill className="object-cover" />
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden hidden md:block">
            <Image src="/pictures/taksinkuljettaja-avaa-ovea-senioriasiakkaalle-e1770205320553.jpg" alt="Kuljettaja avaa ovea senioriasiakkaalle" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Kaaviot – todistusaineisto */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Miksi hankintamalleja pitää muuttaa?
          </h2>
          <p className="text-muted mb-10 max-w-3xl">
            Nykyiset mallit eivät paranna luotettavuutta, hillitse kustannuksia eivätkä tue markkinoiden kehitystä palveluiden tarpeen kasvaessa.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="relative w-full aspect-[5/3]">
                <Image
                  src="/pictures/kaavio-hinnan-kehitys.png"
                  alt="Kela-matkojen hinnan kehitys suhteessa yksikköhintoihin ja indeksiin, toteuma ja ennuste 2016–2033"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-3 text-sm text-muted">
                Yksikköhinnat pysyvät samalla tasolla kilpailutuksen ansiosta, mutta toteutunut kustannus per matka nousee silti.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="relative w-full aspect-[5/3]">
                <Image
                  src="/pictures/kaavio-matkojen-maara.png"
                  alt="Kelamatkojen määrä, toteuma ja ennuste 2016–2033"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-3 text-sm text-muted">
                Matkojen määrä kasvaa ~60 000/vuosi. Yli 80-vuotiaiden määrä tuplaantuu 10 vuodessa.
              </p>
            </div>
          </div>
          <div className="mt-8">
              <div className="relative w-full h-[300px]">
                <Image
                  src="/pictures/kaavio-kustannusennuste.png"
                  alt="Kela- ja VPL-kyytien kustannusennuste: nykyinen vs. tehokas malli"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-3 text-sm text-muted text-center">
                Kustannusero nykyisen ja tehokkaan mallin välillä on yli 100 miljoonaa euroa vuodessa.
              </p>
            </div>
        </div>
      </section>

      {/* Luvut */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Oppaan sisältö
        </h2>
        <ChapterNav />
      </section>

      {/* Kirjoittajasta */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-28 h-28 rounded-full overflow-hidden relative">
              <Image
                src="/pictures/tuomo-halminen.jpg"
                alt="Tuomo Halminen"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Tuomo Halminen
              </h2>
              <p className="mt-3 text-muted leading-relaxed max-w-2xl">
                Olen hengittänyt taksialaa koko viisikymmenvuotisen elämäni.
                Isäni Anssi aloitti taksiautoilijana 1970-luvulla ja perusti
                Helsingin Taksipalvelu Oy:n vuonna 1982. Tänään johdan Menevä
                Oy:tä, Suomen liikevaihdoltaan suurinta taksiyhtiötä.
              </p>
              <Link
                href="/tietoa"
                className="mt-4 inline-block text-brand font-medium hover:text-brand-light transition-colors"
              >
                Lue lisää &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
