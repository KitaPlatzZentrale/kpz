import React from "react";
import Layout from "./layout";

type PrivacyPageProps = {};

const PrivacyPage: React.FC<PrivacyPageProps> = ({}) => {
  return (
    <Layout>
      <div className="page-padding h-full w-full pb-40 pt-24 2xl:w-2/3">
        <h1 className="mb-14 text-4xl font-extrabold">Datenschutzerklärung</h1>
        <div className="flex w-full flex-col gap-12">
          <section>
            <h2 className="mb-5 text-2xl font-bold">
              1. Datenschutz auf einen Blick
            </h2>
            <h3 className="mb-3 mt-4 text-xl font-bold">Allgemeine Hinweise</h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Die folgenden Hinweise geben einen einfachen &Uuml;berblick
              dar&uuml;ber, was mit Ihren personenbezogenen Daten passiert, wenn
              Sie diese Website besuchen. Personenbezogene Daten sind alle
              Daten, mit denen Sie pers&ouml;nlich identifiziert werden
              k&ouml;nnen. Ausf&uuml;hrliche Informationen zum Thema Datenschutz
              entnehmen Sie unserer unter diesem Text aufgef&uuml;hrten
              Datenschutzerkl&auml;rung.
            </p>
            <h3 className="mb-3 mt-4 text-xl font-bold">
              Datenerfassung auf dieser Website
            </h3>{" "}
            <h4 className="mb-2 mt-3 text-lg font-semibold">
              Wer ist verantwortlich f&uuml;r die Datenerfassung auf dieser
              Website?
            </h4>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Die Datenverarbeitung auf dieser Website erfolgt durch den
              Websitebetreiber. Dessen Kontaktdaten k&ouml;nnen Sie dem
              Abschnitt &bdquo;Hinweis zur Verantwortlichen Stelle&ldquo; in
              dieser Datenschutzerkl&auml;rung entnehmen.
            </p>{" "}
            <h3 className="mb-2 mt-3 text-lg font-semibold">
              Wie erfassen wir Ihre Daten?
            </h3>
            <h4 className="mb-2 mt-3 text-lg font-semibold">
              Wir bieten folgende Services an, die Daten erfassen:
            </h4>
            <h4 className="mb-2 mt-3 text-lg font-semibold">
              Kita-Platz Benachrichtigungsservice
            </h4>
            <p className="text-base font-normal leading-normal text-gray-700">
              Beschreibung und Umfang der Datenverarbeitung: Auf unserer
              Internetseite besteht die Möglichkeit, einen kostenfreien
              Kita-Platz Benachrichtigungsservice zu abonnieren. Dabei werden
              bei der Anmeldung zum Kita-Platz Benachrichtigungsservice die
              folgenden Daten aus dem Eingabeformular an uns übermittelt:
            </p>
            <br></br>
            <ul>
              {" "}
              <li>E-Mail-Adresse</li>{" "}
            </ul>
            <br></br>
            <p className="text-base font-normal leading-normal text-gray-700">
              Zudem werden folgende Daten bei der Anmeldung erhoben:
            </p>
            <br></br>
            <ul>
              <li className="text-base font-normal leading-normal text-gray-700">
                Datum und Uhrzeit der Registrierung
              </li>
            </ul>
            <br></br>
            <p className="text-base font-normal leading-normal text-gray-700">
              Für die Verarbeitung der Daten wird im Rahmen des Anmeldevorgangs
              Ihre Einwilligung mittels Email-Opt-In-Verfahren eingeholt und auf
              diese Datenschutzerklärung verwiesen. Der Kita-Platz
              Benachrichtigungsservice setzt erst ein, wenn Sie den
              Bestätigungslink in der Einladungs-E-Mail anklicken.
              <br></br>
              Der Versand erfolgt über Amazon-Server (mit Servern im EU-Raum).
              Außer für den Versand erfolgt im Zusammenhang mit der
              Datenverarbeitung für den Kita-Platz Benachrichtigungsservice
              keine Weitergabe der Daten an Dritte. Die Daten werden
              ausschließlich für den Versand des Kita-Platz
              Benachrichtigungsservice verwendet.
            </p>
            <p className="text-base font-normal leading-normal text-gray-700">
              Rechtsgrundlage für die Datenverarbeitung: Rechtsgrundlage für die
              Verarbeitung der Daten nach Anmeldung zum Kita-Platz
              Benachrichtigungsservice durch den Nutzer ist bei Vorliegen einer
              Einwilligung des Nutzers Art. 6 Abs. 1 lit. a DSGVO.
            </p>
            <p className="text-base font-normal leading-normal text-gray-700">
              Zweck der Datenverarbeitung: Die Erhebung der E-Mail-Adresse des
              Nutzers dient dazu, den Kita-Platz Benachrichtigungsservice
              zuzustellen. Die Erhebung sonstiger personenbezogener Daten im
              Rahmen des Anmeldevorgangs dient dazu, einen Missbrauch der
              Dienste oder der verwendeten E-Mail-Adresse zu verhindern.
            </p>
            <p className="text-base font-normal leading-normal text-gray-700">
              Dauer der Speicherung: Die Daten werden gelöscht, sobald sie für
              die Erreichung des Zwecks ihrer Erhebung nicht mehr erforderlich
              sind. Die E-Mail-Adresse des Nutzers wird demnach solange
              gespeichert, wie das Abonnement des Kita-Platz
              Benachrichtigungsservice aktiv ist, maximal jedoch 3 Monate. Die
              sonstigen im Rahmen des Anmeldevorgangs erhobenen
              personenbezogenen Daten werden ebenfalls bei Beendigung des
              Abonnements gelöscht.
            </p>
            <p className="text-base font-normal leading-normal text-gray-700">
              Widerspruchs- und Beseitigungsmöglichkeit: Das Abonnement des
              Kita-Platz Benachrichtigungsservice kann durch den betroffenen
              Nutzer jederzeit gekündigt werden. Zu diesem Zweck kontaktieren
              Sie uns bitte per E-Mail. Hierdurch wird ebenfalls ein Widerruf
              der Einwilligung zur Speicherung der während des Anmeldevorgangs
              erhobenen personenbezogenen Daten ermöglicht. Wenn Sie auf die
              Blacklist gesetzt werden möchten, um zukünftige Anmeldungen
              dauerhaft zu verhindern, kontaktieren Sie uns bitte per E-Mail.
            </p>
            <h4 className="mb-2 mt-3 text-lg font-semibold">
              Kita Finder Service
            </h4>
            <p className="text-base font-normal leading-normal text-gray-700">
              Beschreibung und Umfang der Datenverarbeitung: Auf unserer
              Internetseite besteht die Möglichkeit, sich für einen Kita Finder
              Service anzumelden. Wenn ein Nutzer diese Möglichkeit wahrnimmt,
              werden die folgenden Daten in der Eingabemaske eingegeben und an
              uns übermittelt:
            </p>
            <br></br>
            <ul>
              <li className="text-base font-normal leading-normal text-gray-700">
                Wohnort
              </li>
              <li className="text-base font-normal leading-normal text-gray-700">
                Gewünschter Beginn
              </li>
              <li className="text-base font-normal leading-normal text-gray-700">
                Geburtsmonat des Kindes
              </li>
              <li className="text-base font-normal leading-normal text-gray-700">
                E-Mail-Adresse
              </li>
            </ul>
            <br></br>
            <p className="text-base font-normal leading-normal text-gray-700">
              Für die Verarbeitung der Daten wird im Rahmen des Anmeldevorgangs
              Ihre Einwilligung mittels Double-Opt-In-Verfahren eingeholt und
              auf diese Datenschutzerklärung verwiesen. Der Kita Finder Service
              wird erst aktiviert, wenn Sie den Bestätigungslink in der
              Einladungs-E-Mail anklicken.
              <br></br>
              Der Versand erfolgt über Amazon-Server (mit Servern im EU-Raum).
              Außer für den Versand erfolgt im Zusammenhang mit der
              Datenverarbeitung für den Kita Finder Service keine Weitergabe der
              Daten an Dritte. Die Daten werden ausschließlich für den Versand
              des Kita Finder Service verwendet.
            </p>
            <p className="text-base font-normal leading-normal text-gray-700">
              Rechtsgrundlage für die Datenverarbeitung: Rechtsgrundlage für die
              Verarbeitung der Daten nach Anmeldung zum Kita Finder Service
              durch den Nutzer ist bei Vorliegen einer Einwilligung des Nutzers
              Art. 6 Abs. 1 lit. a DSGVO.
            </p>
            <p className="text-base font-normal leading-normal text-gray-700">
              Zweck der Datenverarbeitung: Die Erhebung der oben genannten Daten
              dient dazu, den Kita Finder Service durchzuführen und dem Nutzer
              passende Kitas basierend auf dem Wohnort, dem gewünschten Beginn
              und dem Geburtsmonat des Kindes zu empfehlen. Die Erhebung der
              E-Mail-Adresse des Nutzers dient dazu, den Kita Finder Service
              zuzustellen.
            </p>
            <p className="text-base font-normal leading-normal text-gray-700">
              Dauer der Speicherung: Die Daten werden gelöscht, sobald sie für
              die Erreichung des Zwecks ihrer Erhebung nicht mehr erforderlich
              sind. Die E-Mail-Adresse des Nutzers wird demnach solange
              gespeichert, wie das Abonnement des Kita Finder Service aktiv ist,
              maximal jedoch 3 Monate. Die sonstigen im Rahmen des
              Anmeldevorgangs erhobenen personenbezogenen Daten werden ebenfalls
              bei Beendigung des Abonnements gelöscht.
            </p>
            <p className="text-base font-normal leading-normal text-gray-700">
              Widerspruchs- und Beseitigungsmöglichkeit: Das Abonnement des Kita
              Finder Service kann durch den betroffenen Nutzer jederzeit
              gekündigt werden. Zu diesem Zweck kontaktieren Sie uns bitte per
              E-Mail. Hierdurch wird ebenfalls ein Widerruf der Einwilligung zur
              Speicherung der während des Anmeldevorgangs erhobenen
              personenbezogenen Daten ermöglicht. Wenn Sie auf die Blacklist
              gesetzt werden möchten, um zukünftige Anmeldungen dauerhaft zu
              verhindern, kontaktieren Sie uns bitte per E-Mail.
            </p>
            <p className="text-base font-normal leading-normal text-gray-700">
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim
              Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor
              allem technische Daten (z.&nbsp;B. Internetbrowser, Betriebssystem
              oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten
              erfolgt automatisch, sobald Sie diese Website betreten.
            </p>{" "}
            <h4 className="mb-2 mt-3 text-lg font-semibold">
              Wof&uuml;r nutzen wir Ihre Daten?
            </h4>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Ein Teil der Daten wird erhoben, um eine fehlerfreie
              Bereitstellung der Website zu gew&auml;hrleisten. Andere Daten
              k&ouml;nnen zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </p>{" "}
            <h4 className="mb-2 mt-3 text-lg font-semibold">Analyse-Tools</h4>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Google Analytics Diese Website nutzt Funktionen des
              Webanalysedienstes Google Analytics. Anbieter ist die Google
              Ireland Limited („Google“), Gordon House, Barrow Street, Dublin 4,
              Irland. Google Analytics ermöglicht es dem Websitebetreiber, das
              Verhalten der Websitebesucher zu analysieren. Hierbei erhält der
              Websitebetreiber verschiedene Nutzungsdaten, wie z. B.
              Seitenaufrufe, Verweildauer, verwendete Betriebssysteme und
              Herkunft des Nutzers. Diese Daten werden dem jeweiligen Endgerät
              des Users zugeordnet. Eine Zuordnung zu einer User-ID erfolgt
              nicht. Des Weiteren können wir mit Google Analytics u. a. Ihre
              Maus- und Scrollbewegungen und Klicks aufzeichnen. Ferner
              verwendet Google Analytics verschiedene Modellierungsansätze, um
              die erfassten Datensätze zu ergänzen und setzt
              Machine-Learning-Technologien bei der Datenanalyse ein. Google
              Analytics verwendet Technologien, die die Wiedererkennung des
              Nutzers zum Zwecke der Analyse des Nutzerverhaltens ermöglichen
              (z. B. Cookies oder Device-Fingerprinting). Die von Google
              erfassten Informationen über die Benutzung dieser Website werden
              in der Regel an einen Server von Google in den USA übertragen und
              dort gespeichert. Die Nutzung dieses Dienstes erfolgt auf
              Grundlage Ihrer Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und §
              25 Abs. 1 TTDSG. Die Einwilligung ist jederzeit widerrufbar. Die
              Datenübertragung in die USA wird auf die Standardvertragsklauseln
              der EU-Kommission gestützt. Details finden Sie hier:
              https://privacy.google.com/businesses/controllerterms/mccs/.
            </p>{" "}
            <h4 className="mb-2 mt-3 text-lg font-semibold">
              Welche Rechte haben Sie bez&uuml;glich Ihrer Daten?
            </h4>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft &uuml;ber
              Herkunft, Empf&auml;nger und Zweck Ihrer gespeicherten
              personenbezogenen Daten zu erhalten. Sie haben au&szlig;erdem ein
              Recht, die Berichtigung oder L&ouml;schung dieser Daten zu
              verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung
              erteilt haben, k&ouml;nnen Sie diese Einwilligung jederzeit
              f&uuml;r die Zukunft widerrufen. Au&szlig;erdem haben Sie das
              Recht, unter bestimmten Umst&auml;nden die Einschr&auml;nkung der
              Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des
              Weiteren steht Ihnen ein Beschwerderecht bei der zust&auml;ndigen
              Aufsichtsbeh&ouml;rde zu.
            </p>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Hierzu sowie zu weiteren Fragen zum Thema Datenschutz k&ouml;nnen
              Sie sich jederzeit an uns wenden.
            </p>
          </section>
          <section>
            <h2 className="mb-5 text-2xl font-bold">2. Hosting</h2>
            <p className="text-base font-normal leading-normal text-gray-700">
              Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
            </p>
            <h3 className="mb-3 mt-4 text-xl font-bold">
              Amazon Web Services (AWS)
            </h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Anbieter ist die Amazon Web Services EMEA SARL, 38 Avenue John F.
              Kennedy, 1855 Luxemburg (nachfolgend AWS).
            </p>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Wenn Sie unsere Website besuchen, werden Ihre personenbezogenen
              Daten auf den Servern von AWS verarbeitet. Hierbei k&ouml;nnen
              auch personenbezogene Daten an das Mutterunternehmen von AWS in
              die USA &uuml;bermittelt werden. Die Daten&uuml;bertragung in die
              USA wird auf die EU-Standardvertragsklauseln gest&uuml;tzt.
              Details finden Sie hier:{" "}
              <a
                className="text-happy-blue"
                href="https://aws.amazon.com/de/blogs/security/aws-gdpr-data-processing-addendum/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://aws.amazon.com/de/blogs/security/aws-gdpr-data-processing-addendum/
              </a>
              .
            </p>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Weitere Informationen entnehmen Sie der Datenschutzerkl&auml;rung
              von AWS:{" "}
              <a
                className="text-happy-blue"
                href="https://aws.amazon.com/de/privacy/?nc1=f_pr"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://aws.amazon.com/de/privacy/?nc1=f_pr
              </a>
              .
            </p>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Die Verwendung von AWS erfolgt auf Grundlage von Art. 6 Abs. 1
              lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer
              m&ouml;glichst zuverl&auml;ssigen Darstellung unserer Website.
              Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt
              die Verarbeitung ausschlie&szlig;lich auf Grundlage von Art. 6
              Abs. 1 lit. a DSGVO und &sect; 25 Abs. 1 TTDSG, soweit die
              Einwilligung die Speicherung von Cookies oder den Zugriff auf
              Informationen im Endger&auml;t des Nutzers (z.&nbsp;B.
              Device-Fingerprinting) im Sinne des TTDSG umfasst. Die
              Einwilligung ist jederzeit widerrufbar.
            </p>
          </section>
          <section>
            <h2 className="mb-5 text-2xl font-bold">
              3. Allgemeine Hinweise und Pflicht&shy;informationen
            </h2>
            <h3 className="mb-3 mt-4 text-xl font-bold">Datenschutz</h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer
              pers&ouml;nlichen Daten sehr ernst. Wir behandeln Ihre
              personenbezogenen Daten vertraulich und entsprechend den
              gesetzlichen Datenschutzvorschriften sowie dieser
              Datenschutzerkl&auml;rung.
            </p>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Wenn Sie diese Website benutzen, werden verschiedene
              personenbezogene Daten erhoben. Personenbezogene Daten sind Daten,
              mit denen Sie pers&ouml;nlich identifiziert werden k&ouml;nnen.
              Die vorliegende Datenschutzerkl&auml;rung erl&auml;utert, welche
              Daten wir erheben und wof&uuml;r wir sie nutzen. Sie
              erl&auml;utert auch, wie und zu welchem Zweck das geschieht.
            </p>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Wir weisen darauf hin, dass die Daten&uuml;bertragung im Internet
              (z.&nbsp;B. bei der Kommunikation per E-Mail)
              Sicherheitsl&uuml;cken aufweisen kann. Ein l&uuml;ckenloser Schutz
              der Daten vor dem Zugriff durch Dritte ist nicht m&ouml;glich.
            </p>
            <h3 className="mb-3 mt-4 text-xl font-bold">
              Hinweis zur verantwortlichen Stelle
            </h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Die verantwortliche Stelle f&uuml;r die Datenverarbeitung auf
              dieser Website ist:
            </p>{" "}
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
              Lohm&uuml;hlenstra&szlig;e 65
              <br />
              12435 Berlin
            </p>
            <p className="text-base font-normal leading-normal text-gray-700">
              Telefon: +49 171 4965186
              <br />
              E-Mail: hallo@kitaplatz-zentrale.de
            </p>
            <p className="text-base font-normal leading-normal text-gray-700">
              Verantwortliche Stelle ist die nat&uuml;rliche oder juristische
              Person, die allein oder gemeinsam mit anderen &uuml;ber die Zwecke
              und Mittel der Verarbeitung von personenbezogenen Daten
              (z.&nbsp;B. Namen, E-Mail-Adressen o. &Auml;.) entscheidet.
            </p>
            <h3 className="mb-3 mt-4 text-xl font-bold">Speicherdauer</h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Soweit innerhalb dieser Datenschutzerkl&auml;rung keine
              speziellere Speicherdauer genannt wurde, verbleiben Ihre
              personenbezogenen Daten bei uns, bis der Zweck f&uuml;r die
              Datenverarbeitung entf&auml;llt. Wenn Sie ein berechtigtes
              L&ouml;schersuchen geltend machen oder eine Einwilligung zur
              Datenverarbeitung widerrufen, werden Ihre Daten gel&ouml;scht,
              sofern wir keine anderen rechtlich zul&auml;ssigen Gr&uuml;nde
              f&uuml;r die Speicherung Ihrer personenbezogenen Daten haben
              (z.&nbsp;B. steuer- oder handelsrechtliche Aufbewahrungsfristen);
              im letztgenannten Fall erfolgt die L&ouml;schung nach Fortfall
              dieser Gr&uuml;nde.
            </p>
            <h3 className="mb-3 mt-4 text-xl font-bold">
              Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung
              auf dieser Website
            </h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Sofern Sie in die Datenverarbeitung eingewilligt haben,
              verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von
              Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs. 2 lit. a DSGVO, sofern
              besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO verarbeitet
              werden. Im Falle einer ausdr&uuml;cklichen Einwilligung in die
              &Uuml;bertragung personenbezogener Daten in Drittstaaten erfolgt
              die Datenverarbeitung au&szlig;erdem auf Grundlage von Art. 49
              Abs. 1 lit. a DSGVO. Sofern Sie in die Speicherung von Cookies
              oder in den Zugriff auf Informationen in Ihr Endger&auml;t
              (z.&nbsp;B. via Device-Fingerprinting) eingewilligt haben, erfolgt
              die Datenverarbeitung zus&auml;tzlich auf Grundlage von &sect; 25
              Abs. 1 TTDSG. Die Einwilligung ist jederzeit widerrufbar. Sind
              Ihre Daten zur Vertragserf&uuml;llung oder zur Durchf&uuml;hrung
              vorvertraglicher Ma&szlig;nahmen erforderlich, verarbeiten wir
              Ihre Daten auf Grundlage des Art. 6 Abs. 1 lit. b DSGVO. Des
              Weiteren verarbeiten wir Ihre Daten, sofern diese zur
              Erf&uuml;llung einer rechtlichen Verpflichtung erforderlich sind
              auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO. Die
              Datenverarbeitung kann ferner auf Grundlage unseres berechtigten
              Interesses nach Art. 6 Abs. 1 lit. f DSGVO erfolgen. &Uuml;ber die
              jeweils im Einzelfall einschl&auml;gigen Rechtsgrundlagen wird in
              den folgenden Abs&auml;tzen dieser Datenschutzerkl&auml;rung
              informiert.
            </p>
            <h3 className="mb-3 mt-4 text-xl font-bold">
              Hinweis zur Datenweitergabe in die USA und sonstige Drittstaaten
            </h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Wir verwenden unter anderem Tools von Unternehmen mit Sitz in den
              USA oder sonstigen datenschutzrechtlich nicht sicheren
              Drittstaaten. Wenn diese Tools aktiv sind, k&ouml;nnen Ihre
              personenbezogene Daten in diese Drittstaaten &uuml;bertragen und
              dort verarbeitet werden. Wir weisen darauf hin, dass in diesen
              L&auml;ndern kein mit der EU vergleichbares Datenschutzniveau
              garantiert werden kann. Beispielsweise sind US-Unternehmen dazu
              verpflichtet, personenbezogene Daten an Sicherheitsbeh&ouml;rden
              herauszugeben, ohne dass Sie als Betroffener hiergegen gerichtlich
              vorgehen k&ouml;nnten. Es kann daher nicht ausgeschlossen werden,
              dass US-Beh&ouml;rden (z.&nbsp;B. Geheimdienste) Ihre auf
              US-Servern befindlichen Daten zu &Uuml;berwachungszwecken
              verarbeiten, auswerten und dauerhaft speichern. Wir haben auf
              diese Verarbeitungst&auml;tigkeiten keinen Einfluss.
            </p>
            <h3 className="mb-3 mt-4 text-xl font-bold">
              Widerruf Ihrer Einwilligung zur Datenverarbeitung
            </h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Viele Datenverarbeitungsvorg&auml;nge sind nur mit Ihrer
              ausdr&uuml;cklichen Einwilligung m&ouml;glich. Sie k&ouml;nnen
              eine bereits erteilte Einwilligung jederzeit widerrufen. Die
              Rechtm&auml;&szlig;igkeit der bis zum Widerruf erfolgten
              Datenverarbeitung bleibt vom Widerruf unber&uuml;hrt.
            </p>
            <h3 className="mb-3 mt-4 text-xl font-bold">
              Widerspruchsrecht gegen die Datenerhebung in besonderen
              F&auml;llen sowie gegen Direktwerbung (Art. 21 DSGVO)
            </h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E
              ODER F DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS
              GR&Uuml;NDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN,
              GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH
              EINZULEGEN; DIES GILT AUCH F&Uuml;R EIN AUF DIESE BESTIMMUNGEN
              GEST&Uuml;TZTES PROFILING. DIE JEWEILIGE RECHTSGRUNDLAGE, AUF
              DENEN EINE VERARBEITUNG BERUHT, ENTNEHMEN SIE DIESER
              DATENSCHUTZERKL&Auml;RUNG. WENN SIE WIDERSPRUCH EINLEGEN, WERDEN
              WIR IHRE BETROFFENEN PERSONENBEZOGENEN DATEN NICHT MEHR
              VERARBEITEN, ES SEI DENN, WIR K&Ouml;NNEN ZWINGENDE
              SCHUTZW&Uuml;RDIGE GR&Uuml;NDE F&Uuml;R DIE VERARBEITUNG
              NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND FREIHEITEN
              &Uuml;BERWIEGEN ODER DIE VERARBEITUNG DIENT DER GELTENDMACHUNG,
              AUS&Uuml;BUNG ODER VERTEIDIGUNG VON RECHTSANSPR&Uuml;CHEN
              (WIDERSPRUCH NACH ART. 21 ABS. 1 DSGVO).
            </p>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG
              ZU BETREIBEN, SO HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH GEGEN
              DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER DATEN ZUM
              ZWECKE DERARTIGER WERBUNG EINZULEGEN; DIES GILT AUCH F&Uuml;R DAS
              PROFILING, SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG
              STEHT. WENN SIE WIDERSPRECHEN, WERDEN IHRE PERSONENBEZOGENEN DATEN
              ANSCHLIESSEND NICHT MEHR ZUM ZWECKE DER DIREKTWERBUNG VERWENDET
              (WIDERSPRUCH NACH ART. 21 ABS. 2 DSGVO).
            </p>
            <h3 className="mb-3 mt-4 text-xl font-bold">
              Beschwerde&shy;recht bei der zust&auml;ndigen
              Aufsichts&shy;beh&ouml;rde
            </h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Im Falle von Verst&ouml;&szlig;en gegen die DSGVO steht den
              Betroffenen ein Beschwerderecht bei einer Aufsichtsbeh&ouml;rde,
              insbesondere in dem Mitgliedstaat ihres gew&ouml;hnlichen
              Aufenthalts, ihres Arbeitsplatzes oder des Orts des
              mutma&szlig;lichen Versto&szlig;es zu. Das Beschwerderecht besteht
              unbeschadet anderweitiger verwaltungsrechtlicher oder
              gerichtlicher Rechtsbehelfe.
            </p>
            <h3 className="mb-3 mt-4 text-xl font-bold">
              Recht auf Daten&shy;&uuml;bertrag&shy;barkeit
            </h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Sie haben das Recht, Daten, die wir auf Grundlage Ihrer
              Einwilligung oder in Erf&uuml;llung eines Vertrags automatisiert
              verarbeiten, an sich oder an einen Dritten in einem g&auml;ngigen,
              maschinenlesbaren Format aush&auml;ndigen zu lassen. Sofern Sie
              die direkte &Uuml;bertragung der Daten an einen anderen
              Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch
              machbar ist.
            </p>
            <h3 className="mb-3 mt-4 text-xl font-bold">
              Auskunft, Berichtigung und L&ouml;schung
            </h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen
              jederzeit das Recht auf unentgeltliche Auskunft &uuml;ber Ihre
              gespeicherten personenbezogenen Daten, deren Herkunft und
              Empf&auml;nger und den Zweck der Datenverarbeitung und ggf. ein
              Recht auf Berichtigung oder L&ouml;schung dieser Daten. Hierzu
              sowie zu weiteren Fragen zum Thema personenbezogene Daten
              k&ouml;nnen Sie sich jederzeit an uns wenden.
            </p>
            <h3 className="mb-3 mt-4 text-xl font-bold">
              Recht auf Einschr&auml;nkung der Verarbeitung
            </h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Sie haben das Recht, die Einschr&auml;nkung der Verarbeitung Ihrer
              personenbezogenen Daten zu verlangen. Hierzu k&ouml;nnen Sie sich
              jederzeit an uns wenden. Das Recht auf Einschr&auml;nkung der
              Verarbeitung besteht in folgenden F&auml;llen:
            </p>{" "}
            <ul>
              {" "}
              <li>
                Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten
                personenbezogenen Daten bestreiten, ben&ouml;tigen wir in der
                Regel Zeit, um dies zu &uuml;berpr&uuml;fen. F&uuml;r die Dauer
                der Pr&uuml;fung haben Sie das Recht, die Einschr&auml;nkung der
                Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
              </li>{" "}
              <li>
                Wenn die Verarbeitung Ihrer personenbezogenen Daten
                unrechtm&auml;&szlig;ig geschah/geschieht, k&ouml;nnen Sie statt
                der L&ouml;schung die Einschr&auml;nkung der Datenverarbeitung
                verlangen.
              </li>{" "}
              <li>
                Wenn wir Ihre personenbezogenen Daten nicht mehr ben&ouml;tigen,
                Sie sie jedoch zur Aus&uuml;bung, Verteidigung oder
                Geltendmachung von Rechtsanspr&uuml;chen ben&ouml;tigen, haben
                Sie das Recht, statt der L&ouml;schung die Einschr&auml;nkung
                der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
              </li>{" "}
              <li>
                Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt
                haben, muss eine Abw&auml;gung zwischen Ihren und unseren
                Interessen vorgenommen werden. Solange noch nicht feststeht,
                wessen Interessen &uuml;berwiegen, haben Sie das Recht, die
                Einschr&auml;nkung der Verarbeitung Ihrer personenbezogenen
                Daten zu verlangen.
              </li>{" "}
            </ul>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten
              eingeschr&auml;nkt haben, d&uuml;rfen diese Daten &ndash; von
              ihrer Speicherung abgesehen &ndash; nur mit Ihrer Einwilligung
              oder zur Geltendmachung, Aus&uuml;bung oder Verteidigung von
              Rechtsanspr&uuml;chen oder zum Schutz der Rechte einer anderen
              nat&uuml;rlichen oder juristischen Person oder aus Gr&uuml;nden
              eines wichtigen &ouml;ffentlichen Interesses der Europ&auml;ischen
              Union oder eines Mitgliedstaats verarbeitet werden.
            </p>
            <h3 className="mb-3 mt-4 text-xl font-bold">
              SSL- bzw. TLS-Verschl&uuml;sselung
            </h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Diese Seite nutzt aus Sicherheitsgr&uuml;nden und zum Schutz der
              &Uuml;bertragung vertraulicher Inhalte, wie zum Beispiel
              Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber
              senden, eine SSL- bzw. TLS-Verschl&uuml;sselung. Eine
              verschl&uuml;sselte Verbindung erkennen Sie daran, dass die
              Adresszeile des Browsers von &bdquo;http://&ldquo; auf
              &bdquo;https://&ldquo; wechselt und an dem Schloss-Symbol in Ihrer
              Browserzeile.
            </p>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Wenn die SSL- bzw. TLS-Verschl&uuml;sselung aktiviert ist,
              k&ouml;nnen die Daten, die Sie an uns &uuml;bermitteln, nicht von
              Dritten mitgelesen werden.
            </p>
          </section>
          <section>
            <h2 className="mb-5 text-2xl font-bold">
              4. Datenerfassung auf dieser Website
            </h2>
            <h3 className="mb-3 mt-4 text-xl font-bold">
              Anfrage per E-Mail, Telefon oder Telefax
            </h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird
              Ihre Anfrage inklusive aller daraus hervorgehenden
              personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung
              Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten
              geben wir nicht ohne Ihre Einwilligung weiter.
            </p>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6
              Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erf&uuml;llung
              eines Vertrags zusammenh&auml;ngt oder zur Durchf&uuml;hrung
              vorvertraglicher Ma&szlig;nahmen erforderlich ist. In allen
              &uuml;brigen F&auml;llen beruht die Verarbeitung auf unserem
              berechtigten Interesse an der effektiven Bearbeitung der an uns
              gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer
              Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt
              wurde; die Einwilligung ist jederzeit widerrufbar.
            </p>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Die von Ihnen an uns per Kontaktanfragen &uuml;bersandten Daten
              verbleiben bei uns, bis Sie uns zur L&ouml;schung auffordern, Ihre
              Einwilligung zur Speicherung widerrufen oder der Zweck f&uuml;r
              die Datenspeicherung entf&auml;llt (z.&nbsp;B. nach
              abgeschlossener Bearbeitung Ihres Anliegens). Zwingende
              gesetzliche Bestimmungen &ndash; insbesondere gesetzliche
              Aufbewahrungsfristen &ndash; bleiben unber&uuml;hrt.
            </p>
          </section>
          <section>
            <h2 className="mb-5 text-2xl font-bold">5. Newsletter</h2>
            <h3 className="mb-3 mt-4 text-xl font-bold">
              Newsletter&shy;daten
            </h3>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Wenn Sie den auf der Website angebotenen Newsletter beziehen
              m&ouml;chten, ben&ouml;tigen wir von Ihnen eine E-Mail-Adresse
              sowie Informationen, welche uns die &Uuml;berpr&uuml;fung
              gestatten, dass Sie der Inhaber der angegebenen E-Mail-Adresse
              sind und mit dem Empfang des Newsletters einverstanden sind.
              Weitere Daten werden nicht bzw. nur auf freiwilliger Basis
              erhoben. Diese Daten verwenden wir ausschlie&szlig;lich f&uuml;r
              den Versand der angeforderten Informationen und geben diese nicht
              an Dritte weiter.
            </p>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Die Verarbeitung der in das Newsletteranmeldeformular eingegebenen
              Daten erfolgt ausschlie&szlig;lich auf Grundlage Ihrer
              Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Die erteilte
              Einwilligung zur Speicherung der Daten, der E-Mail-Adresse sowie
              deren Nutzung zum Versand des Newsletters k&ouml;nnen Sie
              jederzeit widerrufen, etwa &uuml;ber den
              &bdquo;Austragen&ldquo;-Link im Newsletter. Die
              Rechtm&auml;&szlig;igkeit der bereits erfolgten
              Datenverarbeitungsvorg&auml;nge bleibt vom Widerruf
              unber&uuml;hrt.
            </p>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Die von Ihnen zum Zwecke des Newsletter-Bezugs bei uns
              hinterlegten Daten werden von uns bis zu Ihrer Austragung aus dem
              Newsletter bei uns bzw. dem Newsletterdiensteanbieter gespeichert
              und nach der Abbestellung des Newsletters oder nach Zweckfortfall
              aus der Newsletterverteilerliste gel&ouml;scht. Wir behalten uns
              vor, E-Mail-Adressen aus unserem Newsletterverteiler nach eigenem
              Ermessen im Rahmen unseres berechtigten Interesses nach Art. 6
              Abs. 1 lit. f DSGVO zu l&ouml;schen oder zu sperren.
            </p>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Daten, die zu anderen Zwecken bei uns gespeichert wurden, bleiben
              hiervon unber&uuml;hrt.
            </p>{" "}
            <p className="text-base font-normal leading-normal text-gray-700">
              Nach Ihrer Austragung aus der Newsletterverteilerliste wird Ihre
              E-Mail-Adresse bei uns bzw. dem Newsletterdiensteanbieter ggf. in
              einer Blacklist gespeichert, sofern dies zur Verhinderung
              k&uuml;nftiger Mailings erforderlich ist. Die Daten aus der
              Blacklist werden nur f&uuml;r diesen Zweck verwendet und nicht mit
              anderen Daten zusammengef&uuml;hrt. Dies dient sowohl Ihrem
              Interesse als auch unserem Interesse an der Einhaltung der
              gesetzlichen Vorgaben beim Versand von Newslettern (berechtigtes
              Interesse im Sinne des Art. 6 Abs. 1 lit. f DSGVO). Die
              Speicherung in der Blacklist ist zeitlich nicht befristet.{" "}
              <strong>
                Sie k&ouml;nnen der Speicherung widersprechen, sofern Ihre
                Interessen unser berechtigtes Interesse &uuml;berwiegen.
              </strong>
            </p>
          </section>
          <section>
            <p className="text-base font-normal leading-normal text-gray-700">
              Quelle der überliegenden Abschnitte:{" "}
              <a className="text-happy-blue" href="https://www.e-recht24.de">
                https://www.e-recht24.de
              </a>
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
