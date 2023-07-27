const tailwind = require("./tailwind.config");

export const tailwindConfig = tailwind;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    'Nunito,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "22px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: tailwind.theme.colors.gray[500] || "#4a5568",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const anchor = {
  color: tailwind.theme.colors["happy-blue"].DEFAULT || "#556cd6",
};

const button = {
  backgroundColor:
    tailwind.theme.colors.primary.DEFAULT ||
    tailwindConfig.theme.extend.colors.primary.DEFAULT ||
    "#F46E44",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
};

const footer = {
  padding: "0 48px",
  color: tailwind.theme.colors.gray[400] || "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

// merge the upper variables into a single object where the variable names are the keys

export default {
  main,
  container,
  box,
  hr,
  paragraph,
  anchor,
  button,
  footer,
};
