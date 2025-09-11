import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  Colors,
  Component,
  PdfCardComponent,
  PdfComponentFactory,
  PdfLayoutService,
  SectionHeading,
  TwoColumnPageLayout,
} from '@schaeffler/pdf-generator';

import { GreaseResultCardContent } from '@ga/shared/components/pdf/card-contents/grease-result-card-content';

import { PDFGreaseReportResult } from '../../../models';
import { PdfResultsService } from './pdf-results.service';

jest.mock('@ga/shared/components/pdf/card-contents/grease-result-card-content');

describe('PdfResultsService', () => {
  let spectator: SpectatorService<PdfResultsService>;
  let service: PdfResultsService;
  let mockLayoutService: jest.Mocked<PdfLayoutService>;
  let mockComponentFactory: jest.Mocked<PdfComponentFactory>;
  let mockTranslocoService: jest.Mocked<TranslocoService>;

  // Test data factories
  const createMockResult = (
    overrides: Partial<PDFGreaseReportResult> = {}
  ): PDFGreaseReportResult => ({
    sections: [],
    isSufficient: true,
    mainTitle: 'Test',
    subTitle: 'Test',
    qrCode: 'test',
    greaseLink: 'test',
    ...overrides,
  });

  const mockResults: PDFGreaseReportResult[] = [
    createMockResult({
      mainTitle: 'Test Grease 1',
      subTitle: 'Test Subtitle 1',
      qrCode: 'test-qr-code-1',
      greaseLink: 'test-grease-link-1',
      recommended: 'Yes',
      miscible: 'No',
    }),
    createMockResult({
      isSufficient: false,
      mainTitle: 'Test Grease 2',
      subTitle: 'Test Subtitle 2',
      qrCode: 'test-qr-code-2',
      greaseLink: 'test-grease-link-2',
    }),
  ];

  const createService = createServiceFactory({
    service: PdfResultsService,
    mocks: [PdfLayoutService, PdfComponentFactory, TranslocoService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockLayoutService = spectator.inject(
      PdfLayoutService
    ) as jest.Mocked<PdfLayoutService>;
    mockComponentFactory = spectator.inject(
      PdfComponentFactory
    ) as jest.Mocked<PdfComponentFactory>;
    mockTranslocoService = spectator.inject(
      TranslocoService
    ) as jest.Mocked<TranslocoService>;

    // Setup default mock implementations
    mockTranslocoService.translate.mockImplementation((key: any) => key);

    // Reset the mock
    (
      GreaseResultCardContent as jest.MockedClass<
        typeof GreaseResultCardContent
      >
    ).mockClear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateResultsSection', () => {
    it('should generate result sections with cards, layouts and subheading', () => {
      const mockCardContent = {} as GreaseResultCardContent;
      const mockCard = {} as PdfCardComponent;
      const mockLayouts = [
        {} as TwoColumnPageLayout,
        {} as TwoColumnPageLayout,
      ];

      (
        GreaseResultCardContent as jest.MockedClass<
          typeof GreaseResultCardContent
        >
      ).mockImplementation(() => mockCardContent);
      mockComponentFactory.createSingleComponentCard.mockReturnValue(mockCard);
      mockLayoutService.createTwoColumnLayouts.mockReturnValue(mockLayouts);

      const result = service.generateResultsSection(mockResults);

      expect(GreaseResultCardContent).toHaveBeenCalledTimes(2);
      expect(GreaseResultCardContent).toHaveBeenNthCalledWith(
        1,
        mockResults[0],
        {
          backgroundColor: Colors.Surface,
          padding: 0,
          margin: 0,
        }
      );
      expect(GreaseResultCardContent).toHaveBeenNthCalledWith(
        2,
        mockResults[1],
        {
          backgroundColor: Colors.Surface,
          padding: 0,
          margin: 0,
        }
      );

      expect(
        mockComponentFactory.createSingleComponentCard
      ).toHaveBeenCalledTimes(2);
      expect(
        mockComponentFactory.createSingleComponentCard
      ).toHaveBeenCalledWith(mockCardContent, {
        keepTogether: false,
        padding: 2,
      });

      expect(mockLayoutService.createTwoColumnLayouts).toHaveBeenCalledWith([
        mockCard,
        mockCard,
      ]);

      expect(result).toHaveLength(3); // heading + 2 layouts
      expect(result[0]).toBeInstanceOf(SectionHeading);
      expect(result[1]).toBe(mockLayouts[0]);
      expect(result[2]).toBe(mockLayouts[1]);
    });

    it('should handle empty results array', () => {
      const mockLayouts = [] as TwoColumnPageLayout[];

      mockLayoutService.createTwoColumnLayouts.mockReturnValue(mockLayouts);

      const result = service.generateResultsSection([]);

      expect(GreaseResultCardContent).not.toHaveBeenCalled();
      expect(
        mockComponentFactory.createSingleComponentCard
      ).not.toHaveBeenCalled();
      expect(mockLayoutService.createTwoColumnLayouts).toHaveBeenCalledWith([]);
      expect(result).toHaveLength(1); // only heading, no layouts
      expect(result[0]).toBeInstanceOf(SectionHeading);
    });

    it('should handle single result', () => {
      const singleResult = [mockResults[0]];
      const mockCardContent = {} as GreaseResultCardContent;
      const mockCard = {} as PdfCardComponent;
      const mockLayouts = [{} as TwoColumnPageLayout];

      (
        GreaseResultCardContent as jest.MockedClass<
          typeof GreaseResultCardContent
        >
      ).mockImplementation(() => mockCardContent);
      mockComponentFactory.createSingleComponentCard.mockReturnValue(mockCard);
      mockLayoutService.createTwoColumnLayouts.mockReturnValue(mockLayouts);

      const result = service.generateResultsSection(singleResult);

      expect(GreaseResultCardContent).toHaveBeenCalledTimes(1);
      expect(
        mockComponentFactory.createSingleComponentCard
      ).toHaveBeenCalledTimes(1);
      expect(mockLayoutService.createTwoColumnLayouts).toHaveBeenCalledWith([
        mockCard,
      ]);
      expect(result).toHaveLength(2); // heading + 1 layout
      expect(result[0]).toBeInstanceOf(SectionHeading);
      expect(result[1]).toBe(mockLayouts[0]);
    });
  });

  describe('getSubheadingText', () => {
    it('should return resultsWithRecommendation when results have recommended values', () => {
      const resultsWithRecommended = [createMockResult({ recommended: 'Yes' })];

      const result = (service as any).getSubheadingText(resultsWithRecommended);

      expect(mockTranslocoService.translate).toHaveBeenCalledWith(
        'calculationResult.resultsWithRecommendation'
      );
      expect(result).toBe('calculationResult.resultsWithRecommendation');
    });

    it('should return resultsWithPreferred when results have miscible values but no recommended', () => {
      const resultsWithMiscible = [createMockResult({ miscible: 'Yes' })];

      const result = (service as any).getSubheadingText(resultsWithMiscible);

      expect(mockTranslocoService.translate).toHaveBeenCalledWith(
        'calculationResult.resultsWithPreferred'
      );
      expect(result).toBe('calculationResult.resultsWithPreferred');
    });

    it('should return resultsWithPreferred when results have preferred values but no recommended', () => {
      const resultsWithPreferred = [createMockResult({ preferred: 'Yes' })];

      const result = (service as any).getSubheadingText(resultsWithPreferred);

      expect(mockTranslocoService.translate).toHaveBeenCalledWith(
        'calculationResult.resultsWithPreferred'
      );
      expect(result).toBe('calculationResult.resultsWithPreferred');
    });

    it('should return resultsDefault when results have no recommended, miscible, or preferred values', () => {
      const resultsDefault = [createMockResult()];

      const result = (service as any).getSubheadingText(resultsDefault);

      expect(mockTranslocoService.translate).toHaveBeenCalledWith(
        'calculationResult.resultsDefault'
      );
      expect(result).toBe('calculationResult.resultsDefault');
    });

    it('should prioritize recommended over miscible and preferred', () => {
      const resultsWithAll = [
        createMockResult({
          recommended: 'Yes',
          miscible: 'Yes',
          preferred: 'Yes',
        }),
      ];

      const result = (service as any).getSubheadingText(resultsWithAll);

      expect(mockTranslocoService.translate).toHaveBeenCalledWith(
        'calculationResult.resultsWithRecommendation'
      );
      expect(result).toBe('calculationResult.resultsWithRecommendation');
    });
  });

  describe('hasRecommendedValue', () => {
    it('should return true when at least one result has recommended value', () => {
      const resultsWithRecommended = [
        createMockResult(),
        createMockResult({ recommended: 'Yes' }),
      ];

      const result = (service as any).hasRecommendedValue(
        resultsWithRecommended
      );
      expect(result).toBe(true);
    });

    it('should return false when no results have recommended value', () => {
      const resultsWithoutRecommended = [createMockResult()];

      const result = (service as any).hasRecommendedValue(
        resultsWithoutRecommended
      );
      expect(result).toBe(false);
    });
  });

  describe('hasMiscibleOrPreferredValue', () => {
    it('should return true when at least one result has miscible value', () => {
      const resultsWithMiscible = [createMockResult({ miscible: 'Yes' })];

      const result = (service as any).hasMiscibleOrPreferredValue(
        resultsWithMiscible
      );
      expect(result).toBe(true);
    });

    it('should return true when at least one result has preferred value', () => {
      const resultsWithPreferred = [createMockResult({ preferred: 'Yes' })];

      const result = (service as any).hasMiscibleOrPreferredValue(
        resultsWithPreferred
      );
      expect(result).toBe(true);
    });

    it('should return false when no results have miscible or preferred values', () => {
      const resultsWithoutMiscibleOrPreferred = [createMockResult()];

      const result = (service as any).hasMiscibleOrPreferredValue(
        resultsWithoutMiscibleOrPreferred
      );
      expect(result).toBe(false);
    });
  });

  describe('createCard', () => {
    it('should create a single component card with correct options', () => {
      const mockContent = {} as Component;
      const mockCard = {} as PdfCardComponent;

      mockComponentFactory.createSingleComponentCard.mockReturnValue(mockCard);

      const result = (service as any).createCard(mockContent);

      expect(
        mockComponentFactory.createSingleComponentCard
      ).toHaveBeenCalledWith(mockContent, {
        keepTogether: false,
        padding: 2,
      });
      expect(result).toBe(mockCard);
    });
  });
});
