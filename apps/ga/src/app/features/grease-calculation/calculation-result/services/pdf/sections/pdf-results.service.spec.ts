import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  Colors,
  Component,
  PdfCardComponent,
  PdfComponentFactory,
  PdfLayoutService,
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

  const mockResults: PDFGreaseReportResult[] = [
    {
      sections: [],
      isSufficient: true,
      mainTitle: 'Test Grease 1',
      subTitle: 'Test Subtitle 1',
      qrCode: 'test-qr-code-1',
      recommended: 'Yes',
      miscible: 'No',
    },
    {
      sections: [],
      isSufficient: false,
      mainTitle: 'Test Grease 2',
      subTitle: 'Test Subtitle 2',
      qrCode: 'test-qr-code-2',
    },
  ];

  const createService = createServiceFactory({
    service: PdfResultsService,
    mocks: [PdfLayoutService, PdfComponentFactory],
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
    it('should generate result sections with cards and layouts', () => {
      const mockCardContent = {} as GreaseResultCardContent;
      const mockCard = {} as PdfCardComponent;
      const mockLayouts = [] as TwoColumnPageLayout[];

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
      expect(result).toBe(mockLayouts);
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
      expect(result).toBe(mockLayouts);
    });

    it('should handle single result', () => {
      const singleResult = [mockResults[0]];
      const mockCardContent = {} as GreaseResultCardContent;
      const mockCard = {} as PdfCardComponent;
      const mockLayouts = [] as TwoColumnPageLayout[];

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
      expect(result).toBe(mockLayouts);
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
