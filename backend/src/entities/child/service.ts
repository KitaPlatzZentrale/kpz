import ChildDataModel from "./model";
import { IChildData } from "./handler/childData";
import { dataKeyId, encryption } from "./encryption";
import logger from "../../logger";

const encryptionAlgorithm = "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic";

class ChildDataService {
  async saveChildData(childData: IChildData) {
    try {
      const encryptedFirstName = await encryption.encrypt(childData.firstName, {
        keyId: dataKeyId,
        algorithm: encryptionAlgorithm,
      });

      const encryptedLastName = await encryption.encrypt(childData.lastName, {
        keyId: dataKeyId,
        algorithm: encryptionAlgorithm,
      });

      const encryptedGender = await encryption.encrypt(childData.gender, {
        keyId: dataKeyId,
        algorithm: encryptionAlgorithm,
      });

      const encryptedActualOrExpectedBirthMonth = await encryption.encrypt(
        childData.actualOrExpectedBirthMonth,
        {
          keyId: dataKeyId,
          algorithm: encryptionAlgorithm,
        }
      );

      const encryptedChildData = {
        id: childData.id,
        firstName: encryptedFirstName,
        lastName: encryptedLastName,
        gender: encryptedGender,
        actualOrExpectedBirthMonth: encryptedActualOrExpectedBirthMonth,
        desiredStartingMonth: childData.desiredStartingMonth,
        careHours: childData.careHours,
      };

      await ChildDataModel.create(encryptedChildData);
    } catch (e) {
      logger.error("Failed to save encrypted child data:", e);
      throw e;
    }
  }
}

export default ChildDataService;
