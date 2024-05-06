import * as React from "react";

import { Button, Hr, Section } from "@react-email/components";

import Layout from "./components/Layout";
import Paragraph from "./components/Text";

import styles from "../styles";

import { BROWSE_KITAS_ENDPOINT } from "../variables";

export interface KitaAvailabilityEmailProps {
  kitaNames: string[];
  consentId: string;
}

export const KitaAvailabilityEmail: React.FC<KitaAvailabilityEmailProps> = ({
  kitaNames,
  consentId,
}) => (
  <Layout
    preview={`
    Neue Plätze sind verfügbar in den folgenden Kitas: ${kitaNames.join(", ")}
  `}
    consentId={consentId}
  >
    <Section style={styles.box}>
      <Paragraph>
        Neue Plätze sind verfügbar in den folgenden Kitas:{" "}
        {kitaNames.join(", ")}
      </Paragraph>
      <Paragraph>
        Sie haben nun die Möglichkeit, einen Platz in einer dieser Kitas zu
        reservieren. Klicken Sie auf den unten stehenden Button, um weitere
        Details anzuzeigen und einen Platz zu buchen.
      </Paragraph>
      <Button
        pX={20}
        pY={14}
        style={styles.button}
        href={BROWSE_KITAS_ENDPOINT}
      >
        Jetzt Kitas anzeigen
      </Button>
      <Hr style={styles.hr} />
      <Paragraph>
        Bitte beachten Sie, dass die Verfügbarkeit begrenzt ist und die Plätze
        nach dem "First come, first served"-Prinzip vergeben werden. Wir
        empfehlen Ihnen daher, schnell zu handeln, um sicherzustellen, dass Sie
        einen Platz reservieren können.
      </Paragraph>
      <Paragraph>
        Falls Sie Fragen oder Anliegen haben, zögern Sie bitte nicht, uns zu
        kontaktieren. Unser Support steht Ihnen jederzeit gerne zur Verfügung.
      </Paragraph>
      <Paragraph>
        Vielen Dank für Ihr Vertrauen und wir wünschen Ihnen viel Erfolg bei der
        Buchung eines Kindergartenplatzes für Ihr Kind!
      </Paragraph>
      <Paragraph>
        Mit freundlichen Grüßen,
        <br />
        Ihr Kitaplatz-Zentrale Team
      </Paragraph>
    </Section>
  </Layout>
);

export default KitaAvailabilityEmail;
