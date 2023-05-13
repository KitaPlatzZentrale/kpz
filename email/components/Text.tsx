import React from "react";

import { Text } from "@react-email/components";

import styles from "../styles";

type ParagraphProps = React.PropsWithChildren<{}>;

const Paragraph: React.FC<ParagraphProps> = ({ children }) => {
  return <Text style={styles.paragraph}>{children}</Text>;
};

export default Paragraph;
