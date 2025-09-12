import { TranslocoService } from '@jsverse/transloco';
import { ResultItem } from '@mm/core/store/models/calculation-result-state.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  Component,
  PdfCardComponent,
  PdfComponentFactory,
  PdfLayoutService,
  PdfTableFactory,
  TableWithHeader,
  TwoColumnPageLayout,
} from '@schaeffler/pdf-generator';

import { ResultDataService } from '../../result-data.service';
import { PdfCardFactory } from '../factories/pdf-card-factory.service';
import { PdfResultsService } from './pdf-results.service';

describe('PdfResultsService', () => {
  let spectator: SpectatorService<PdfResultsService>;
  let service: PdfResultsService;

  const mockResultItems: ResultItem[] = [
    { designation: 'Item 1', value: '10', unit: 'mm' },
    { designation: 'Item 2', value: '20', unit: 'mm' },
  ];

  const createService = createServiceFactory({
    service: PdfResultsService,
    providers: [
      {
        provide: TranslocoService,
        useValue: {
          translate: jest.fn((key: string) => key),
        },
      },
      {
        provide: ResultDataService,
        useValue: {
          radialClearance: jest.fn(() => mockResultItems),
          clearanceClasses: jest.fn(() => mockResultItems),
          startPositions: jest.fn(() => mockResultItems),
          endPositions: jest.fn(() => mockResultItems),
          temperatures: jest.fn(() => mockResultItems),
        },
      },
    ],
    mocks: [
      PdfComponentFactory,
      PdfTableFactory,
      PdfLayoutService,
      PdfCardFactory,
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getHeading', () => {
    it('should create a section heading with the correct title', () => {
      const mockHeading = {} as Component;
      const mockComponentFactory = spectator.inject(PdfComponentFactory);
      mockComponentFactory.createSectionHeading.mockReturnValue(mockHeading);

      const result = service.getHeading();

      expect(mockComponentFactory.createSectionHeading).toHaveBeenCalledWith(
        'pdf.resultsTitle'
      );
      expect(result).toEqual([mockHeading]);
    });
  });

  describe('getRadialClearanceSection', () => {
    it('should create a two-column layout with the correct data', () => {
      const mockLayout = {} as unknown as TwoColumnPageLayout;
      const mockTableComponent = {} as unknown as TableWithHeader;
      const mockDataService = spectator.inject(ResultDataService);

      const mockTableFactory = spectator.inject(PdfTableFactory);
      mockTableFactory.createCompleteTable.mockReturnValue(mockTableComponent);

      const mockLayoutService = spectator.inject(PdfLayoutService);
      mockLayoutService.createTwoColumnLayoutsWithComponents.mockReturnValue([
        mockLayout,
      ]);

      const result = service.getRadialClearanceSection();

      expect(mockDataService.radialClearance).toHaveBeenCalled();
      expect(mockDataService.clearanceClasses).toHaveBeenCalled();
      expect(
        mockLayoutService.createTwoColumnLayoutsWithComponents
      ).toHaveBeenCalled();
      expect(result).toEqual([mockLayout]);
    });
  });

  describe('getStartEndPositionsSection', () => {
    it('should create a two-column layout with the correct data', () => {
      const mockLayout = {} as unknown as TwoColumnPageLayout;
      const mockTableComponent = {} as unknown as TableWithHeader;

      const mockTableFactory = spectator.inject(PdfTableFactory);
      mockTableFactory.createCompleteTable.mockReturnValue(mockTableComponent);

      const mockLayoutService = spectator.inject(PdfLayoutService);
      mockLayoutService.createTwoColumnLayoutsWithComponents.mockReturnValue([
        mockLayout,
      ]);

      const result = service.getStartEndPositionsSection();

      expect(
        mockLayoutService.createTwoColumnLayoutsWithComponents
      ).toHaveBeenCalled();
      expect(result).toEqual([mockLayout]);
    });
  });

  describe('getTemperaturesSection', () => {
    it('should create a temperature card when temperatures exist', () => {
      const mockHeading = {} as unknown as Component;
      const mockCard = {} as unknown as PdfCardComponent;
      const mockComponentFactory = spectator.inject(PdfComponentFactory);
      const mockCardFactory = spectator.inject(PdfCardFactory);
      const mockDataService = spectator.inject(ResultDataService);
      const mockTranslocoService = spectator.inject(TranslocoService);

      mockComponentFactory.createSectionSubHeading.mockReturnValue(mockHeading);
      mockCardFactory.createTemperatureCard.mockReturnValue(mockCard);
      mockTranslocoService.translate.mockReturnValue(
        'reportResult.temperatures'
      );

      const result = service.getTemperaturesSection();

      expect(mockDataService.temperatures).toHaveBeenCalled();
      expect(mockTranslocoService.translate).toHaveBeenCalledWith(
        'reportResult.temperatures'
      );
      expect(mockComponentFactory.createSectionSubHeading).toHaveBeenCalledWith(
        'reportResult.temperatures'
      );
      expect(mockCardFactory.createTemperatureCard).toHaveBeenCalledWith(
        mockResultItems
      );
      expect(result).toEqual([mockHeading, mockCard]);
    });

    it('should return empty array when there are no temperatures', () => {
      const mockDataService = spectator.inject(ResultDataService);
      mockDataService.temperatures.mockReturnValue([]);

      const result = service.getTemperaturesSection();

      expect(result).toEqual([]);
    });
  });

  describe('createResultTable', () => {
    it('should return empty array when items are empty', () => {
      const result = (service as any).createResultTable([], 'Title');
      expect(result).toEqual([]);
    });

    it('should return empty array when items are null or undefined', () => {
      const result = (service as any).createResultTable(undefined, 'Title');
      expect(result).toEqual([]);
    });

    it('should create table with data', () => {
      const mockTableComponent = {} as unknown as TableWithHeader;
      const mockTableFactory = spectator.inject(PdfTableFactory);
      mockTableFactory.createCompleteTable.mockReturnValue(mockTableComponent);

      const result = (service as any).createResultTable(
        mockResultItems,
        'Test Title'
      );

      expect(mockTableFactory.createCompleteTable).toHaveBeenCalled();
      expect(result).toEqual([mockTableComponent]);
    });
  });

  describe('formatResultItemData', () => {
    it('should format result items correctly', () => {
      const items: ResultItem[] = [
        { designation: 'Item 1', value: '10', unit: 'mm' },
        { designation: 'Item 2', value: '20', unit: '' },
        { designation: '', value: '30', unit: 'cm' },
      ];

      const result = (service as any).formatResultItemData(items);

      expect(result).toEqual([
        ['Item 1', '10 mm'],
        ['Item 2', '20'],
        ['', '30 cm'],
      ]);
    });
  });

  describe('createTwoColumnSection', () => {
    it('should return empty array when both tables are empty', () => {
      jest.spyOn(service as any, 'createResultTable').mockReturnValue([]);

      const result = (service as any).createTwoColumnSection(
        (): ResultItem[] => [],
        'leftTitle',
        (): ResultItem[] => [],
        'rightTitle'
      );

      expect(result).toEqual([]);
      expect(
        spectator.inject(PdfLayoutService).createTwoColumnLayoutsWithComponents
      ).not.toHaveBeenCalled();
    });

    it('should use layouts when at least one table has data', () => {
      const mockTableComponent = {} as unknown as TableWithHeader;
      const mockLayout = {} as unknown as TwoColumnPageLayout;

      jest
        .spyOn(service as any, 'createResultTable')
        .mockImplementation((items) => (items ? [mockTableComponent] : []));

      const mockLayoutService = spectator.inject(PdfLayoutService);
      mockLayoutService.createTwoColumnLayoutsWithComponents.mockReturnValue([
        mockLayout,
      ]);

      const result = (service as any).createTwoColumnSection(
        (): ResultItem[] => [
          { designation: 'test', value: 'value', unit: 'mm' },
        ],
        'leftTitle',
        (): ResultItem[] => [],
        'rightTitle'
      );

      expect(
        mockLayoutService.createTwoColumnLayoutsWithComponents
      ).toHaveBeenCalled();
      expect(result).toEqual([mockLayout]);
    });
  });
});
