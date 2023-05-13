import React from "react";

import { Body, Container, Html, Tailwind } from "@react-email/components";

import Footer from "./Footer";
import Header from "./Header";

import styles from "../styles";

import { tailwind } from "../tailwind.config";

type LayoutProps = React.PropsWithChildren<{
  preview?: string | string[];
  consentId: string;
}>;

const Layout: React.FC<LayoutProps> = ({ preview, consentId, children }) => {
  return (
    <Html lang="de" dir="ltr">
      <Header preview={preview} />
      <Tailwind config={tailwind}>
        <Body style={styles.main}>
          <Container style={styles.container}>
            {children}
            <Footer consentId={consentId} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Layout;
