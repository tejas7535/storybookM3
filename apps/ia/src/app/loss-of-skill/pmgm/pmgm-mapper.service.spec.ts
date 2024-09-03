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
    highImpactOfLoss: false,
    prevYearHighImpactOfLoss: true,
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
      service.calculateLossIndicatorChange = jest.fn(() => PmgmArrow.RIGHT);

      const result = service.mapPmgmDataDtoToPmgmData(dto);

      expect(result).toEqual([
        {
          ...pmgmDataDtoMock,
          assessment: PmgmAssessment.GREEN,
          overallPerformanceRatingChange: PmgmArrow.DOWN,
          managerChange: PmgmArrow.UP,
          highImpactOfLossChange: PmgmArrow.RIGHT,
          highRiskOfLossChange: PmgmArrow.RIGHT,
        },
      ]);
      expect(service.calculateAssessment).toHaveBeenCalledWith(dto[0]);
    });
  });

  describe('calculateLossIndicatorChange', () => {
    test('should return NONE when currentHighImpactOfLoss and previousHighImpactOfLoss are null', () => {
      const result = service.calculateLossIndicatorChange(null, null);

      expect(result).toBe(PmgmArrow.NONE);
    });

    test('should return RIGHT when currentHighImpactOfLoss and previousHighImpactOfLoss are equal', () => {
      const result = service.calculateLossIndicatorChange(true, true);

      expect(result).toBe(PmgmArrow.RIGHT);
    });

    test('should return DOWN when currentHighImpactOfLoss is true and previousHighImpactOfLoss is false', () => {
      const result = service.calculateLossIndicatorChange(true, false);

      expect(result).toBe(PmgmArrow.DOWN);
    });

    test('should return UP when currentHighImpactOfLoss is false and previousHighImpactOfLoss is true', () => {
      const result = service.calculateLossIndicatorChange(false, true);

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
    let dto: PmgmDataDto;

    beforeEach(() => {
      dto = {
        ...pmgmDataDtoMock,
      };
    });

    test('should assess unrated when UNRATED rating', () => {
      dto.overallPerformanceRating = PerformanceRating.UNRATED;
      service.assessUnrated = jest.fn();

      service.calculateAssessment(dto);

      expect(service.assessUnrated).toHaveBeenCalledWith(
        dto.highRiskOfLoss,
        dto.highImpactOfLoss
      );
    });

    test('should assess below expectations when BELOW_EXPECTATIONS rating', () => {
      dto.overallPerformanceRating = PerformanceRating.BELOW_EXPECTATIONS;
      service.assessBelowExpectations = jest.fn();

      service.calculateAssessment(dto);

      expect(service.assessBelowExpectations).toHaveBeenCalledWith(
        dto.highRiskOfLoss,
        dto.highImpactOfLoss
      );
    });

    test('should assess meets expectations when MEETS_EXPECTATIONS rating', () => {
      dto.overallPerformanceRating = PerformanceRating.MEETS_EXPECTATIONS;
      service.assessMeetsExpectations = jest.fn();

      service.calculateAssessment(dto);

      expect(service.assessMeetsExpectations).toHaveBeenCalledWith(
        dto.highRiskOfLoss,
        dto.highImpactOfLoss
      );
    });

    test('should assess exceeds expectations when EXCEEDS_EXPECTATIONS rating', () => {
      dto.overallPerformanceRating = PerformanceRating.EXCEEDS_EXPECTATIONS;
      service.assessExceedsExpectations = jest.fn();

      service.calculateAssessment(dto);

      expect(service.assessExceedsExpectations).toHaveBeenCalledWith(
        dto.highRiskOfLoss,
        dto.highImpactOfLoss
      );
    });

    test('should throw error when invalid performance rating', () => {
      dto.overallPerformanceRating = 'invalid' as PerformanceRating;

      expect(() => service.calculateAssessment(dto)).toThrowError(
        'Invalid performance rating'
      );
    });
  });

  describe('assessUnrated', () => {
    test('should return GREY when highRiskOfLoss and highImpactOfLoss are null', () => {
      const result = service.assessUnrated(null, null);

      expect(result).toBe(PmgmAssessment.GREY);
    });

    test('should return RED when highRiskOfLoss and highImpactOfLoss are true', () => {
      const result = service.assessUnrated(true, true);

      expect(result).toBe(PmgmAssessment.RED);
    });

    test('should return YELLOW when highRiskOfLoss is true and highImpactOfLoss is null', () => {
      const result = service.assessUnrated(true, null);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when highRiskOfLoss is null and highImpactOfLoss is true', () => {
      const result = service.assessUnrated(null, true);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when highRiskOfLoss is true and highImpactOfLoss is false', () => {
      const result = service.assessUnrated(true, false);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when highRiskOfLoss is false and highImpactOfLoss is true', () => {
      const result = service.assessUnrated(false, true);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return GREEN when highRiskOfLoss and highImpactOfLoss are false', () => {
      const result = service.assessUnrated(false, false);

      expect(result).toBe(PmgmAssessment.GREEN);
    });

    test('should return GREEN when highRiskOfLoss is false and highImpactOfLoss is null', () => {
      const result = service.assessUnrated(false, null);

      expect(result).toBe(PmgmAssessment.GREEN);
    });

    test('should return GREEN when highRiskOfLoss is null and highImpactOfLoss is false', () => {
      const result = service.assessUnrated(null, false);

      expect(result).toBe(PmgmAssessment.GREEN);
    });
  });

  describe('assessBelowExpectations', () => {
    test('should return RED when highRiskOfLoss and highImpactOfLoss are true', () => {
      const result = service.assessBelowExpectations(true, true);

      expect(result).toBe(PmgmAssessment.RED);
    });

    test('should return YELLOW when highRiskOfLoss is true and highImpactOfLoss is null', () => {
      const result = service.assessBelowExpectations(true, null);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when highRiskOfLoss is null and highImpactOfLoss is true', () => {
      const result = service.assessBelowExpectations(null, true);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when highRiskOfLoss is true and highImpactOfLoss is false', () => {
      const result = service.assessBelowExpectations(true, false);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when highRiskOfLoss is false and highImpactOfLoss is true', () => {
      const result = service.assessBelowExpectations(false, true);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return GREEN when highRiskOfLoss and highImpactOfLoss are null', () => {
      const result = service.assessBelowExpectations(null, null);

      expect(result).toBe(PmgmAssessment.GREEN);
    });

    test('should return GREEN when highRiskOfLoss and highImpactOfLoss are false', () => {
      const result = service.assessBelowExpectations(false, false);

      expect(result).toBe(PmgmAssessment.GREEN);
    });

    test('should return GREEN when highRiskOfLoss is false and highImpactOfLoss is null', () => {
      const result = service.assessBelowExpectations(false, null);

      expect(result).toBe(PmgmAssessment.GREEN);
    });

    test('should return GREEN when highRiskOfLoss is null and highImpactOfLoss is false', () => {
      const result = service.assessBelowExpectations(null, false);

      expect(result).toBe(PmgmAssessment.GREEN);
    });
  });

  describe('assessMeetsExpectations', () => {
    test('should return RED when highRiskOfLoss and highImpactOfLoss are true', () => {
      const result = service.assessMeetsExpectations(true, true);

      expect(result).toBe(PmgmAssessment.RED);
    });

    test('should return YELLOW when highRiskOfLoss is true and highImpactOfLoss is null', () => {
      const result = service.assessMeetsExpectations(true, null);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when highRiskOfLoss is null and highImpactOfLoss is true', () => {
      const result = service.assessMeetsExpectations(null, true);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when highRiskOfLoss is true and highImpactOfLoss is false', () => {
      const result = service.assessMeetsExpectations(true, false);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when highRiskOfLoss is false and highImpactOfLoss is true', () => {
      const result = service.assessMeetsExpectations(false, true);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when highRiskOfLoss is null and highImpactOfLoss is false', () => {
      const result = service.assessMeetsExpectations(null, false);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return GREEN when highRiskOfLoss and highImpactOfLoss are null', () => {
      const result = service.assessMeetsExpectations(null, null);

      expect(result).toBe(PmgmAssessment.GREEN);
    });

    test('should return GREEN when highRiskOfLoss and highImpactOfLoss are false', () => {
      const result = service.assessMeetsExpectations(false, false);

      expect(result).toBe(PmgmAssessment.GREEN);
    });

    test('should return GREEN when highRiskOfLoss is false and highImpactOfLoss is null', () => {
      const result = service.assessMeetsExpectations(false, null);

      expect(result).toBe(PmgmAssessment.GREEN);
    });
  });

  describe('assessExceedsExpectations', () => {
    test('should return RED when highRiskOfLoss is true and highImpactOfLoss is null', () => {
      const result = service.assessExceedsExpectations(true, null);

      expect(result).toBe(PmgmAssessment.RED);
    });

    test('should return RED when highRiskOfLoss and highImpactOfLoss are true', () => {
      const result = service.assessExceedsExpectations(true, true);

      expect(result).toBe(PmgmAssessment.RED);
    });

    test('should return RED when highRiskOfLoss is null and highImpactOfLoss is true', () => {
      const result = service.assessExceedsExpectations(null, true);

      expect(result).toBe(PmgmAssessment.RED);
    });

    test('should return RED when highRiskOfLoss is true and highImpactOfLoss is false', () => {
      const result = service.assessExceedsExpectations(true, false);

      expect(result).toBe(PmgmAssessment.RED);
    });

    test('should return RED when highRiskOfLoss is false and highImpactOfLoss is true', () => {
      const result = service.assessExceedsExpectations(false, true);

      expect(result).toBe(PmgmAssessment.RED);
    });

    test('should return YELLOW when highRiskOfLoss and highImpactOfLoss are null', () => {
      const result = service.assessExceedsExpectations(null, null);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when highRiskOfLoss and highImpactOfLoss are false', () => {
      const result = service.assessExceedsExpectations(false, false);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when highRiskOfLoss is false and highImpactOfLoss is null', () => {
      const result = service.assessExceedsExpectations(false, null);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });

    test('should return YELLOW when highRiskOfLoss is null and highImpactOfLoss is false', () => {
      const result = service.assessExceedsExpectations(null, false);

      expect(result).toBe(PmgmAssessment.YELLOW);
    });
  });
});
