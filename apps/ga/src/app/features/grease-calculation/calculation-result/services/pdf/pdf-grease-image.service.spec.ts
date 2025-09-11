import { of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ImageResolverService } from '@schaeffler/pdf-generator';

import { CalculationParametersFacade } from '@ga/core/store';

import { PdfGreaseImageService } from './pdf-grease-image.service';

describe('PdfGreaseImageService', () => {
  let spectator: SpectatorService<PdfGreaseImageService>;
  let service: PdfGreaseImageService;

  const mockConsole = {
    warn: jest.fn(),
  };

  const createService = createServiceFactory({
    service: PdfGreaseImageService,
    mocks: [
      ImageResolverService,
      TranslocoService,
      CalculationParametersFacade,
    ],
  });

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(mockConsole.warn);

    const mockGreaseData = [
      {
        name: 'TestGrease',
        data: { imageUrl: 'https://example.com/test-image.jpg' },
      },
      {
        name: 'NoImageGrease',
        data: {},
      },
    ];

    spectator = createService({
      providers: [
        {
          provide: CalculationParametersFacade,
          useValue: {
            schaefflerGreases$: of(mockGreaseData),
          },
        },
      ],
    });
    service = spectator.service;

    const mockTranslocoService = spectator.inject(TranslocoService);
    mockTranslocoService.translate.mockReturnValue('Translated Text');
  });

  afterEach(() => {
    mockConsole.warn.mockClear();
    jest.restoreAllMocks();
  });

  describe('getGreaseImageBase64', () => {
    it('should return base64 image when grease exists', async () => {
      const expectedBase64 = 'data:image/jpeg;base64,ABC123';
      const mockImageResolverService = spectator.inject(ImageResolverService);

      mockImageResolverService.fetchImageObject.mockReturnValue(
        of({ imageUrl: expectedBase64 }) as any
      );

      const result = await service.getGreaseImageBase64('TestGrease');

      expect(result).toBe(expectedBase64);
      expect(mockImageResolverService.fetchImageObject).toHaveBeenCalledWith(
        { imageUrl: 'https://example.com/test-image.jpg' },
        'imageUrl'
      );
    });

    it('should return undefined when grease not found', async () => {
      const result = await service.getGreaseImageBase64('NonExistentGrease');

      expect(result).toBeUndefined();
      const mockImageResolverService = spectator.inject(ImageResolverService);
      expect(mockImageResolverService.fetchImageObject).not.toHaveBeenCalled();
    });

    it('should return undefined when grease has no image URL', async () => {
      const result = await service.getGreaseImageBase64('NoImageGrease');

      expect(result).toBeUndefined();
      const mockImageResolverService = spectator.inject(ImageResolverService);
      expect(mockImageResolverService.fetchImageObject).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and log warning', async () => {
      const mockImageResolverService = spectator.inject(ImageResolverService);
      mockImageResolverService.fetchImageObject.mockImplementation(() => {
        throw new Error('Network error');
      });

      const result = await service.getGreaseImageBase64('TestGrease');

      expect(result).toBeUndefined();
      expect(mockConsole.warn).toHaveBeenCalledWith(
        'Failed to load image for grease TestGrease:',
        expect.any(Error)
      );
    });
  });

  describe('getConcept1ArrowImage', () => {
    it('should load correct image for valid duration', async () => {
      const expectedBase64 = 'data:image/png;base64,XYZ789';
      const mockImageResolverService = spectator.inject(ImageResolverService);
      mockImageResolverService.readImageFromAssets.mockReturnValue(
        of(expectedBase64) as any
      );

      const result = await service.getConcept1ArrowImage(60);

      expect(result).toBe(expectedBase64);
      expect(mockImageResolverService.readImageFromAssets).toHaveBeenCalledWith(
        '/assets/images/pdf/setting_60.png'
      );
    });

    it('should load disabled image for no duration', async () => {
      const expectedBase64 = 'data:image/png;base64,DISABLED';
      const mockImageResolverService = spectator.inject(ImageResolverService);
      mockImageResolverService.readImageFromAssets.mockReturnValue(
        of(expectedBase64) as any
      );

      const result = await service.getConcept1ArrowImage(0);

      expect(result).toBe(expectedBase64);
      expect(mockImageResolverService.readImageFromAssets).toHaveBeenCalledWith(
        '/assets/images/pdf/setting_disabled.png'
      );
    });
  });

  describe('getPartnerVersionHeaderInfo', () => {
    it('should return header info for valid partner version', async () => {
      const expectedLogo = 'data:image/png;base64,LOGO123';
      const mockImageResolverService = spectator.inject(ImageResolverService);
      const mockTranslocoService = spectator.inject(TranslocoService);

      mockImageResolverService.readImageFromAssets.mockReturnValue(
        of(expectedLogo) as any
      );

      const result = await service.getPartnerVersionHeaderInfo(
        'partner1' as any
      );

      expect(result).toEqual({
        title: 'Translated Text',
        schaefflerLogo: expectedLogo,
      });
      expect(mockTranslocoService.translate).toHaveBeenCalledWith(
        'calculationResult.poweredBy',
        undefined
      );
    });

    it('should return undefined for empty partner version', async () => {
      const result = await service.getPartnerVersionHeaderInfo('' as any);

      expect(result).toBeUndefined();
      const mockImageResolverService = spectator.inject(ImageResolverService);
      expect(
        mockImageResolverService.readImageFromAssets
      ).not.toHaveBeenCalled();
    });
  });

  describe('loadImageFromAssets', () => {
    it('should load image from assets path', async () => {
      const expectedBase64 = 'data:image/png;base64,ASSET123';
      const mockImageResolverService = spectator.inject(ImageResolverService);
      mockImageResolverService.readImageFromAssets.mockReturnValue(
        of(expectedBase64) as any
      );

      const result = await service.loadImageFromAssets('/test/path.png');

      expect(result).toBe(expectedBase64);
      expect(mockImageResolverService.readImageFromAssets).toHaveBeenCalledWith(
        '/test/path.png'
      );
    });
  });
});
