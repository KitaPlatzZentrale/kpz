import baseOptions from "./baseOptions";
import { SES } from "@aws-sdk/client-ses";

type RequiredParameters = {
  to: string | string[];
  subject: string;
  body: string;
};

const mergeOptions = ({ to, subject, body }: RequiredParameters) => {
  const options = {
    ...baseOptions,
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to],
    },
    Message: {
      ...baseOptions.Message,
      Body: {
        ...baseOptions.Message.Body,
        Html: {
          ...baseOptions.Message.Body.Html,
          Data: body,
        },
      },
      Subject: {
        ...baseOptions.Message.Subject,
        Data: subject,
      },
    },
  };

  return options;
};

const sendEmail = async (options: RequiredParameters): Promise<any> => {
  const ses = new SES({ region: "eu-central-1" });
  const params = mergeOptions(options);

  return ses.sendEmail(params);
};

export default sendEmail;
