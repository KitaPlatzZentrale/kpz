import { handler } from "./functions/sendSingleKitaNotificationsEmail";

handler(
  { to: "hannogrimm@gmail.com", kitaName: "", consentId: "123" },
  {} as any,
  () => {}
);
