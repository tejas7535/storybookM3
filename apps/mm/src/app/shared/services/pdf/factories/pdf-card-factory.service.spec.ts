import { TranslocoService } from '@jsverse/transloco';
import {
  PumpItem,
  ResultItem,
} from '@mm/core/store/models/calculation-result-state.model';
import { BadgeConfig } from '@mm/shared/components/pdf/building-blocks';
import { PdfProductQrLinkService } from '@mm/shared/services/pdf/pdf-product-qr-link.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  PdfCardComponent,
  PdfComponentFactory,
} from '@schaeffler/pdf-generator';

import { PdfCardFactory } from './pdf-card-factory.service';

jest.mock('@mm/shared/components/pdf/cards-content', () => ({
  MountingToolCardContent: jest
    .fn()
    .mockImplementation(() => 'mockCardContent'),
  SleeveConnectorCardContent: jest
    .fn()
    .mockImplementation(() => 'mockCardContent'),
}));

jest.mock(
  '@mm/shared/components/pdf/cards-content/temperature-card-content',
  () => ({
    TemperatureCardContent: jest
      .fn()
      .mockImplementation(() => 'mockTemperatureCardContent'),
  })
);

describe('PdfCardFactory', () => {
  let spectator: SpectatorService<PdfCardFactory>;
  let mockPdfComponentFactory: jest.Mocked<PdfComponentFactory>;
  let mockTranslocoService: jest.Mocked<TranslocoService>;
  let mockPdfCard: PdfCardComponent;
  const translate = jest.fn((key: string) => {
    switch (key) {
      case 'reportResult.mediasBaseUrl':
        return 'https://example.com';
      case 'reportResult.pumps.recommended':
        return 'Recommended';
      case 'reportResult.pumps.alternative':
        return 'Alternative';
      case 'reportResult.viewProductButton':
        return 'View Product';
      default:
        return key;
    }
  });

  const mockGetLink = jest.fn().mockImplementation((value: string) => ({
    text: 'View Product',
    url: `https://example.com/${value}`,
    qrCodeBase64: 'mock-qr-code',
  }));

  const createService = createServiceFactory({
    service: PdfCardFactory,
    providers: [
      {
        provide: TranslocoService,
        useValue: {
          translate,
        },
      },
      {
        provide: PdfProductQrLinkService,
        useValue: {
          getLink: mockGetLink,
        },
      },
    ],
    mocks: [PdfComponentFactory],
  });

  beforeEach(() => {
    translate.mockClear();
    mockGetLink.mockClear();
    spectator = createService();
    mockPdfComponentFactory = spectator.inject(
      PdfComponentFactory
    ) as jest.Mocked<PdfComponentFactory>;
    mockTranslocoService = spectator.inject(
      TranslocoService
    ) as jest.Mocked<TranslocoService>;

    mockPdfCard = {} as PdfCardComponent;
    mockPdfComponentFactory.createSingleComponentCard.mockReturnValue(
      mockPdfCard
    );
  });

  describe('createMountingToolCard', () => {
    it('should create a mounting tool card with the pump item data', () => {
      const pumpItem: PumpItem = {
        field: 'Tool Name',
        value: 'Tool123',
        isRecommended: true,
      };
      const leftColumnWidth = 0.25;
      const imageDataBase64 = 'image-data';
      const badge: BadgeConfig = {
        textValue: 'Badge',
        style: 'alternative',
        position: 'above-title' as const,
      };

      const result = spectator.service.createMountingToolCard(
        pumpItem,
        leftColumnWidth,
        imageDataBase64,
        badge
      );

      expect(
        mockPdfComponentFactory.createSingleComponentCard
      ).toHaveBeenCalled();
      expect(result).toBe(mockPdfCard);
    });
  });

  describe('createLockNutCard', () => {
    it('should create a lock nut card with the result item data', () => {
      const resultItem: ResultItem = {
        designation: 'Lock Nut',
        value: 'LN456',
        unit: 'mm',
        abbreviation: 'LN',
      };
      const imageDataBase64 = 'lock-nut-image';

      const result = spectator.service.createLockNutCard(
        resultItem,
        imageDataBase64
      );

      expect(
        mockPdfComponentFactory.createSingleComponentCard
      ).toHaveBeenCalled();
      expect(result).toBe(mockPdfCard);
    });
  });

  describe('createRecommendedBadge', () => {
    it('should create a recommended badge with default position', () => {
      const badge = spectator.service.createRecommendedBadge();

      expect(badge).toEqual({
        textValue: 'Recommended',
        style: 'recommended',
        position: 'top-right',
      });
      expect(mockTranslocoService.translate).toHaveBeenCalledWith(
        'reportResult.pumps.recommended'
      );
    });

    it('should create a recommended badge with custom position', () => {
      const badge = spectator.service.createRecommendedBadge('above-title');

      expect(badge).toEqual({
        textValue: 'Recommended',
        style: 'recommended',
        position: 'above-title',
      });
    });
  });

  describe('createAlternativeBadge', () => {
    it('should create an alternative badge with default position', () => {
      const badge = spectator.service.createAlternativeBadge();

      expect(badge).toEqual({
        textValue: 'Alternative',
        style: 'alternative',
        position: 'above-title',
      });
      expect(mockTranslocoService.translate).toHaveBeenCalledWith(
        'reportResult.pumps.alternative'
      );
    });

    it('should create an alternative badge with custom position', () => {
      const badge = spectator.service.createAlternativeBadge('top-right');

      expect(badge).toEqual({
        textValue: 'Alternative',
        style: 'alternative',
        position: 'top-right',
      });
    });
  });

  describe('getProductMediasUrl (indirectly)', () => {
    it('should create a card with a correct product URL', () => {
      const resultItem: ResultItem = {
        designation: 'Product Title',
        value: 'ABC123',
        unit: 'mm',
        abbreviation: 'PT',
      };
      const imageDataBase64 = 'image-data';

      // Reset mocks to ensure we're tracking new calls
      mockGetLink.mockClear();

      spectator.service.createLockNutCard(resultItem, imageDataBase64);

      // Verify that getLink was called with the right value
      expect(mockGetLink).toHaveBeenCalledWith('ABC123');
    });
  });

  describe('createTemperatureCard', () => {
    it('should create a temperature card with the temperature data', () => {
      const temperatures: ResultItem[] = [
        {
          designation: 'Heating temperature',
          value: '58.7',
          unit: '°C',
          abbreviation: 'T',
        },
        {
          designation: 'Target temperature',
          value: '65.0',
          unit: '°C',
          abbreviation: 'T_target',
        },
      ];

      const result = spectator.service.createTemperatureCard(temperatures);

      expect(result).toBe(mockPdfCard);
      expect(
        mockPdfComponentFactory.createSingleComponentCard
      ).toHaveBeenCalledWith(
        expect.any(Object), // TemperatureCardContent instance
        { keepTogether: true }
      );
    });

    it('should handle temperature with missing unit gracefully', () => {
      const temperatures: ResultItem[] = [
        {
          designation: 'Temperature without unit',
          value: '80',
          abbreviation: 'T',
          unit: '',
        },
      ];

      const result = spectator.service.createTemperatureCard(temperatures);

      expect(result).toBe(mockPdfCard);
      expect(
        mockPdfComponentFactory.createSingleComponentCard
      ).toHaveBeenCalledWith(
        expect.any(Object), // TemperatureCardContent instance
        { keepTogether: true }
      );
    });

    it('should handle empty temperatures array', () => {
      const temperatures: ResultItem[] = [];

      const result = spectator.service.createTemperatureCard(temperatures);

      expect(result).toBe(mockPdfCard);
      expect(
        mockPdfComponentFactory.createSingleComponentCard
      ).toHaveBeenCalledWith(
        expect.any(Object), // TemperatureCardContent instance
        { keepTogether: true }
      );
    });
  });
});
