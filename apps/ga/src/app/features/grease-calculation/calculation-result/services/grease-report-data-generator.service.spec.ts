import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TranslocoModule } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { QrCodeService } from '@schaeffler/pdf-generator';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PartnerVersion } from '@ga/shared/models';
import {
  APP_STATE_MOCK,
  GREASE_PDF_INPUT_MOCK,
  GREASE_RESULT_SUBORDINATES_MOCK,
  greaseResultMock,
  greaseSelectionMock,
  initialLubricationMock,
  performanceMock,
  relubricationMock,
} from '@ga/testing/mocks';

import { GreaseShopService } from '../components/grease-report-shop-buttons/grease-shop.service';
import { GreasePdfInput, GreasePdfMessage, GreaseResult } from '../models';
import { GreaseReportDataGeneratorService } from './grease-report-data-generator.service';
import { ListItemsWrapperService } from './pdf/list-items-wrapper.service';
import { PdfGreaseImageService } from './pdf/pdf-grease-image.service';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((translateKey: string) => {
    switch (translateKey) {
      default:
        return translateKey.toString().replace('calculationResult.', '');
    }
  }),
}));

describe('GreaseReportDataGeneratorService', () => {
  let spectator: SpectatorService<GreaseReportDataGeneratorService>;
  let service: GreaseReportDataGeneratorService;
  let mockQrCodeService: jest.Mocked<QrCodeService>;
  let mockPdfGreaseImageService: jest.Mocked<PdfGreaseImageService>;
  let consoleErrorSpy: jest.SpyInstance | undefined;
  const localizeNumber = jest.fn((number) => `${number}`);

  const createService = createServiceFactory({
    service: GreaseReportDataGeneratorService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideMockStore({
        initialState: { ...APP_STATE_MOCK },
      }),
      mockProvider(TranslocoLocaleService, { localizeNumber }),
      mockProvider(QrCodeService, {
        generateQrCodeAsBase64: jest.fn().mockResolvedValue('test-qr-code'),
      }),
      mockProvider(ListItemsWrapperService, {
        wrapListItems: jest.fn((items: string[]) => items || []),
      }),
      mockProvider(GreaseShopService, {
        getShopUrl: jest
          .fn()
          .mockReturnValue(
            'calculationResult.shopBaseUrl/p/Arcanol-MULTI2-1kg?utm_source=grease-app&affiliateid=A100101248'
          ),
      }),
      mockProvider(PdfGreaseImageService, {
        getGreaseImageBase64: jest.fn().mockResolvedValue('base64-image-data'),
        getPartnerVersionHeaderInfo: jest
          .fn()
          .mockImplementation((partnerVersion: string) => {
            if (partnerVersion) {
              return Promise.resolve({
                title: 'calculationResult.poweredBy',
                schaefflerLogo: 'base64-image-data',
              });
            }

            return Promise.resolve(undefined);
          }),
        getConcept1ArrowImage: jest.fn().mockResolvedValue('base64-image-data'),
        loadImageFromAssets: jest.fn().mockResolvedValue('base64-image-data'),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockQrCodeService = spectator.inject(
      QrCodeService
    ) as jest.Mocked<QrCodeService>;
    mockPdfGreaseImageService = spectator.inject(
      PdfGreaseImageService
    ) as jest.Mocked<PdfGreaseImageService>;

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('prepare report input data', () => {
    it('should return formatted data', () => {
      const result: GreasePdfInput = service.prepareReportInputData(
        GREASE_RESULT_SUBORDINATES_MOCK
      );

      expect(result).toEqual(GREASE_PDF_INPUT_MOCK);
    });

    it('should gracefully return empty data if empty input provided', () => {
      const result: GreasePdfInput = service.prepareReportInputData([]);

      expect(result).toEqual({
        sectionTitle: GREASE_PDF_INPUT_MOCK.sectionTitle,
        tableItems: [],
      } as GreasePdfInput);
    });
  });

  describe('prepare report errors and warnings data', () => {
    it('should return formatted data', () => {
      const result: GreasePdfMessage =
        service.prepareReportErrorsAndWarningsData(
          GREASE_RESULT_SUBORDINATES_MOCK
        );

      expect(result).toMatchSnapshot();
    });

    it('should gracefully return empty data if empty input provided', () => {
      const result: GreasePdfMessage =
        service.prepareReportErrorsAndWarningsData([]);

      expect(result).toEqual({
        sectionTitle: 'calculationResult.errorsWarningsNotes',
        messageItems: [],
      } as GreasePdfMessage);
    });
  });

  describe('prepareReportResultData', () => {
    const mockGreaseResult: GreaseResult = {
      ...greaseResultMock,
      initialLubrication: initialLubricationMock,
      performance: performanceMock,
      relubrication: relubricationMock,
      greaseSelection: greaseSelectionMock,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should prepare report result data successfully', async () => {
      const greaseResults = [mockGreaseResult];
      const partnerVersion = PartnerVersion.Schmeckthal;

      const result = await service.prepareReportResultData(
        greaseResults,
        partnerVersion
      );

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        mainTitle: mockGreaseResult.mainTitle,
        subTitle: mockGreaseResult.subTitle,
        isSufficient: mockGreaseResult.isSufficient,
        qrCode: 'test-qr-code',
      });
      expect(mockQrCodeService.generateQrCodeAsBase64).toHaveBeenCalledWith(
        'calculationResult.shopBaseUrl/p/Arcanol-MULTI2-1kg?utm_source=grease-app&affiliateid=A100101248&utm_medium=pdf',
        'Arcanol MULTI2',
        {}
      );
    });

    it('should handle multiple grease results', async () => {
      const greaseResults = [
        mockGreaseResult,
        { ...mockGreaseResult, mainTitle: 'Second Grease' },
      ];
      const partnerVersion = PartnerVersion.Schmeckthal;

      const result = await service.prepareReportResultData(
        greaseResults,
        partnerVersion
      );

      expect(result).toHaveLength(2);
      expect(result[0].mainTitle).toBe(mockGreaseResult.mainTitle);
      expect(result[1].mainTitle).toBe('Second Grease');
    });

    it('should handle recommended grease', async () => {
      const recommendedGrease = {
        ...mockGreaseResult,
        isRecommended: true,
      };
      const partnerVersion = PartnerVersion.Schmeckthal;

      const result = await service.prepareReportResultData(
        [recommendedGrease],
        partnerVersion
      );

      expect(result[0].recommended).toBe('calculationResult.recommendedChip');
    });

    it('should handle miscible grease', async () => {
      const miscibleGrease = {
        ...mockGreaseResult,
        isMiscible: true,
      };
      const partnerVersion = PartnerVersion.Schmeckthal;

      const result = await service.prepareReportResultData(
        [miscibleGrease],
        partnerVersion
      );

      expect(result[0].miscible).toBe('calculationResult.miscibleChip');
    });

    it('should handle grease without recommended and miscible flags', async () => {
      const regularGrease = {
        ...mockGreaseResult,
        isRecommended: false,
        isMiscible: false,
      };
      const partnerVersion = PartnerVersion.Schmeckthal;

      const result = await service.prepareReportResultData(
        [regularGrease],
        partnerVersion
      );

      expect(result[0].recommended).toBeUndefined();
      expect(result[0].miscible).toBeUndefined();
    });

    it('should handle QR code generation failure gracefully', async () => {
      mockQrCodeService.generateQrCodeAsBase64.mockRejectedValue(
        new Error('QR code error')
      );

      const result = await service.prepareReportResultData(
        [mockGreaseResult],
        PartnerVersion.Schmeckthal
      );

      expect(result[0].qrCode).toBe('');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Failed to generate QR code for ${mockGreaseResult.mainTitle}:`,
        expect.any(Error)
      );
    });

    it('should generate correct sections structure', async () => {
      const result = await service.prepareReportResultData(
        [mockGreaseResult],
        PartnerVersion.Schmeckthal
      );

      expect(result[0].sections).toHaveLength(4);
      expect(result[0].sections[0].sectionTitle).toBe(
        'calculationResult.initialLubrication'
      );
      expect(result[0].sections[1].sectionTitle).toBe(
        'calculationResult.performance'
      );
      expect(result[0].sections[2].sectionTitle).toBe(
        'calculationResult.relubrication'
      );
      expect(result[0].sections[3].sectionTitle).toBe(
        'calculationResult.greaseSelection'
      );
    });

    it('should handle performance section with viscosity ratio kappa badge', async () => {
      const greaseWithBadgeValue = {
        ...mockGreaseResult,
        performance: {
          ...performanceMock,
          viscosityRatio: {
            title: 'viscosityRatio',
            value: 2.5, // This should trigger a badge
          },
        },
      };

      const result = await service.prepareReportResultData(
        [greaseWithBadgeValue],
        PartnerVersion.Schmeckthal
      );

      const performanceSection = result[0].sections[1];
      const viscosityRatioItem = performanceSection.values.find(
        (item) => item?.title === 'calculationResult.viscosityRatio'
      );

      expect(viscosityRatioItem).toBeDefined();
      expect(viscosityRatioItem?.badgeClass).toBeDefined();
    });

    it('should handle concept1 data in relubrication section', async () => {
      const greaseWithConcept1 = {
        ...mockGreaseResult,
        relubrication: {
          ...relubricationMock,
          concept1: {
            title: 'concept1',
            custom: {
              selector: 'concept1',
              data: {
                c1_60: 300,
                label: 'concept1Label',
              },
            },
          },
        },
      };

      const result = await service.prepareReportResultData(
        [greaseWithConcept1],
        PartnerVersion.Schmeckthal
      );

      const relubricationSection = result[0].sections[2];
      const concept1Item = relubricationSection.values.find(
        (item) => item?.concept1Data
      );

      expect(concept1Item).toBeDefined();
      expect(concept1Item?.concept1Data).toBeDefined();
      expect(concept1Item?.concept1Data?.arrowImage).toBe('base64-image-data');
      expect(
        mockPdfGreaseImageService.getConcept1ArrowImage
      ).toHaveBeenCalled();
    });

    it('should handle empty or undefined subtitle', async () => {
      const greaseWithoutSubtitle = {
        ...mockGreaseResult,
        subTitle: undefined as any,
      };

      const result = await service.prepareReportResultData(
        [greaseWithoutSubtitle],
        PartnerVersion.Schmeckthal
      );

      expect(result[0].subTitle).toBe('');
    });

    it('should filter out falsy section values', async () => {
      const greaseWithEmptyValues = {
        ...mockGreaseResult,
        performance: {
          ...performanceMock,
          viscosityRatio: undefined as any, // This should be filtered out
        },
      };

      const result = await service.prepareReportResultData(
        [greaseWithEmptyValues],
        PartnerVersion.Schmeckthal
      );

      const performanceSection = result[0].sections[1];
      const undefinedItems = performanceSection.values.filter((item) => !item);

      expect(undefinedItems).toHaveLength(0);
    });

    it('should include partner version header info when partner version is provided', async () => {
      const result = await service.prepareReportResultData(
        [mockGreaseResult],
        PartnerVersion.Schmeckthal
      );

      expect(result[0].partnerVersionInfo).toBeDefined();
      expect(result[0].partnerVersionInfo).toEqual({
        title: 'calculationResult.poweredBy',
        schaefflerLogo: 'base64-image-data',
      });
      expect(
        mockPdfGreaseImageService.getPartnerVersionHeaderInfo
      ).toHaveBeenCalledWith(PartnerVersion.Schmeckthal);
    });

    it('should not include partner version header info when partner version is not provided', async () => {
      const result = await service.prepareReportResultData(
        [mockGreaseResult],
        '' as any
      );

      expect(result[0].partnerVersionInfo).toBeUndefined();
    });
  });
});
