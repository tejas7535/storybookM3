import { TranslocoService } from '@jsverse/transloco';
import { ListStyle } from '@mm/shared/components/pdf/string-list/string-list';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  Component,
  PdfCardComponent,
  PdfComponentFactory,
} from '@schaeffler/pdf-generator';

import { ResultDataService } from '../../result-data.service';
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

    const mockDataService = spectator.inject(ResultDataService);
    mockDataService.mountingRecommendations.mockReturnValue(
      mockRecommendations
    );
    mockDataService.messages.mockReturnValue(mockMessages);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMountingRecommendationSection', () => {
    it('should create a heading and card with a list of mounting recommendations', () => {
      const mockCard = {} as PdfCardComponent;
      const mockList = {} as Component;
      const mockHeading = {} as Component;
      const mockDataService = spectator.inject(ResultDataService);
      const mockComponentFactory = spectator.inject(PdfComponentFactory);

      mockComponentFactory.createStringList.mockReturnValue(mockList);
      mockComponentFactory.createCard.mockReturnValue(mockCard);
      mockComponentFactory.createSectionHeading.mockReturnValue(mockHeading);

      const result = service.getMountingRecommendationSection();

      expect(mockDataService.mountingRecommendations).toHaveBeenCalled();
      expect(mockComponentFactory.createSectionHeading).toHaveBeenCalledWith(
        'reportResult.mountingInstructions'
      );
      expect(mockComponentFactory.createStringList).toHaveBeenCalledWith(
        mockRecommendations,
        ListStyle.NUMBERED
      );
      expect(mockComponentFactory.createCard).toHaveBeenCalledWith([mockList]);
      expect(result).toEqual([mockHeading, mockCard]);
    });

    it('should return empty array when there are no recommendations', () => {
      const mockDataService = spectator.inject(ResultDataService);
      const mockComponentFactory = spectator.inject(PdfComponentFactory);

      mockDataService.mountingRecommendations.mockReturnValue([]);

      const result = service.getMountingRecommendationSection();

      expect(mockComponentFactory.createSectionHeading).not.toHaveBeenCalled();
      expect(mockComponentFactory.createStringList).not.toHaveBeenCalled();
      expect(mockComponentFactory.createCard).not.toHaveBeenCalled();
      expect(result).toEqual([]);
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
