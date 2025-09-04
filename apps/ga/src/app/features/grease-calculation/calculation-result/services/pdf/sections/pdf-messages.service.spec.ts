import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  Component,
  ListStyle,
  PdfCardComponent,
  PdfComponentFactory,
} from '@schaeffler/pdf-generator';

import {
  GreasePdfMessage,
  GreasePdfMessageItem,
  GreasePdfReportModel,
} from '../../../models';
import { GreaseReportDataGeneratorService } from '../../grease-report-data-generator.service';
import { PdfMessagesService } from './pdf-messages.service';

describe('PdfMessagesService', () => {
  let spectator: SpectatorService<PdfMessagesService>;
  let service: PdfMessagesService;
  let mockComponentFactory: jest.Mocked<PdfComponentFactory>;
  let mockDataGeneratorService: jest.Mocked<GreaseReportDataGeneratorService>;

  const mockReport: GreasePdfReportModel = {
    reportTitle: 'Test Report',
    sectionSubTitle: 'Test Subtitle',
    data: [],
    results: [],
    legalNote: 'Test Legal Note',
    versions: '1.0.0',
  };

  const mockMessageItems: GreasePdfMessageItem[] = [
    {
      title: 'Warnings',
      items: ['Warning 1', 'Warning 2'],
    },
    {
      title: 'Errors',
      items: ['Error 1'],
    },
  ];

  const mockPdfMessage: GreasePdfMessage = {
    sectionTitle: 'Messages and Warnings',
    messageItems: mockMessageItems,
  };

  const createService = createServiceFactory({
    service: PdfMessagesService,
    mocks: [PdfComponentFactory, GreaseReportDataGeneratorService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockComponentFactory = spectator.inject(
      PdfComponentFactory
    ) as jest.Mocked<PdfComponentFactory>;
    mockDataGeneratorService = spectator.inject(
      GreaseReportDataGeneratorService
    ) as jest.Mocked<GreaseReportDataGeneratorService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMessagesSection', () => {
    it('should create a section heading and message card when messages exist', () => {
      const mockHeading = {} as Component;
      const mockStringList = {} as Component;
      const mockCard = {} as PdfCardComponent;

      mockDataGeneratorService.prepareReportErrorsAndWarningsData.mockReturnValue(
        mockPdfMessage
      );
      mockComponentFactory.createSectionHeading.mockReturnValue(mockHeading);
      mockComponentFactory.createStringList.mockReturnValue(mockStringList);
      mockComponentFactory.createCard.mockReturnValue(mockCard);

      const result = service.getMessagesSection(mockReport);

      expect(
        mockDataGeneratorService.prepareReportErrorsAndWarningsData
      ).toHaveBeenCalledWith(mockReport.data);
      expect(mockComponentFactory.createSectionHeading).toHaveBeenCalledWith(
        mockPdfMessage.sectionTitle
      );
      expect(mockComponentFactory.createStringList).toHaveBeenCalledWith(
        ['Warning 1', 'Warning 2', 'Error 1', '1.0.0'],
        ListStyle.NONE
      );
      expect(mockComponentFactory.createCard).toHaveBeenCalledWith([
        mockStringList,
      ]);
      expect(result).toEqual([mockHeading, mockCard]);
    });

    it('should return empty array when no message items exist', () => {
      const emptyPdfMessage: GreasePdfMessage = {
        sectionTitle: 'Messages and Warnings',
        messageItems: [],
      };

      mockDataGeneratorService.prepareReportErrorsAndWarningsData.mockReturnValue(
        emptyPdfMessage
      );

      const result = service.getMessagesSection(mockReport);

      expect(
        mockDataGeneratorService.prepareReportErrorsAndWarningsData
      ).toHaveBeenCalledWith(mockReport.data);
      expect(mockComponentFactory.createSectionHeading).not.toHaveBeenCalled();
      expect(mockComponentFactory.createStringList).not.toHaveBeenCalled();
      expect(mockComponentFactory.createCard).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle empty items arrays in message items', () => {
      const messageWithEmptyItems: GreasePdfMessage = {
        sectionTitle: 'Messages and Warnings',
        messageItems: [
          {
            title: 'Empty Warnings',
            items: [],
          },
          {
            title: 'Valid Errors',
            items: ['Error 1'],
          },
        ],
      };

      const mockHeading = {} as Component;
      const mockStringList = {} as Component;
      const mockCard = {} as PdfCardComponent;

      mockDataGeneratorService.prepareReportErrorsAndWarningsData.mockReturnValue(
        messageWithEmptyItems
      );
      mockComponentFactory.createSectionHeading.mockReturnValue(mockHeading);
      mockComponentFactory.createStringList.mockReturnValue(mockStringList);
      mockComponentFactory.createCard.mockReturnValue(mockCard);

      const result = service.getMessagesSection(mockReport);

      expect(mockComponentFactory.createStringList).toHaveBeenCalledWith(
        ['Error 1', '1.0.0'],
        ListStyle.NONE
      );
      expect(result).toEqual([mockHeading, mockCard]);
    });

    it('should include versions in the combined list', () => {
      const mockHeading = {} as Component;
      const mockStringList = {} as Component;
      const mockCard = {} as PdfCardComponent;

      mockDataGeneratorService.prepareReportErrorsAndWarningsData.mockReturnValue(
        mockPdfMessage
      );
      mockComponentFactory.createSectionHeading.mockReturnValue(mockHeading);
      mockComponentFactory.createStringList.mockReturnValue(mockStringList);
      mockComponentFactory.createCard.mockReturnValue(mockCard);

      service.getMessagesSection(mockReport);

      expect(mockComponentFactory.createStringList).toHaveBeenCalledWith(
        ['Warning 1', 'Warning 2', 'Error 1', '1.0.0'],
        ListStyle.NONE
      );
    });
  });

  describe('getReportMessagesSection', () => {
    it('should create a card with string list for given messages', () => {
      const messages = ['Message 1', 'Message 2', 'Message 3'];
      const mockStringList = {} as Component;
      const mockCard = {} as PdfCardComponent;

      mockComponentFactory.createStringList.mockReturnValue(mockStringList);
      mockComponentFactory.createCard.mockReturnValue(mockCard);

      const result = service.getReportMessagesSection(messages);

      expect(mockComponentFactory.createStringList).toHaveBeenCalledWith(
        messages,
        ListStyle.NONE
      );
      expect(mockComponentFactory.createCard).toHaveBeenCalledWith([
        mockStringList,
      ]);
      expect(result).toEqual([mockCard]);
    });

    it('should handle empty messages array', () => {
      const messages: string[] = [];
      const mockStringList = {} as Component;
      const mockCard = {} as PdfCardComponent;

      mockComponentFactory.createStringList.mockReturnValue(mockStringList);
      mockComponentFactory.createCard.mockReturnValue(mockCard);

      const result = service.getReportMessagesSection(messages);

      expect(mockComponentFactory.createStringList).toHaveBeenCalledWith(
        messages,
        ListStyle.NONE
      );
      expect(mockComponentFactory.createCard).toHaveBeenCalledWith([
        mockStringList,
      ]);
      expect(result).toEqual([mockCard]);
    });
  });

  describe('createCardWithComponents', () => {
    it('should create a card with provided components', () => {
      const mockComponents = [{} as Component, {} as Component];
      const mockCard = {} as PdfCardComponent;

      mockComponentFactory.createCard.mockReturnValue(mockCard);

      const result = (service as any).createCardWithComponents(mockComponents);

      expect(mockComponentFactory.createCard).toHaveBeenCalledWith(
        mockComponents
      );
      expect(result).toBe(mockCard);
    });
  });
});
