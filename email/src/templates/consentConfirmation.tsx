import * as React from "react";

import { Hr, Section } from "@react-email/components";

import Layout from "./components/Layout";
import Paragraph from "./components/Text";

import styles from "../styles";
import dotenv from "dotenv";
dotenv.config();

export interface ConsentConfirmationEmailProps {
  consentId: string;
  serviceName: string;
}

export const ConsentConfirmationEmail: React.FC<
  ConsentConfirmationEmailProps
> = ({ consentId, serviceName }) => (
  <Layout
    preview={`
    Einverständniserklärung für den ${serviceName} Service
  `}
    consentId={consentId}
  >
    <Section style={styles.box}>
      <Paragraph>
        {`Einverständniserklärung für den ${serviceName} Service`}
      </Paragraph>
      <Paragraph>
        Wir benötigen Ihre Zustimmung, um den {serviceName} Service nutzen zu
        können.
      </Paragraph>
      <Hr style={styles.hr} />
      <Paragraph>
        Bitte bestätigen Sie Ihr Einverständnis, indem Sie auf den folgenden
        Link klicken:
      </Paragraph>
      <Paragraph>
        <a
          href={`${process.env.API_URL}/confirm-consent/${consentId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Einverständnis bestätigen
        </a>
      </Paragraph>
      <Paragraph>
        Durch Klicken der Schaltfläche bestätigen Sie, dass Sie unserer
        Datenschutzerklärung zustimmen:
        <a
          href="https://kitaplatz-zentrale.de/datenschutzerklaerung"
          target="_blank"
          rel="noopener noreferrer"
        >
          Datenschutzerklärung
        </a>
      </Paragraph>
      <Paragraph>
        Wenn Sie den obigen Link nicht anklicken können, kopieren Sie bitte die
        folgende URL und fügen Sie sie in die Adressleiste Ihres Browsers ein:
      </Paragraph>
      <Paragraph>{`${process.env.API_URL}/confirm-consent/${consentId}`}</Paragraph>
      <Paragraph>
        Ihre Zustimmung ist wichtig, um den {serviceName} Service nutzen zu
        können.
      </Paragraph>
      <Paragraph>
        Wenn Sie Fragen oder Bedenken haben, stehen wir Ihnen gerne zur
        Verfügung. Kontaktieren Sie uns über: <b>hallo@kitaplatz-zentrale.de</b>
        .
      </Paragraph>
      <Paragraph>
        Wir freuen uns darauf, Ihnen bei der Suche nach einem passenden
        Kindergartenplatz zu helfen!
      </Paragraph>
      <Paragraph>
        Mit freundlichen Grüßen,
        <br />
        Ihr Kitaplatz-Zentrale Team
      </Paragraph>
    </Section>
  </Layout>
);

export default ConsentConfirmationEmail;
