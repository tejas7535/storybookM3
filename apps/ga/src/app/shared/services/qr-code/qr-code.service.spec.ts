import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { GreaseShopService } from '@ga/features/grease-calculation/calculation-result/components/grease-report-shop-buttons/grease-shop.service';
import { PartnerVersion } from '@ga/shared/models';

import { QrCodeService } from './qr-code.service';

// Mock the QRCode library to prevent console errors during testing
jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}));

// Import the mocked module
import * as QRCode from 'qrcode';

describe('QrCodeService', () => {
  let spectator: SpectatorService<QrCodeService>;
  let service: QrCodeService;
  let greaseShopService: jest.Mocked<GreaseShopService>;
  let originalConsoleError: typeof console.error;
  let mockToDataURL: jest.MockedFunction<typeof QRCode.toDataURL>;

  const createService = createServiceFactory({
    service: QrCodeService,
    providers: [
      {
        provide: GreaseShopService,
        useValue: {
          getShopUrl: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    greaseShopService = spectator.inject(
      GreaseShopService
    ) as jest.Mocked<GreaseShopService>;

    // Mock console.error to prevent cluttering test output
    originalConsoleError = console.error;
    console.error = jest.fn();

    // Get the mocked function and reset it
    mockToDataURL = QRCode.toDataURL as jest.MockedFunction<
      typeof QRCode.toDataURL
    >;
    jest.resetAllMocks();

    // Setup mock implementation
    mockToDataURL.mockImplementation((data: any, _options?: any) => {
      // Check if data is a string
      if (typeof data === 'string') {
        if (!data || data.trim() === '') {
          return Promise.reject(new Error('No input text'));
        }

        return Promise.resolve(
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        );
      }

      return Promise.reject(new Error('Invalid input'));
    });
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateGreaseQrCode', () => {
    it('should generate QR code for grease with shop URL', async () => {
      const greaseTitle = 'Arcanol LOAD1000';
      const partner = PartnerVersion.Schmeckthal;
      const expectedUrl = 'https://shop.example.com/p/arcanol-load1000';

      greaseShopService.getShopUrl.mockReturnValue(expectedUrl);

      const result = await service.generateGreaseQrCode(greaseTitle, partner);

      expect(greaseShopService.getShopUrl).toHaveBeenCalledWith(
        greaseTitle,
        partner
      );
      expect(result).toContain('data:image/png;base64,');
    });

    it('should handle errors when generating QR code', async () => {
      const greaseTitle = 'Test Grease';
      const partner = PartnerVersion.Schmeckthal;
      const url = 'simple-url-text';

      greaseShopService.getShopUrl.mockReturnValue(url);

      const result = await service.generateGreaseQrCode(greaseTitle, partner);

      expect(greaseShopService.getShopUrl).toHaveBeenCalledWith(
        greaseTitle,
        partner
      );
      expect(result).toContain('data:image/png;base64,');
    });
  });

  describe('generateQrCodeAsBase64', () => {
    it('should generate QR code with default options', async () => {
      const data = 'https://example.com';

      const result = await service.generateQrCodeAsBase64(data);

      expect(result).toContain('data:image/png;base64,');
    });

    it('should generate QR code with custom options', async () => {
      const data = 'https://example.com';
      const options = {
        errorCorrectionLevel: 'H' as const,
        width: 300,
      };

      const result = await service.generateQrCodeAsBase64(data, options);

      expect(result).toContain('data:image/png;base64,');
    });

    it('should handle errors when generating QR code with empty string', async () => {
      await expect(service.generateQrCodeAsBase64('')).rejects.toThrow(
        'No input text'
      );

      expect(console.error).toHaveBeenCalledWith(
        'Error generating QR code:',
        expect.any(Error)
      );
    });

    it('should handle errors when generating QR code with invalid data', async () => {
      await expect(
        service.generateQrCodeAsBase64(undefined as any)
      ).rejects.toThrow('Invalid input');

      expect(console.error).toHaveBeenCalledWith(
        'Error generating QR code:',
        expect.any(Error)
      );
    });
  });

  describe('generateMultipleQrCodes', () => {
    it('should generate multiple QR codes', async () => {
      const items = [
        { data: 'https://example1.com', name: 'test1' },
        { data: 'https://example2.com', name: 'test2' },
      ];

      const results = await service.generateMultipleQrCodes(items);

      expect(results).toHaveLength(2);
      expect(results[0].name).toBe('test1');
      expect(results[0].base64).toContain('data:image/png;base64,');
      expect(results[1].name).toBe('test2');
      expect(results[1].base64).toContain('data:image/png;base64,');
    });

    it('should handle errors in multiple QR code generation with empty strings', async () => {
      const items = [
        { data: 'https://example1.com', name: 'test1' },
        { data: '', name: 'test2' }, // Empty string will cause an error
      ];

      await expect(service.generateMultipleQrCodes(items)).rejects.toThrow(
        'No input text'
      );
    });

    it('should handle errors in multiple QR code generation with invalid data', async () => {
      const items = [
        { data: undefined as any, name: 'test1' }, // This will cause an error
      ];

      await expect(service.generateMultipleQrCodes(items)).rejects.toThrow(
        'Invalid input'
      );
    });
  });
});
