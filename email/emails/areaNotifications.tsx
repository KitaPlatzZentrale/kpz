import * as React from "react";

import { Button, Hr, Section } from "@react-email/components";

import Layout from "../components/Layout";
import Paragraph from "../components/Text";

import styles from "../styles";

import { BROWSE_KITAS_ENDPOINT } from "../variables";

interface AreaNotificationsEmailProps {
  areaDescription: string;
  consentId: string;
}

export const AreaNotificationsEmail: React.FC<AreaNotificationsEmailProps> = ({
  areaDescription,
  consentId,
}) => (
  <Layout
    preview={`
    Sie erhalten ab nun Benachrichtigungen für die Region "${areaDescription}"
  `}
    consentId={consentId}
  >
    <Section style={styles.box}>
      <Paragraph>
        {`Sie erhalten ab nun Benachrichtigungen für die Region "${areaDescription}"`}
      </Paragraph>
      <Paragraph>
        Sollten wieder Plätze in einer Kita in dieser Region frei werden,
        erhalten Sie von uns schnell einen Hinweis. Sie können sich jederzeit
        für Benachrichtigungen für weitere Regionen oder einzelnen Kitas
        anmelden.
      </Paragraph>
      <Button
        pX={20}
        pY={14}
        style={styles.button}
        href={BROWSE_KITAS_ENDPOINT}
      >
        Weitere Kitas finden
      </Button>
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

export default AreaNotificationsEmail;
