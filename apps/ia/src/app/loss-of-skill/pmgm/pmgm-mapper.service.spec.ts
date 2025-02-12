/* eslint-disable unicorn/no-null */
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { LeavingType } from '../../shared/models';
import {
  PerformanceRating,
  PmgmArrow,
  PmgmAssessment,
  PmgmDataDto,
} from '../models';
import { PmgmMapperService } from './pmgm-mapper.service';

describe('PmgmMapperService', () => {
  let service: PmgmMapperService;
  let spectator: SpectatorService<PmgmMapperService>;

  const createService = createServiceFactory({
    service: PmgmMapperService,
  });

  const pmgmDataDtoMock: PmgmDataDto = {
    employee: 'Herman',
    employeeKey: '1',
    fluctuationType: LeavingType.REMAINING,
    isManager: true,
    prevYearIsManager: false,
    highRiskOfLoss: true,
    prevYearHighRiskOfLoss: false,
    orgUnit: 'SH/ZHZ',
    orgUnitKey: '333444',
    overallPerformanceRating: undefined,
    prevYearOverallPerformanceRating: PerformanceRating.EXCEEDS_EXPECTATIONS,
    personalArea: '123',
  };

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mapPmgmDataDtoToPmgmData', () => {
    test('should map pmgmDataDto to pmgmData', () => {
      const dto: PmgmDataDto[] = [{ ...pmgmDataDtoMock }];
      service.calculateAssessment = jest.fn(() => PmgmAssessment.GREEN);
      service.calculateManagerChange = jest.fn(() => PmgmArrow.UP);
      service.calculateOverallRatingChange = jest.fn(() => PmgmArrow.DOWN);
      service.calculateRiskOfLossChange = jest.fn(() => PmgmArrow.RIGHT);

      const result = service.mapPmgmDataResponseToPmgmData(dto);

      expect(result).toEqual([
        {
          ...pmgmDataDtoMock,
          assessment: PmgmAssessment.GREEN,
          overallPerformanceRatingChange: PmgmArrow.DOWN,
          managerChange: PmgmArrow.UP,
          highRiskOfLossChange: PmgmArrow.RIGHT,
        },
      ]);
      expect(service.calculateAssessment).toHaveBeenCalledWith(dto[0]);
    });
  });

  describe('calculateLossIndicatorChange', () => {
    test('should return NONE when currentHighImpactOfLoss and previousHighImpactOfLoss are null', () => {
      const result = service.calculateRiskOfLossChange(null, null);

      expect(result).toBe(PmgmArrow.NONE);
    });

    test('should return RIGHT when currentHighImpactOfLoss and previousHighImpactOfLoss are equal', () => {
      const result = service.calculateRiskOfLossChange(true, true);

      expect(result).toBe(PmgmArrow.RIGHT);
    });

    test('should return DOWN when currentHighImpactOfLoss is true and previousHighImpactOfLoss is false', () => {
      const result = service.calculateRiskOfLossChange(true, false);

      expect(result).toBe(PmgmArrow.DOWN);
    });

    test('should return UP when currentHighImpactOfLoss is false and previousHighImpactOfLoss is true', () => {
      const result = service.calculateRiskOfLossChange(false, true);

      expect(result).toBe(PmgmArrow.UP);
    });
  });

  describe('calculateManagerChange', () => {
    test('should return RIGHT when currentIsManager and previousIsManager are equal', () => {
      const result = service.calculateManagerChange(true, true);

      expect(result).toBe(PmgmArrow.RIGHT);
    });

    test('should return UP when currentIsManager is true and previousIsManager is false', () => {
      const result = service.calculateManagerChange(true, false);

      expect(result).toBe(PmgmArrow.UP);
    });

    test('should return DOWN when currentIsManager is false and previousIsManager is true', () => {
      const result = service.calculateManagerChange(false, true);

      expect(result).toBe(PmgmArrow.DOWN);
    });
  });

  describe('calculateOverallRatingChange', () => {
    test('should return NONE when currentRating and previousRating are null', () => {
      const result = service.calculateOverallRatingChange(
        PerformanceRating.UNRATED,
        PerformanceRating.UNRATED
      );

      expect(result).toBe(PmgmArrow.NONE);
    });

    test('should return RIGHT when currentRating and previousRating are equal', () => {
      const result = service.calculateOverallRatingChange(
        PerformanceRating.MEETS_EXPECTATIONS,
        PerformanceRating.MEETS_EXPECTATIONS
      );

      expect(result).toBe(PmgmArrow.RIGHT);
    });

    test('should return UP when currentRating is greater than previousRating', () => {
      const result = service.calculateOverallRatingChange(
        PerformanceRating.EXCEEDS_EXPECTATIONS,
        PerformanceRating.MEETS_EXPECTATIONS
      );

      expect(result).toBe(PmgmArrow.UP);
    });

    test('should return DOWN when currentRating is less than previousRating', () => {
      const result = service.calculateOverallRatingChange(
        PerformanceRating.MEETS_EXPECTATIONS,
        PerformanceRating.EXCEEDS_EXPECTATIONS
      );

      expect(result).toBe(PmgmArrow.DOWN);
    });
  });

  describe('calculateAssessment', () => {
    test('should return GREY when overallPerformanceRating is null', () => {
      const result = service.calculateAssessment({
        ...pmgmDataDtoMock,
        overallPerformanceRating: null,
      });

      expect(result).toBe(PmgmAssessment.GREY);
    });

    test('should return YELLOW when overallPerformanceRating is UNRATED', () => {
      const result = service.calculateAssessment({
        ...pmgmDataDtoMock,
        overallPerformanceRating: PerformanceRating.UNRATED,
      });

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when overallPerformanceRating is BELOW_EXPECTATIONS', () => {
      const result = service.calculateAssessment({
        ...pmgmDataDtoMock,
        overallPerformanceRating: PerformanceRating.BELOW_EXPECTATIONS,
      });

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when overallPerformanceRating is MEETS_EXPECTATIONS', () => {
      const result = service.calculateAssessment({
        ...pmgmDataDtoMock,
        overallPerformanceRating: PerformanceRating.MEETS_EXPECTATIONS,
      });

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return RED when overallPerformanceRating is EXCEEDS_EXPECTATIONS', () => {
      const result = service.calculateAssessment({
        ...pmgmDataDtoMock,
        overallPerformanceRating: PerformanceRating.EXCEEDS_EXPECTATIONS,
      });

      expect(result).toBe(PmgmAssessment.RED);
    });
  });

  describe('assessUnrated', () => {
    test('should return GREY when highRiskOfLoss is null', () => {
      const result = service.assessUnrated(null);

      expect(result).toBe(PmgmAssessment.GREY);
    });

    test('should return YELLOW when highRiskOfLoss is true', () => {
      const result = service.assessUnrated(true);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return GREEN when highRiskOfLoss is false', () => {
      const result = service.assessUnrated(false);

      expect(result).toBe(PmgmAssessment.GREEN);
    });
  });
});
