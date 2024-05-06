interface IKitaFinderServiceSignup {
  email: string;
  fullAddress: string;
  desiredStartingMonth: string;
  actualOrExpectedBirthMonth: string;
  revokedAt?: string | null;
  sendEmail?: Boolean;
}

interface ISingleKitaNotification {
  email: string;
  kitaId: string;
  kitaName: string;
  kitaDesiredAvailability: string;
  sendEmail?: Boolean;
}

interface IRevokeConsent {
  consentId: string;
}
