import Airtable = require("airtable");

type AirtableEinzelbenachrichtigungen = {
  ID: string; // unique
  Name: string;
  Email: string;
  "Kita Name": string;
  "Internal Kita ID": string;
  "Created at": string;
};

type AirtableArealbenachrichtigungen = {
  ID: string; //unique
  Name: string;
  Region: string;
  Email: string;
  "Created at": string;
};

type AirtableServiceAnmeldung = {
  Email: string; // unique
  "Full Address": string;
  "Desired Start Month": string;
  "Expected Birth Month": string;
  "Created at": string;
};

export interface CreateEinzelbenachrichtigungPayload {
  name: string;
  email: string;
  kitaName: string;
  interneKitaId: string;
}

export interface CreateArealbenachrichtigungPayload {
  name: string;
  email: string;
  region: string;
}

export interface CreateServiceAnmeldungPayload {
  email: string;
  fullAddress: string;
  desiredStartMonth: string;
  expectedBirthDate: string;
}

interface IAirtableAPIService {
  base: string;
  apiKey: string;

  createEinzelbenachrichtigung(
    payload: CreateEinzelbenachrichtigungPayload
  ): Promise<boolean>;
  createArealbenachrichtigung(
    payload: CreateArealbenachrichtigungPayload
  ): Promise<boolean>;
  createServiceAnmeldung(
    payload: CreateServiceAnmeldungPayload
  ): Promise<boolean>;
}

class AirtableAPIService implements IAirtableAPIService {
  base: string;
  apiKey: string;

  constructor() {
    this.base = process.env.AIRTABLE_BASE as string;
    this.apiKey = process.env.AIRTABLE_API_KEY as string;
  }

  async createEinzelbenachrichtigung(
    payload: CreateEinzelbenachrichtigungPayload
  ): Promise<boolean> {
    const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
    const base = airtable.base(this.base);

    const record = await base("Einzelbenachrichtigungen").create([
      {
        fields: {
          Name: payload.name,
          Email: payload.email,
          "Kita Name": payload.kitaName,
          "Internal Kita ID": payload.interneKitaId,
        } as AirtableEinzelbenachrichtigungen,
      },
    ]);

    return !!record;
  }

  async createArealbenachrichtigung(
    payload: CreateArealbenachrichtigungPayload
  ): Promise<boolean> {
    const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
    const base = airtable.base(this.base);

    const record = await base("Arealbenachrichtigungen").create([
      {
        fields: {
          Name: payload.name,
          Email: payload.email,
          Region: payload.region,
        } as AirtableArealbenachrichtigungen,
      },
    ]);

    return !!record;
  }

  async createServiceAnmeldung(
    payload: CreateServiceAnmeldungPayload
  ): Promise<boolean> {
    const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
    const base = airtable.base(this.base);

    const record = await base("Service Anmeldung").create([
      {
        fields: {
          Email: payload.email,
          "Full Address": payload.fullAddress,
          "Desired Start Month": payload.desiredStartMonth,
          "Expected Birth Month": payload.expectedBirthDate,
        } as AirtableServiceAnmeldung,
      },
    ]);

    return !!record;
  }
}

export default AirtableAPIService;
