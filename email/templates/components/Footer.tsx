import React from "react";

import { Container, Hr, Link, Section } from "@react-email/components";

import Paragraph from "./Text";

import styles from "../../styles";

import { REVOKE_CONSENT_ENDPOINT } from "../../variables";

const revokeConsentUrl = (consentUrl: string) =>
  `${REVOKE_CONSENT_ENDPOINT}/${consentUrl}`;

type FooterProps = {
  consentId: string;
};

const Footer: React.FC<FooterProps> = ({ consentId }) => {
  return (
    <>
      <Section style={styles.footer}>
        <Hr style={styles.hr} />
        <p>
          Kitaplatz-Zentrale.de, Studentenprojekt von Studierenden der CODE
          University of Applied Sciences Berlin, Lohmühlenstraße 65, 12435
          Berlin
        </p>
        {/*<p>
          Sie möchten keine Emails mehr erhalten?{" "}
          <Link style={styles.anchor} href={revokeConsentUrl(consentId)}>
            Email Benachrichtigungen abmelden
          </Link>
          .
  </p>*/}
        <p>
          <Link style={styles.anchor} href="https://kitaplatz-zentrale.de">
            https://kitaplatz-zentrale.de
          </Link>
        </p>
      </Section>
    </>
  );
};

export default Footer;
