import * as React from "react";

import { Hr, Section } from "@react-email/components";

import Layout from "../components/Layout";
import Paragraph from "../components/Text";

import styles from "../styles";

interface ServiceSignupEmailProps {
  consentId: string;
}

export const ServiceSignupEmail: React.FC<ServiceSignupEmailProps> = ({
  consentId,
}) => (
  <Layout
    preview={`
    Anmeldungsbestätigung für den Kita-Finder Service
  `}
    consentId={consentId}
  >
    <Section style={styles.box}>
      <Paragraph>
        {`Anmeldungsbestätigung für den Kita-Finder Service`}
      </Paragraph>
      <Paragraph>
        Sie haben sich erfolgreich für den Kita-Finder Service angemeldet. In
        Kürze prüfen wir verfügbare Angebote von Kitas in Ihrer Nähe für sie
        gegen - ganz sorgenfrei und automatisch. Sobald wir einen passenden
        Kita-Platz für Ihr Kind gefunden haben, werden wir Sie umgehend
        benachrichtigen.
      </Paragraph>
      <Hr style={styles.hr} />
      <Paragraph>
        Unser Ziel ist es, Ihnen dabei zu helfen, den passenden
        Kindergartenplatz für Ihr Kind zu finden und Sie rechtzeitig über
        freiwerdende Plätze zu informieren. So können Sie schnell und einfach
        auf die neuen Möglichkeiten reagieren.
      </Paragraph>
      <Paragraph>
        Bitte beachten Sie, dass die Verfügbarkeit der Kindergartenplätze von
        verschiedenen Faktoren abhängen kann und wir keine Garantie für einen
        Platz übernehmen können. Unser Service dient lediglich dazu, Sie auf dem
        Laufenden zu halten und Ihnen bei der Suche nach einem geeigneten Platz
        zu unterstützen.
      </Paragraph>
      <Paragraph>
        Falls Sie Fragen oder Anliegen haben, zögern Sie bitte nicht, uns zu
        kontaktieren. Unser Support steht Ihnen jederzeit gerne zur Verfügung.
      </Paragraph>
      <Paragraph>
        Vielen Dank für Ihr Vertrauen und wir wünschen Ihnen viel Erfolg bei der
        Suche nach dem passenden Kindergartenplatz für Ihr Kind!
      </Paragraph>
      <Paragraph>
        Mit freundlichen Grüßen,
        <br />
        Ihr Kitaplatz-Zentrale Team
      </Paragraph>
    </Section>
  </Layout>
);

export default ServiceSignupEmail;
