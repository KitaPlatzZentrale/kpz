import React from "react";

import { Container, Hr, Link, Section } from "@react-email/components";

import styles from "../../styles";
import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.API_URL;
if (!API_URL) {
  throw new Error("API_URL is not defined");
}
const revokeConsentUrl = (consentId: string) =>
  `${API_URL}/revoke-consent/${consentId}`;

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
        <p>
          Sie möchten keine Emails mehr erhalten?{" "}
          <Link style={styles.anchor} href={revokeConsentUrl(consentId)}>
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
