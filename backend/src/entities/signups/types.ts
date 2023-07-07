interface IAreaNotificationSignup {
  email: string;
  areaDescription: string; // this makes no fucking sense so this will be iterated on
  revokedAt?: string | null;
}

interface IKitaFinderServiceSignup {
  email: string;
  fullAddress: string;
  desiredStartingMonth: string;
  actualOrExpectedBirthMonth: string;
  revokedAt?: string | null;
}

interface ISingleKitaNotification {
  email: string;
  kitaId: string;
  kitaName: string;
  kitaDesiredAvailability: string;
}

interface IRevokeConsent {
  consentId: string;
}
