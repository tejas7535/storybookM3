import { TranslocoService } from '@jsverse/transloco';
import { PdfCardComponent } from '@mm/shared/components/pdf/pdf-card/pdf-card';
import { ListStyle } from '@mm/shared/components/pdf/string-list/string-list';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { Component } from '@schaeffler/pdf-generator';

import { ResultDataService } from '../../result-data.service';
import { PdfComponentFactory } from '../factories/pdf-component-factory.service';
import { PdfRecommendationService } from './pdf-recommendation.service';

describe('PdfRecommendationService', () => {
  let spectator: SpectatorService<PdfRecommendationService>;
  let service: PdfRecommendationService;

  const mockRecommendations = ['Recommendation 1', 'Recommendation 2'];
  const mockMessages = ['Message 1', 'Message 2', 'Message 3'];

  const createService = createServiceFactory({
    service: PdfRecommendationService,
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
          mountingRecommendations: jest.fn(() => mockRecommendations),
          messages: jest.fn(() => mockMessages),
        },
      },
    ],
    mocks: [PdfComponentFactory],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getInstructionsHeading', () => {
    it('should create a section heading with the correct title', () => {
      const mockHeading = {} as Component;
      const mockComponentFactory = spectator.inject(PdfComponentFactory);
      mockComponentFactory.createSectionHeading.mockReturnValue(mockHeading);

      const result = service.getInstructionsHeading();

      expect(mockComponentFactory.createSectionHeading).toHaveBeenCalledWith(
        'reportResult.mountingInstructions'
      );
      expect(result).toEqual([mockHeading]);
    });
  });
  describe('getMountingRecommendationSection', () => {
    it('should create a card with a list of mounting recommendations', () => {
      const mockCard = {} as PdfCardComponent;
      const mockList = {} as Component;
      const mockDataService = spectator.inject(ResultDataService);
      const mockComponentFactory = spectator.inject(PdfComponentFactory);

      mockComponentFactory.createStringList.mockReturnValue(mockList);
      mockComponentFactory.createCard.mockReturnValue(mockCard);

      const result = service.getMountingRecommendationSection();

      expect(mockDataService.mountingRecommendations).toHaveBeenCalled();
      expect(mockComponentFactory.createStringList).toHaveBeenCalledWith(
        mockRecommendations,
        ListStyle.NUMBERED
      );
      expect(mockComponentFactory.createCard).toHaveBeenCalledWith([mockList]);
      expect(result).toEqual([mockCard]);
    });

    it('should handle empty recommendations', () => {
      const mockCard = {} as PdfCardComponent;
      const mockList = {} as Component;
      const mockDataService = spectator.inject(ResultDataService);
      const mockComponentFactory = spectator.inject(PdfComponentFactory);

      mockDataService.mountingRecommendations.mockReturnValue([]);
      mockComponentFactory.createStringList.mockReturnValue(mockList);
      mockComponentFactory.createCard.mockReturnValue(mockCard);

      const result = service.getMountingRecommendationSection();

      expect(mockComponentFactory.createStringList).toHaveBeenCalledWith(
        [],
        ListStyle.NUMBERED
      );
      expect(result).toEqual([mockCard]);
    });
  });

  describe('getReportMessagesHeading', () => {
    it('should create a section heading with the correct title', () => {
      const mockHeading = {} as Component;
      const mockComponentFactory = spectator.inject(PdfComponentFactory);
      mockComponentFactory.createSectionHeading.mockReturnValue(mockHeading);

      const result = service.getReportMessagesHeading();

      expect(mockComponentFactory.createSectionHeading).toHaveBeenCalledWith(
        'reportResult.reportSelection.reportMessages'
      );
      expect(result).toEqual([mockHeading]);
    });
  });

  describe('getReportMessagesSection', () => {
    it('should create a card with a list of report messages', () => {
      const mockCard = {} as PdfCardComponent;
      const mockList = {} as Component;
      const mockDataService = spectator.inject(ResultDataService);
      const mockComponentFactory = spectator.inject(PdfComponentFactory);

      mockComponentFactory.createStringList.mockReturnValue(mockList);
      mockComponentFactory.createCard.mockReturnValue(mockCard);

      const result = service.getReportMessagesSection();

      expect(mockDataService.messages).toHaveBeenCalled();
      expect(mockComponentFactory.createStringList).toHaveBeenCalledWith(
        mockMessages,
        ListStyle.NONE
      );
      expect(mockComponentFactory.createCard).toHaveBeenCalledWith([mockList]);
      expect(result).toEqual([mockCard]);
    });

    it('should handle empty messages', () => {
      const mockCard = {} as PdfCardComponent;
      const mockList = {} as Component;
      const mockDataService = spectator.inject(ResultDataService);
      const mockComponentFactory = spectator.inject(PdfComponentFactory);

      mockDataService.messages.mockReturnValue([]);
      mockComponentFactory.createStringList.mockReturnValue(mockList);
      mockComponentFactory.createCard.mockReturnValue(mockCard);

      const result = service.getReportMessagesSection();

      expect(mockComponentFactory.createStringList).toHaveBeenCalledWith(
        [],
        ListStyle.NONE
      );
      expect(result).toEqual([mockCard]);
    });
  });
});
