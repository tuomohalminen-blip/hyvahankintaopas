import Link from "next/link"
import Image from "next/image"

export default function TietoaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Tietoa oppaasta
      </h1>

      {/* Kirjoittajan esittely */}
      <section className="mt-10">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden relative">
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
            <p className="text-muted">Toimitusjohtaja, Menevä Oy</p>
          </div>
        </div>
        <div className="mt-6 space-y-4 text-muted leading-relaxed">
          <p>
            Olen hengittänyt taksialaa koko viisikymmenvuotisen elämäni. Isäni
            Anssi aloitti taksiautoilijana 1970-luvulla ja perusti Helsingin
            Taksipalvelu Oy:n vuonna 1982. Tänään johdan Menevä Oy:tä, Suomen
            liikevaihdoltaan suurinta taksiyhtiötä, jonka liikevaihto on noin 50
            miljoonaa euroa vuodessa.
          </p>
          <p>
            Perheyrityksenä olemme kasvaneet henkilö kerrallaan, ilman
            merkittävää ulkoista pääomaa. Tiedän, miltä taksialalla tuntuu sekä
            ratin takana, toimistossa että neuvottelupöydässä.
          </p>
          <p>
            Tämä opas perustuu vuosikymmenten kokemukseen taksipalveluiden
            tuottamisesta, julkisten hankintojen kilpailutuksista ja
            sopimusneuvotteluista.
          </p>
        </div>
      </section>

      {/* Oppaan tarkoitus */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900">Oppaan tarkoitus</h2>
        <div className="mt-4 space-y-4 text-muted leading-relaxed">
          <p>
            <strong className="text-gray-900">Kenelle?</strong> Hankintayksiköille,
            päättäjille ja kaikille, jotka osallistuvat taksipalveluiden
            julkisten hankintojen valmisteluun tai päätöksentekoon.
          </p>
          <p>
            <strong className="text-gray-900">Miksi?</strong> Julkisten
            taksihankintojen arvo Suomessa on satoja miljoonia euroja vuodessa.
            Silti hankintoja tehdään usein puutteellisella ymmärryksellä alan
            erityispiirteistä. Tämä opas pyrkii tuomaan käytännön tietoa
            päätöksenteon tueksi.
          </p>
          <p>
            <strong className="text-gray-900">Mitä hyötyä?</strong> Opas auttaa
            ymmärtämään taksimarkkinoiden dynamiikkaa, palvelun tuottamisen
            kustannusrakennetta ja erilaisten hankintamallien vaikutuksia
            palvelun laatuun, hintaan ja kuljettajien asemaan.
          </p>
        </div>
      </section>

      {/* Some-kanavat */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900">Seuraa</h2>
        <ul className="mt-4 space-y-3">
          <li>
            <a
              href="https://linkedin.com/in/tuomo-halminen-4bb21510a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand-light transition-colors font-medium"
            >
              LinkedIn &rarr;
            </a>
          </li>
          <li>
            <a
              href="https://x.com/TuomoHal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand-light transition-colors font-medium"
            >
              X (Twitter) &rarr;
            </a>
          </li>
          <li>
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand-light transition-colors font-medium"
            >
              Facebook &rarr;
            </a>
          </li>
        </ul>
      </section>

      {/* Yhteystiedot */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900">Yhteystiedot</h2>
        <p className="mt-4 text-muted">
          Sähköposti:{" "}
          <a
            href="mailto:tuomo@meneva.fi"
            className="text-brand hover:text-brand-light transition-colors"
          >
            tuomo@meneva.fi
          </a>
        </p>
      </section>

      {/* Takaisin etusivulle */}
      <div className="mt-12">
        <Link
          href="/"
          className="text-sm font-medium text-brand hover:text-brand-light transition-colors"
        >
          &larr; Takaisin etusivulle
        </Link>
      </div>
    </div>
  )
}
