import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { Colors } from '../../constants';
import { QRCodeOptions } from './qr-code.interface';
import { QrCodeService } from './qr-code.service';
import { QR_CODE_LIB } from './qr-code.token';

describe('QrCodeService', () => {
  let spectator: SpectatorService<QrCodeService>;
  let service: QrCodeService;
  let mockQrGenerator: jest.Mocked<{ toDataURL: jest.Mock }>;
  let originalConsoleError: typeof console.error;

  const createService = createServiceFactory({
    service: QrCodeService,
    providers: [
      {
        provide: QR_CODE_LIB,
        useValue: {
          toDataURL: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockQrGenerator = spectator.inject(QR_CODE_LIB) as jest.Mocked<{
      toDataURL: jest.Mock;
    }>;

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

  describe('generateQrCodeAsBase64', () => {
    const mockQrData = 'https://example.com';
    const mockQrName = 'test-qr';
    const mockBase64 = 'data:image/png;base64,mockBase64String';

    beforeEach(() => {
      (mockQrGenerator.toDataURL as jest.Mock).mockResolvedValue(mockBase64);
    });

    it('should generate QR code with default options', async () => {
      const result = await service.generateQrCodeAsBase64(
        mockQrData,
        mockQrName
      );

      expect(result).toBe(mockBase64);
      expect(mockQrGenerator.toDataURL).toHaveBeenCalledWith(mockQrData, {
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
      expect(mockQrGenerator.toDataURL).toHaveBeenCalledWith(mockQrData, {
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
      expect(mockQrGenerator.toDataURL).toHaveBeenCalledWith(
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
      (mockQrGenerator.toDataURL as jest.Mock).mockRejectedValue(mockError);

      await expect(
        service.generateQrCodeAsBase64(mockQrData, mockQrName)
      ).rejects.toThrow(errorMessage);

      expect(mockQrGenerator.toDataURL).toHaveBeenCalledWith(mockQrData, {
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

describe('QrCodeService without QR generator', () => {
  let spectator: SpectatorService<QrCodeService>;
  let service: QrCodeService;
  let originalConsoleWarn: typeof console.warn;

  const createService = createServiceFactory({
    service: QrCodeService,
    providers: [], // No QR_CODE_LIB provider
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;

    // Mock console.warn to prevent cluttering test output
    originalConsoleWarn = console.warn;
    console.warn = jest.fn();
  });

  afterEach(() => {
    // Restore original console.warn
    console.warn = originalConsoleWarn;
  });

  it('should handle missing QR generator dependency gracefully', async () => {
    const result = await service.generateQrCodeAsBase64('test', 'test-name');

    expect(result).toBe('');
    expect(console.warn).toHaveBeenCalledWith(
      'QR Code generator not provided, provide qr code lib as dependency'
    );
  });

  it('should handle missing QR generator in generateMultipleQrCodes', async () => {
    const result = await service.generateMultipleQrCodes([
      { data: 'test', name: 'test-name' },
    ]);

    expect(result).toEqual([]);
    expect(console.warn).toHaveBeenCalledWith(
      'QR Code generator not provided, provide qr code lib as dependency'
    );
  });
});
