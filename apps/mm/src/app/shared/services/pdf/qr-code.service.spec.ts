import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import * as QRCode from 'qrcode';

import { Colors } from '@schaeffler/pdf-generator';

import { QRCodeOptions, QrCodeService } from './qr-code.service';

// Mock the entire qrcode module to prevent any real calls
jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}));

describe('QrCodeService', () => {
  let spectator: SpectatorService<QrCodeService>;
  let service: QrCodeService;
  let originalConsoleError: typeof console.error;

  const createService = createServiceFactory({
    service: QrCodeService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;

    // Mock console.error to prevent cluttering test output
    originalConsoleError = console.error;
    console.error = jest.fn();

    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Ensure QRCode is properly mocked and doesn't make real calls
  it('should have QRCode.toDataURL properly mocked', () => {
    expect(jest.isMockFunction(QRCode.toDataURL)).toBe(true);
  });

  describe('generateQrCodeAsBase64', () => {
    const mockQrData = 'https://example.com';
    const mockQrName = 'test-qr';
    const mockBase64 = 'data:image/png;base64,mockBase64String';

    beforeEach(() => {
      (QRCode.toDataURL as jest.Mock).mockResolvedValue(mockBase64);
    });

    it('should generate QR code with default options', async () => {
      const result = await service.generateQrCodeAsBase64(
        mockQrData,
        mockQrName
      );

      expect(result).toBe(mockBase64);
      expect(QRCode.toDataURL).toHaveBeenCalledWith(mockQrData, {
        errorCorrectionLevel: 'M',
        width: 200,
        margin: 4,
        color: {
          dark: '#000000',
          light: Colors.Surface,
        },
      });
    });

    it('should override default options with provided options', async () => {
      const customOptions: QRCodeOptions = {
        errorCorrectionLevel: 'H',
        width: 300,
        margin: 2,
        color: {
          dark: '#FF0000',
          light: '#FFFFFF',
        },
      };

      const result = await service.generateQrCodeAsBase64(
        mockQrData,
        mockQrName,
        customOptions
      );

      expect(result).toBe(mockBase64);
      expect(QRCode.toDataURL).toHaveBeenCalledWith(mockQrData, {
        errorCorrectionLevel: 'H',
        width: 300,
        margin: 2,
        color: {
          dark: '#FF0000',
          light: '#FFFFFF',
        },
      });
    });

    it('should partially override default options', async () => {
      const partialOptions: QRCodeOptions = {
        width: 400,
        color: {
          dark: '#0000FF',
        },
      };

      const result = await service.generateQrCodeAsBase64(
        mockQrData,
        mockQrName,
        partialOptions
      );

      expect(result).toBe(mockBase64);
      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        mockQrData,
        expect.objectContaining({
          errorCorrectionLevel: 'M',
          width: 400,
          margin: 4,
          color: expect.objectContaining({
            dark: '#0000FF',
          }),
        })
      );
    });

    it('should throw an error when QR code generation fails', async () => {
      const errorMessage = 'Failed to generate QR code';
      const mockError = new Error(errorMessage);

      // Ensure the mock rejects with our specific error
      (QRCode.toDataURL as jest.Mock).mockRejectedValue(mockError);

      await expect(
        service.generateQrCodeAsBase64(mockQrData, mockQrName)
      ).rejects.toThrow(errorMessage);

      expect(QRCode.toDataURL).toHaveBeenCalledWith(mockQrData, {
        errorCorrectionLevel: 'M',
        width: 200,
        margin: 4,
        color: {
          dark: '#000000',
          light: Colors.Surface,
        },
      });
      expect(console.error).toHaveBeenCalledWith(
        `Error generating QR code for ${mockQrName}:`,
        mockError
      );
    });
  });

  describe('generateMultipleQrCodes', () => {
    const mockItems = [
      { data: 'https://example1.com', name: 'qr1' },
      { data: 'https://example2.com', name: 'qr2', options: { width: 300 } },
    ];
    const mockBase64_1 = 'data:image/png;base64,mockBase64String1';
    const mockBase64_2 = 'data:image/png;base64,mockBase64String2';

    it('should generate multiple QR codes and return results array', async () => {
      jest
        .spyOn(service, 'generateQrCodeAsBase64')
        .mockResolvedValueOnce(mockBase64_1)
        .mockResolvedValueOnce(mockBase64_2);

      const results = await service.generateMultipleQrCodes(mockItems);

      expect(results).toEqual([
        { name: 'qr1', base64: mockBase64_1 },
        { name: 'qr2', base64: mockBase64_2 },
      ]);
      expect(service.generateQrCodeAsBase64).toHaveBeenCalledTimes(2);
      expect(service.generateQrCodeAsBase64).toHaveBeenCalledWith(
        'https://example1.com',
        'qr1',
        undefined
      );
      expect(service.generateQrCodeAsBase64).toHaveBeenCalledWith(
        'https://example2.com',
        'qr2',
        { width: 300 }
      );
    });

    it('should handle errors from generateQrCodeAsBase64', async () => {
      jest
        .spyOn(service, 'generateQrCodeAsBase64')
        .mockResolvedValueOnce(mockBase64_1)
        .mockRejectedValueOnce(new Error('Failed to generate QR code'));

      await expect(service.generateMultipleQrCodes(mockItems)).rejects.toThrow(
        Error
      );

      expect(service.generateQrCodeAsBase64).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no items provided', async () => {
      const spy = jest.spyOn(service, 'generateQrCodeAsBase64');

      const results = await service.generateMultipleQrCodes([]);

      expect(results).toEqual([]);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
