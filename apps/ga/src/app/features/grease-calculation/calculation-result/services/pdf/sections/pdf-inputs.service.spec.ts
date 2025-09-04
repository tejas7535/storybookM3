import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  Component,
  PdfComponentFactory,
  PdfLayoutService,
  PdfTableFactory,
} from '@schaeffler/pdf-generator';

import {
  GreasePdfInput,
  GreasePdfInputTable,
  GreasePdfReportModel,
} from '../../../models';
import { GreaseReportDataGeneratorService } from '../../grease-report-data-generator.service';
import { PdfInputsService } from './pdf-inputs.service';

describe('PdfInputsService', () => {
  let spectator: SpectatorService<PdfInputsService>;
  let service: PdfInputsService;
  let mockComponentFactory: jest.Mocked<PdfComponentFactory>;
  let mockTableFactory: jest.Mocked<PdfTableFactory>;
  let mockLayoutService: jest.Mocked<PdfLayoutService>;
  let mockDataGeneratorService: jest.Mocked<GreaseReportDataGeneratorService>;

  const mockReport: GreasePdfReportModel = {
    reportTitle: 'Test Report',
    sectionSubTitle: 'Test Subtitle',
    data: [],
    results: [],
    legalNote: 'Test Legal Note',
    versions: '1.0.0',
  };

  const mockInputTables: GreasePdfInputTable[] = [
    {
      title: 'Bearing data',
      items: [
        ['Designation', '6220'],
        ['Design', 'Radial deep groove ball bearing'],
      ],
    },
    {
      title: 'Operating conditions',
      items: [
        ['Speed', '1000 rpm'],
        ['Temperature', '80°C'],
      ],
    },
  ];

  const mockPdfInput: GreasePdfInput = {
    sectionTitle: 'calculationResult.reportSectionInput',
    tableItems: mockInputTables,
  };

  const createService = createServiceFactory({
    service: PdfInputsService,
    mocks: [
      PdfComponentFactory,
      PdfTableFactory,
      PdfLayoutService,
      GreaseReportDataGeneratorService,
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockComponentFactory = spectator.inject(
      PdfComponentFactory
    ) as jest.Mocked<PdfComponentFactory>;
    mockTableFactory = spectator.inject(
      PdfTableFactory
    ) as jest.Mocked<PdfTableFactory>;
    mockLayoutService = spectator.inject(
      PdfLayoutService
    ) as jest.Mocked<PdfLayoutService>;
    mockDataGeneratorService = spectator.inject(
      GreaseReportDataGeneratorService
    ) as jest.Mocked<GreaseReportDataGeneratorService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getInputsSection', () => {
    it('should create a section heading and layouts with input tables', () => {
      const mockHeading = {} as Component;
      const mockTableComponent = {} as any; // TableWithHeader mock
      const mockLayout = {} as any; // TwoColumnPageLayout mock

      mockDataGeneratorService.prepareReportInputData.mockReturnValue(
        mockPdfInput
      );
      mockComponentFactory.createSectionHeading.mockReturnValue(mockHeading);
      mockTableFactory.createCompleteTable.mockReturnValue(mockTableComponent);
      mockLayoutService.createTwoColumnLayouts.mockReturnValue([mockLayout]);

      const result = service.getInputsSection(mockReport);

      expect(
        mockDataGeneratorService.prepareReportInputData
      ).toHaveBeenCalledWith(mockReport.data);
      expect(mockComponentFactory.createSectionHeading).toHaveBeenCalledWith(
        mockPdfInput.sectionTitle
      );
      expect(mockTableFactory.createCompleteTable).toHaveBeenCalledTimes(2);
      expect(mockTableFactory.createCompleteTable).toHaveBeenNthCalledWith(
        1,
        mockInputTables[0].items,
        mockInputTables[0].title
      );
      expect(mockTableFactory.createCompleteTable).toHaveBeenNthCalledWith(
        2,
        mockInputTables[1].items,
        mockInputTables[1].title
      );
      expect(mockLayoutService.createTwoColumnLayouts).toHaveBeenCalledWith([
        mockTableComponent,
        mockTableComponent,
      ]);
      expect(result).toEqual([mockHeading, mockLayout]);
    });

    it('should return an empty array when there are no table items', () => {
      const emptyPdfInput: GreasePdfInput = {
        sectionTitle: 'calculationResult.reportSectionInput',
        tableItems: [],
      };

      mockDataGeneratorService.prepareReportInputData.mockReturnValue(
        emptyPdfInput
      );

      const result = service.getInputsSection(mockReport);

      expect(
        mockDataGeneratorService.prepareReportInputData
      ).toHaveBeenCalledWith(mockReport.data);
      expect(mockComponentFactory.createSectionHeading).not.toHaveBeenCalled();
      expect(mockTableFactory.createCompleteTable).not.toHaveBeenCalled();
      expect(mockLayoutService.createTwoColumnLayouts).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should filter out tables with empty items', () => {
      const mixedInputTables: GreasePdfInputTable[] = [
        {
          title: 'Valid Table',
          items: [['Key', 'Value']],
        },
        {
          title: 'Empty Table',
          items: [],
        },
        {
          title: 'Another Valid Table',
          items: [['Key2', 'Value2']],
        },
      ];

      const pdfInputWithEmptyTables: GreasePdfInput = {
        sectionTitle: 'calculationResult.reportSectionInput',
        tableItems: mixedInputTables,
      };

      const mockHeading = {} as Component;
      const mockTableComponent = {} as any; // TableWithHeader mock
      const mockLayout = {} as any; // TwoColumnPageLayout mock

      mockDataGeneratorService.prepareReportInputData.mockReturnValue(
        pdfInputWithEmptyTables
      );
      mockComponentFactory.createSectionHeading.mockReturnValue(mockHeading);
      mockTableFactory.createCompleteTable.mockReturnValue(mockTableComponent);
      mockLayoutService.createTwoColumnLayouts.mockReturnValue([mockLayout]);

      const result = service.getInputsSection(mockReport);

      expect(mockTableFactory.createCompleteTable).toHaveBeenCalledTimes(2);
      expect(mockTableFactory.createCompleteTable).toHaveBeenNthCalledWith(
        1,
        mixedInputTables[0].items,
        mixedInputTables[0].title
      );
      expect(mockTableFactory.createCompleteTable).toHaveBeenNthCalledWith(
        2,
        mixedInputTables[2].items,
        mixedInputTables[2].title
      );
      expect(result).toEqual([mockHeading, mockLayout]);
    });

    it('should handle undefined items in table data', () => {
      const tableWithUndefinedItems: GreasePdfInputTable[] = [
        {
          title: 'Valid Table',
          items: [['Key', 'Value']],
        },
        {
          title: 'Table with undefined items',
          items: undefined as any,
        },
      ];

      const pdfInputWithUndefinedItems: GreasePdfInput = {
        sectionTitle: 'calculationResult.reportSectionInput',
        tableItems: tableWithUndefinedItems,
      };

      const mockHeading = {} as Component;
      const mockTableComponent = {} as any; // TableWithHeader mock
      const mockLayout = {} as any; // TwoColumnPageLayout mock

      mockDataGeneratorService.prepareReportInputData.mockReturnValue(
        pdfInputWithUndefinedItems
      );
      mockComponentFactory.createSectionHeading.mockReturnValue(mockHeading);
      mockTableFactory.createCompleteTable.mockReturnValue(mockTableComponent);
      mockLayoutService.createTwoColumnLayouts.mockReturnValue([mockLayout]);

      const result = service.getInputsSection(mockReport);

      expect(mockTableFactory.createCompleteTable).toHaveBeenCalledTimes(1);
      expect(mockTableFactory.createCompleteTable).toHaveBeenCalledWith(
        tableWithUndefinedItems[0].items,
        tableWithUndefinedItems[0].title
      );
      expect(result).toEqual([mockHeading, mockLayout]);
    });
  });

  describe('createInputTableComponents', () => {
    it('should create table components for valid tables', () => {
      const mockTableComponent = {} as any; // TableWithHeader mock
      mockTableFactory.createCompleteTable.mockReturnValue(mockTableComponent);

      const result = (service as any).createInputTableComponents(
        mockInputTables
      );

      expect(mockTableFactory.createCompleteTable).toHaveBeenCalledTimes(2);
      expect(result).toEqual([mockTableComponent, mockTableComponent]);
    });

    it('should return empty array when input tables are empty', () => {
      const result = (service as any).createInputTableComponents([]);

      expect(mockTableFactory.createCompleteTable).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should filter out tables without items', () => {
      const tablesWithEmptyItems: GreasePdfInputTable[] = [
        {
          title: 'Valid Table',
          items: [['Key', 'Value']],
        },
        {
          title: 'Empty Table',
          items: [],
        },
      ];

      const mockTableComponent = {} as any; // TableWithHeader mock
      mockTableFactory.createCompleteTable.mockReturnValue(mockTableComponent);

      const result = (service as any).createInputTableComponents(
        tablesWithEmptyItems
      );

      expect(mockTableFactory.createCompleteTable).toHaveBeenCalledTimes(1);
      expect(mockTableFactory.createCompleteTable).toHaveBeenCalledWith(
        tablesWithEmptyItems[0].items,
        tablesWithEmptyItems[0].title
      );
      expect(result).toEqual([mockTableComponent]);
    });
  });
});
