import { Request, Response } from 'express';
import locationService from './locationService';
import KitaDetailModel from '../model';

// Mock the Kita model
jest.mock('../model');

describe('Location Service', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe('Geospatial Search', () => {
    it('should return kitas within specified radius', async () => {
      // Arrange
      mockRequest.body = {
        lat: '52.5200',
        lng: '13.4050',
        radius: '2500',
        page: '1',
        limit: '10',
      };

      const mockKitas = [
        { _id: 'kita1', name: 'Kita 1', location: { coordinates: [13.4050, 52.5200] } },
        { _id: 'kita2', name: 'Kita 2', location: { coordinates: [13.4100, 52.5210] } },
      ];

      const mockQueryChain = {
        limit: jest.fn().mockResolvedValue(mockKitas),
      };

      (KitaDetailModel.find as jest.Mock).mockReturnValue(mockQueryChain);

      // Act
      await locationService(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(KitaDetailModel.find).toHaveBeenCalledWith({
        location: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [13.4050, 52.5200], // lon, lat
            },
            $maxDistance: 2500,
          },
        },
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            page: 1,
            totalPages: 1,
            itemsPerPage: 10,
            totalItems: 2,
            amountOfItems: 2,
            nextPage: false,
          }),
          items: mockKitas,
        })
      );
    });

    it('should use default radius when not provided', async () => {
      // Arrange
      mockRequest.body = {
        lat: '52.5200',
        lng: '13.4050',
      };

      const mockQueryChain = {
        limit: jest.fn().mockResolvedValue([]),
      };

      (KitaDetailModel.find as jest.Mock).mockReturnValue(mockQueryChain);

      // Act
      await locationService(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(KitaDetailModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          location: expect.objectContaining({
            $nearSphere: expect.objectContaining({
              $maxDistance: 2500, // Default radius
            }),
          }),
        })
      );
    });

    it('should return 400 error for invalid coordinates', async () => {
      // Arrange
      mockRequest.body = {
        lat: 'invalid',
        lng: 'invalid',
      };

      // Act
      await locationService(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Invalid latitude or longitude provided.',
      });
      expect(KitaDetailModel.find).not.toHaveBeenCalled();
    });

    it('should return 400 error when lat or lng is 0', async () => {
      // Arrange
      mockRequest.body = {
        lat: '0',
        lng: '0',
      };

      // Act
      await locationService(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Invalid latitude or longitude provided.',
      });
    });
  });

  describe('Pagination', () => {
    const mockKitas = Array.from({ length: 25 }, (_, i) => ({
      _id: `kita${i + 1}`,
      name: `Kita ${i + 1}`,
      location: { coordinates: [13.4050 + i * 0.001, 52.5200 + i * 0.001] },
    }));

    it('should return correct first page with default limit (50)', async () => {
      // Arrange
      mockRequest.body = {
        lat: '52.5200',
        lng: '13.4050',
        page: '1',
      };

      const mockQueryChain = {
        limit: jest.fn().mockResolvedValue(mockKitas),
      };

      (KitaDetailModel.find as jest.Mock).mockReturnValue(mockQueryChain);

      // Act
      await locationService(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            page: 1,
            totalPages: 1,
            itemsPerPage: 50,
            totalItems: 25,
            amountOfItems: 25,
            nextPage: false,
          }),
          items: mockKitas,
        })
      );
    });

    it('should return correct second page', async () => {
      // Arrange
      mockRequest.body = {
        lat: '52.5200',
        lng: '13.4050',
        page: '2',
        limit: '10',
      };

      const mockQueryChain = {
        limit: jest.fn().mockResolvedValue(mockKitas),
      };

      (KitaDetailModel.find as jest.Mock).mockReturnValue(mockQueryChain);

      // Act
      await locationService(mockRequest as Request, mockResponse as Response);

      // Assert
      const expectedItems = mockKitas.slice(10, 20);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            page: 2,
            totalPages: 3, // 25 items / 10 per page = 3 pages
            itemsPerPage: 10,
            totalItems: 25,
            amountOfItems: expectedItems.length,
            nextPage: 3,
          }),
          items: expectedItems,
        })
      );
    });

    it('should return empty items array when page exceeds total pages', async () => {
      // Arrange
      mockRequest.body = {
        lat: '52.5200',
        lng: '13.4050',
        page: '10', // Page way beyond available data
        limit: '10',
      };

      const mockQueryChain = {
        limit: jest.fn().mockResolvedValue(mockKitas),
      };

      (KitaDetailModel.find as jest.Mock).mockReturnValue(mockQueryChain);

      // Act
      await locationService(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            page: 10,
            totalPages: 3,
            amountOfItems: 0,
            nextPage: false,
          }),
          items: [],
        })
      );
    });

    it('should calculate nextPage correctly for last page', async () => {
      // Arrange
      mockRequest.body = {
        lat: '52.5200',
        lng: '13.4050',
        page: '3', // Last page
        limit: '10',
      };

      const mockQueryChain = {
        limit: jest.fn().mockResolvedValue(mockKitas),
      };

      (KitaDetailModel.find as jest.Mock).mockReturnValue(mockQueryChain);

      // Act
      await locationService(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            page: 3,
            totalPages: 3,
            nextPage: false, // No next page
          }),
        })
      );
    });

    it('should handle empty results', async () => {
      // Arrange
      mockRequest.body = {
        lat: '52.5200',
        lng: '13.4050',
      };

      const mockQueryChain = {
        limit: jest.fn().mockResolvedValue([]),
      };

      (KitaDetailModel.find as jest.Mock).mockReturnValue(mockQueryChain);

      // Act
      await locationService(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            totalItems: 0,
            amountOfItems: 0,
            totalPages: 0,
            nextPage: false,
          }),
          items: [],
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should return 500 error when database query fails', async () => {
      // Arrange
      mockRequest.body = {
        lat: '52.5200',
        lng: '13.4050',
      };

      const dbError = new Error('Database connection failed');
      const mockQueryChain = {
        limit: jest.fn().mockRejectedValue(dbError),
      };

      (KitaDetailModel.find as jest.Mock).mockReturnValue(mockQueryChain);

      // Act
      await locationService(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Something went wrong. Please try again later.',
      });
    });
  });
});
