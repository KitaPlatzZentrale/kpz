import React from "react";

import { Hr, Link, Section } from "@react-email/components";

import styles from "../../styles";

type FooterProps = {
  consentId: string;
  API_URL: string;
};

const Footer: React.FC<FooterProps> = ({ consentId, API_URL }) => {
  const revokeConsentUrl = `${API_URL}/revoke-consent/${consentId}`;
  return (
    <>
      <Section style={styles.footer}>
        <Hr style={styles.hr} />
        <p>
          Kitaplatz-Zentrale.de, Studentenprojekt von Studierenden der CODE
          University of Applied Sciences Berlin, Lohmühlenstraße 65, 12435
          Berlin
        </p>
        <p>
          Sie möchten keine Emails mehr erhalten?{" "}
          <Link style={styles.anchor} href={revokeConsentUrl}>
            Email Benachrichtigungen abmelden
          </Link>
        </p>
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
