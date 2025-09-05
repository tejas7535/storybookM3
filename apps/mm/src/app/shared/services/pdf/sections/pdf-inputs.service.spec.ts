import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  Component,
  PdfComponentFactory,
  PdfLayoutService,
  PdfTableFactory,
  TableWithHeader,
  TwoColumnPageLayout,
} from '@schaeffler/pdf-generator';

import { ResultDataService } from '../../result-data.service';
import { PdfInputsService } from './pdf-inputs.service';

describe('PdfInputsService', () => {
  let spectator: SpectatorService<PdfInputsService>;
  let service: PdfInputsService;
  let mockComponentFactory: jest.Mocked<PdfComponentFactory>;
  let mockTableFactory: jest.Mocked<PdfTableFactory>;
  let mockLayoutService: jest.Mocked<PdfLayoutService>;

  const createService = createServiceFactory({
    service: PdfInputsService,
    providers: [
      {
        provide: TranslocoService,
        useValue: {
          translate: jest.fn((key: string) => key),
        },
      },
    ],
    mocks: [
      PdfComponentFactory,
      PdfTableFactory,
      PdfLayoutService,
      ResultDataService,
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
  });

  describe('getInputsSection', () => {
    it('should create a section heading and a two-column layout with input tables', () => {
      const mockHeading = {} as Component;
      const mockLayout = {} as TwoColumnPageLayout;
      const mockTableComponents = [{}] as TableWithHeader[];

      mockComponentFactory.createSectionHeading.mockReturnValue(mockHeading);
      jest
        .spyOn(service as any, 'createInputTableComponents')
        .mockReturnValue(mockTableComponents);
      mockLayoutService.createTwoColumnLayouts.mockReturnValue([mockLayout]);

      const result = service.getInputsSection();

      expect(mockComponentFactory.createSectionHeading).toHaveBeenCalledWith(
        'pdf.inputsTitle'
      );
      expect(mockLayoutService.createTwoColumnLayouts).toHaveBeenCalledWith(
        mockTableComponents
      );
      expect(result).toEqual([mockHeading, mockLayout]);
    });

    it('should return an empty array when there are no input tables', () => {
      jest
        .spyOn(service as any, 'createInputTableComponents')
        .mockReturnValue([]);

      const result = service.getInputsSection();

      expect(result).toEqual([]);
    });
  });

  describe('createInputTableComponents', () => {
    it('should create table components for input tables with data', () => {
      const mockInputTables = [
        { title: 'Table 1', data: [['A', 'B']] },
        { title: 'Table 2', data: [['C', 'D']] },
      ];
      const mockTableComponents = [{}] as TableWithHeader[];

      const mockInputTablesFunc = jest.fn().mockReturnValue(mockInputTables);
      Object.defineProperty(service, 'inputTables', {
        get: () => mockInputTablesFunc,
      });
      mockTableFactory.createCompleteTable
        .mockReturnValueOnce(mockTableComponents[0])
        .mockReturnValueOnce(mockTableComponents[1]);

      const result = (service as any).createInputTableComponents();

      expect(mockTableFactory.createCompleteTable).toHaveBeenCalledWith(
        mockInputTables[0].data,
        mockInputTables[0].title
      );
      expect(mockTableFactory.createCompleteTable).toHaveBeenCalledWith(
        mockInputTables[1].data,
        mockInputTables[1].title
      );
      expect(result).toEqual(mockTableComponents);
    });
  });
});
