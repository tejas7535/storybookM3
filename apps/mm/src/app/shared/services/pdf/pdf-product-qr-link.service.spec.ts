import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { Link, QrCodeService } from '@schaeffler/pdf-generator';

import { ResultDataService } from '../result-data.service';
import {
  PdfProductQrLinkService,
  QrCodeData,
} from './pdf-product-qr-link.service';

describe('PdfProductQrLinkService', () => {
  let spectator: SpectatorService<PdfProductQrLinkService>;
  let mockQrCodeService: jest.Mocked<QrCodeService>;
  let mockTranslocoService: jest.Mocked<TranslocoService>;
  let mockResultDataService: jest.Mocked<ResultDataService>;

  const createService = createServiceFactory({
    service: PdfProductQrLinkService,
    providers: [
      {
        provide: QrCodeService,
        useValue: {
          generateMultipleQrCodes: jest.fn(),
        },
      },
      {
        provide: TranslocoService,
        useValue: {
          translate: jest.fn((key) => key),
          getActiveLang: jest.fn(() => 'en'),
        },
      },
      {
        provide: ResultDataService,
        useValue: {
          productsLinksWithQrCodeIds: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    mockQrCodeService = spectator.inject(
      QrCodeService
    ) as jest.Mocked<QrCodeService>;
    mockTranslocoService = spectator.inject(
      TranslocoService
    ) as jest.Mocked<TranslocoService>;
    mockResultDataService = spectator.inject(
      ResultDataService
    ) as jest.Mocked<ResultDataService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('preloadQrCodesWithLinks', () => {
    it('should clear cache and generate QR codes with links', async () => {
      const qrCodes: QrCodeData[] = [
        { data: 'https://example.com/1', name: 'id1', width: 100 },
        { data: 'https://example.com/2', name: 'id2', width: 100 },
      ];

      const generateResults = [
        { name: 'id1', base64: 'base64-1' },
        { name: 'id2', base64: 'base64-2' },
      ];

      mockQrCodeService.generateMultipleQrCodes.mockResolvedValue(
        generateResults
      );
      mockTranslocoService.translate.mockReturnValue('View Product');

      await spectator.service['preloadQrCodesWithLinks'](qrCodes);

      expect(mockQrCodeService.generateMultipleQrCodes).toHaveBeenCalledWith([
        {
          data: 'https://example.com/1',
          name: 'id1',
          options: { width: 100, errorCorrectionLevel: undefined },
        },
        {
          data: 'https://example.com/2',
          name: 'id2',
          options: { width: 100, errorCorrectionLevel: undefined },
        },
      ]);

      expect(spectator.service.getLink('id1')).toEqual({
        text: 'View Product',
        url: 'https://example.com/1',
        qrCodeBase64: 'base64-1',
      });

      expect(spectator.service.getLink('id2')).toEqual({
        text: 'View Product',
        url: 'https://example.com/2',
        qrCodeBase64: 'base64-2',
      });
    });
  });

  describe('preloadProductQrCodes', () => {
    it('should handle empty product IDs', async () => {
      mockResultDataService.productsLinksWithQrCodeIds.mockReturnValue([]);

      await spectator.service.preloadProductQrCodes();

      expect(mockQrCodeService.generateMultipleQrCodes).not.toHaveBeenCalled();
      expect(spectator.service.isReady()).toBe(true);
    });

    it('should preload product QR codes', async () => {
      const productIds = ['product1', 'product2'];
      mockResultDataService.productsLinksWithQrCodeIds.mockReturnValue(
        productIds
      );
      mockTranslocoService.translate.mockImplementation((key) => {
        if (key === 'reportResult.mediasBaseUrl') {
          return 'https://example.com';
        }

        return 'View Product';
      });

      const generateResults = [
        { name: 'product1', base64: 'base64-1' },
        { name: 'product2', base64: 'base64-2' },
      ];

      mockQrCodeService.generateMultipleQrCodes.mockResolvedValue(
        generateResults
      );

      await spectator.service.preloadProductQrCodes();

      expect(mockQrCodeService.generateMultipleQrCodes).toHaveBeenCalledWith([
        {
          data: 'https://example.com/p/product1?utm_source=mounting-manager&utm_medium=pdf',
          name: 'product1',
          options: { width: 100, errorCorrectionLevel: 'M' },
        },
        {
          data: 'https://example.com/p/product2?utm_source=mounting-manager&utm_medium=pdf',
          name: 'product2',
          options: { width: 100, errorCorrectionLevel: 'M' },
        },
      ]);

      expect(spectator.service.isReady()).toBe(true);
    });

    it('should handle errors during QR code generation', async () => {
      const productIds = ['product1'];
      mockResultDataService.productsLinksWithQrCodeIds.mockReturnValue(
        productIds
      );
      mockQrCodeService.generateMultipleQrCodes.mockRejectedValue(
        new Error('Failed')
      );
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await spectator.service.preloadProductQrCodes();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to preload product QR codes',
        expect.any(Error)
      );
      expect(spectator.service.isReady()).toBe(true);
    });
  });

  describe('getLink', () => {
    it('should return a cached link', async () => {
      const link: Link = {
        text: 'View Product',
        url: 'https://example.com',
        qrCodeBase64: 'base64-data',
      };

      await spectator.service['linkCache'].set('test-id', link);

      const result = spectator.service.getLink('test-id');

      expect(result).toEqual(link);
    });

    it('should return undefined for non-existent links', () => {
      const result = spectator.service.getLink('not-found');

      expect(result).toBeUndefined();
    });
  });

  describe('clearCache', () => {
    it('should clear the link cache', async () => {
      const link: Link = {
        text: 'View Product',
        url: 'https://example.com',
        qrCodeBase64: 'base64-data',
      };

      await spectator.service['linkCache'].set('test-id', link);
      expect(spectator.service.getLink('test-id')).toEqual(link);

      spectator.service.clearCache();

      expect(spectator.service.getLink('test-id')).toBeUndefined();
    });
  });
});
