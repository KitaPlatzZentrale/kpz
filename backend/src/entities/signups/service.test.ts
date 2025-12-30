import { EmailSignup } from './service';
import { UserModel, EmailServiceSignupModel } from './model';

// Mock Mongoose models
jest.mock('./model');

describe('EmailSignup Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('singleKitaNotificationSignup', () => {
    const mockSignupData = {
      email: 'test@example.com',
      kitaId: 'kita-123',
      kitaName: 'Test Kita',
      kitaDesiredAvailability: '2024-09',
      sendEmail: true,
    };

    it('should create new user when email does not exist', async () => {
      // Arrange
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      const mockCreatedUser = {
        id: 'user-123',
        email: mockSignupData.email,
        trackedKitas: [{
          id: mockSignupData.kitaId,
          kitaName: mockSignupData.kitaName,
          kitaAvailability: mockSignupData.kitaDesiredAvailability,
        }],
        sendEmail: true,
      };
      (UserModel.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      // Act
      const result = await EmailSignup.singleKitaNotificationSignup(mockSignupData);

      // Assert
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockSignupData.email });
      expect(UserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockSignupData.email,
          trackedKitas: expect.arrayContaining([
            expect.objectContaining({
              id: mockSignupData.kitaId,
              kitaName: mockSignupData.kitaName,
              kitaAvailability: mockSignupData.kitaDesiredAvailability,
            }),
          ]),
        })
      );
      expect(result).toEqual(mockCreatedUser);
    });

    it('should add kita to existing user when email exists but kita not tracked', async () => {
      // Arrange
      const mockExistingUser = {
        email: mockSignupData.email,
        trackedKitas: [{
          id: 'different-kita-id',
          kitaName: 'Different Kita',
          kitaAvailability: '2024-08',
        }],
        save: jest.fn().mockResolvedValue(true),
      };
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockExistingUser);

      // Act
      const result = await EmailSignup.singleKitaNotificationSignup(mockSignupData);

      // Assert
      expect(mockExistingUser.trackedKitas).toHaveLength(2);
      expect(mockExistingUser.trackedKitas[1]).toEqual({
        id: mockSignupData.kitaId,
        kitaName: mockSignupData.kitaName,
        kitaAvailability: mockSignupData.kitaDesiredAvailability,
      });
      expect(mockExistingUser.save).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return undefined when kita already tracked by user', async () => {
      // Arrange
      const mockExistingUser = {
        email: mockSignupData.email,
        trackedKitas: [{
          id: mockSignupData.kitaId, // Same kita ID
          kitaName: mockSignupData.kitaName,
          kitaAvailability: '2024-08',
        }],
        save: jest.fn(),
      };
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockExistingUser);

      // Act
      const result = await EmailSignup.singleKitaNotificationSignup(mockSignupData);

      // Assert
      expect(mockExistingUser.save).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should throw error when database operation fails', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      (UserModel.findOne as jest.Mock).mockRejectedValue(dbError);

      // Act & Assert
      await expect(
        EmailSignup.singleKitaNotificationSignup(mockSignupData)
      ).rejects.toThrow('Database connection failed');
    });
  });

  describe('kitaFinderServiceSignup', () => {
    const mockFinderData = {
      email: 'test@example.com',
      fullAddress: 'Test Street 123, Berlin',
      desiredStartingMonth: '2024-09',
      actualOrExpectedBirthMonth: '2023-06',
      sendEmail: true,
    };

    it('should create new signup when email does not exist', async () => {
      // Arrange
      (EmailServiceSignupModel.findOne as jest.Mock).mockResolvedValue(null);
      const mockCreatedSignup = {
        id: 'signup-123',
        ...mockFinderData,
      };
      (EmailServiceSignupModel.create as jest.Mock).mockResolvedValue(mockCreatedSignup);

      // Act
      const result = await EmailSignup.kitaFinderServiceSignup(mockFinderData);

      // Assert
      expect(EmailServiceSignupModel.findOne).toHaveBeenCalledWith({ email: mockFinderData.email });
      expect(EmailServiceSignupModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockFinderData.email,
          fullAddress: mockFinderData.fullAddress,
          desiredStartingMonth: mockFinderData.desiredStartingMonth,
          actualOrExpectedBirthMonth: mockFinderData.actualOrExpectedBirthMonth,
        })
      );
      expect(result).toEqual(mockCreatedSignup);
    });

    it('should return undefined when email already exists (prevents duplicates)', async () => {
      // Arrange
      const mockExistingSignup = {
        id: 'existing-signup-123',
        email: mockFinderData.email,
      };
      (EmailServiceSignupModel.findOne as jest.Mock).mockResolvedValue(mockExistingSignup);

      // Act
      const result = await EmailSignup.kitaFinderServiceSignup(mockFinderData);

      // Assert
      expect(EmailServiceSignupModel.create).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should throw error when database operation fails', async () => {
      // Arrange
      const dbError = new Error('Database write failed');
      (EmailServiceSignupModel.findOne as jest.Mock).mockRejectedValue(dbError);

      // Act & Assert
      await expect(
        EmailSignup.kitaFinderServiceSignup(mockFinderData)
      ).rejects.toThrow('Database write failed');
    });
  });

  describe('revokeConsent', () => {
    const mockConsentId = 'consent-123';

    it('should delete user and email service signup by consentId', async () => {
      // Arrange
      (EmailServiceSignupModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });
      (UserModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

      // Act
      await EmailSignup.revokeConsent(mockConsentId);

      // Assert
      expect(EmailServiceSignupModel.deleteOne).toHaveBeenCalledWith({ consentId: mockConsentId });
      expect(UserModel.deleteOne).toHaveBeenCalledWith({ consentId: mockConsentId });
    });

    it('should throw error when deletion fails', async () => {
      // Arrange
      const dbError = new Error('Delete operation failed');
      (EmailServiceSignupModel.deleteOne as jest.Mock).mockRejectedValue(dbError);

      // Act & Assert
      await expect(
        EmailSignup.revokeConsent(mockConsentId)
      ).rejects.toThrow('Delete operation failed');
    });

    it('should handle case when no documents are deleted (consentId not found)', async () => {
      // Arrange
      (EmailServiceSignupModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 0 });
      (UserModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 0 });

      // Act & Assert
      // Should not throw - GDPR compliance: deletion is idempotent
      await expect(EmailSignup.revokeConsent(mockConsentId)).resolves.toBeUndefined();
    });
  });
});
