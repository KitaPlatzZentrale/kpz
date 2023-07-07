//@ts-nocheck
import ChildDataModel from "./model";
import { encryption, getDataKey } from "./encryption";
import logger from "../../logger";
import { IChildData } from "./types";
const encryptionAlgorithm = "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic";
/**
 * Service class for handling child data encryption and storage.
 */
class ChildDataService {
  /**
   * Saves the encrypted child data to the database.
   *
   * @param childData - The child data to be saved.
   *   - `id`: The unique identifier of the child.
   *   - `parentId`: The unique identifier of the parent associated with the child.
   *   - `firstName`: The first name of the child.
   *   - `lastName`: The last name of the child.
   *   - `gender`: The gender of the child, which can be "Male", "Female", or "Other".
   *   - `actualOrExpectedBirthMonth`: The actual or expected birth month of the child.
   *   - `desiredStartingMonth`: The desired starting month for the child's care.
   *   - `careHours`: An array of strings representing the child's care hours.
   *
   * @throws Error if the encryption or database operation fails.
   */
  async saveChildData(childData: IChildData): Promise<void> {
    try {
      const dataKeyId = await getDataKey(childData.parentId);
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

      const encryptedChildData: IChildData = {
        id: childData.id,
        parentId: childData.parentId,
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

  /**
   * Retrieves and decrypts the child data from the database.
   *
   * @param id - The ID of the child data to retrieve.
   * @returns The decrypted child data, or null if not found.
   * @throws Error if the decryption or database operation fails.
   */
  async getChildData(id: string): Promise<IChildData | null> {
    try {
      const encryptedChildData = await ChildDataModel.findOne({ id: id });

      if (!encryptedChildData) {
        return null;
      }

      const decryptedFirstName = await encryption.decrypt(
        encryptedChildData.firstName
      );
      const decryptedLastName = await encryption.decrypt(
        encryptedChildData.lastName
      );
      const decryptedGender = await encryption.decrypt(
        encryptedChildData.gender
      );
      const decryptedActualOrExpectedBirthMonth = await encryption.decrypt(
        encryptedChildData.actualOrExpectedBirthMonth
      );

      const decryptedChildData: IChildData = {
        id: encryptedChildData.id,
        parentId: encryptedChildData.parentId,
        firstName: decryptedFirstName,
        lastName: decryptedLastName,
        gender: decryptedGender,
        actualOrExpectedBirthMonth: decryptedActualOrExpectedBirthMonth,
        desiredStartingMonth: encryptedChildData.desiredStartingMonth,
        careHours: encryptedChildData.careHours,
      };

      return decryptedChildData;
    } catch (e) {
      logger.error("Failed to retrieve or decrypt child data:", e);
      throw e;
    }
  }
}

export default ChildDataService;
