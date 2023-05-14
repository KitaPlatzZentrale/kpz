import React from "react";
import Layout from "./layout";

type ImprintPageProps = {};

const ImprintPage: React.FC<ImprintPageProps> = ({}) => {
  return (
    <Layout>
      <div className="page-padding pb-40 pt-24">
        <h1 className="mb-14 text-4xl font-extrabold">Impressum</h1>
        <div className="flex w-full flex-col gap-12">
          <section>
            <h2 className="mb-5 text-2xl font-bold">Angaben gemäß §5 TMG</h2>
            <p className="text-base font-normal leading-normal text-gray-700">
              Anthony Sherrill
              <br />
              Darjusch Schrand
              <br />
              Hanno Grimm
              <br />
              Irakli Goderdzishvili
              <br />
              Studentenprojekt von Studierenden der CODE University of Applied
              Sciences Berlin
              <br />
              Lohmühlenstraße 65
              <br />
              12435 Berlin
            </p>
          </section>
          <section>
            <h2 className="mb-5 text-2xl font-bold">Kontakt</h2>
            <p className="text-base font-normal leading-normal text-gray-700">
              Telefon: +49 171 4965186
              <br />
              E-Mail: hallo@kitaplatz-zentrale.de
            </p>
          </section>
          <section>
            <h2 className="mb-5 text-2xl font-bold">
              Redaktionell verantwortlich
            </h2>
            <p className="text-base font-normal leading-normal text-gray-700">
              Anthony Sherrill
              <br />
              Darjusch Schrand
              <br />
              Hanno Grimm
              <br />
              Irakli Goderdzishvili
            </p>
          </section>
          <section>
            <h2 className="mb-5 text-2xl font-bold">EU-Streitschlichtung</h2>
            <p className="text-base font-normal leading-normal text-gray-700">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                className="text-happy-blue"
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              .<br /> Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>
          <section>
            <h2 className="mb-5 text-2xl font-bold">
              Verbraucherstreitbeilegung/Universalschlichtungsstelle
            </h2>
            <p className="text-base font-normal leading-normal text-gray-700">
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </section>
          <section>
            <p className="text-base font-normal leading-normal text-gray-700">
              Quelle der überliegenden Punkten:{" "}
              <a
                className="text-happy-blue"
                href="https://www.e-recht24.de/impressum-generator.html"
                target="_blank"
              >
                https://www.e-recht24.de/impressum-generator.html
              </a>
            </p>
          </section>
          <section>
            <h2 className="mb-5 text-2xl font-bold">Haftung für Inhalte</h2>
            <p className="text-base font-normal leading-normal text-gray-700">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
              jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die
              auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="text-base font-normal leading-normal text-gray-700">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
              Informationen nach den allgemeinen Gesetzen bleiben hiervon
              unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
              Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
              Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
              diese Inhalte umgehend entfernen.
            </p>
          </section>
          <section>
            <h2 className="mb-5 text-2xl font-bold">Haftung für Links</h2>
            <p className="text-base font-normal leading-normal text-gray-700">
              Unser Angebot enthält Links zu externen Websites Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
              wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
              überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
              Verlinkung nicht erkennbar.
            </p>
            <p className="text-base font-normal leading-normal text-gray-700">
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
              jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
              zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
              derartige Links umgehend entfernen.
            </p>
          </section>
          <section>
            <h2 className="mb-5 text-2xl font-bold">Urheberrecht</h2>
            <p className="text-base font-normal leading-normal text-gray-700">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht
              kommerziellen Gebrauch gestattet.
            </p>
            <p className="text-base font-normal leading-normal text-gray-700">
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
              wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
              werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
              trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
              bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
              Rechtsverletzungen werden wir derartige Inhalte umgehend
              entfernen.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ImprintPage;
