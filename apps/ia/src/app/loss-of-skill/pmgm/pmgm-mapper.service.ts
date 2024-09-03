import { Injectable } from '@angular/core';

import {
  PerformanceRating,
  PmgmArrow,
  PmgmAssessment,
  PmgmData,
  PmgmDataDto,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class PmgmMapperService {
  mapPmgmDataDtoToPmgmData(pmgmDataDto: PmgmDataDto[]): PmgmData[] {
    return pmgmDataDto.map((dto) => {
      const assessment = this.calculateAssessment(dto);
      const managerChange = this.calculateManagerChange(
        dto.isManager,
        dto.prevYearIsManager
      );
      const overallPerformanceRatingChange = this.calculateOverallRatingChange(
        dto.overallPerformanceRating,
        dto.prevYearOverallPerformanceRating
      );
      const highImpactOfLossChange = this.calculateLossIndicatorChange(
        dto.highImpactOfLoss,
        dto.prevYearHighImpactOfLoss
      );
      const highRiskOfLossChange = this.calculateLossIndicatorChange(
        dto.highRiskOfLoss,
        dto.prevYearHighRiskOfLoss
      );

      return {
        ...dto,
        assessment,
        managerChange,
        overallPerformanceRatingChange,
        highImpactOfLossChange,
        highRiskOfLossChange,
      };
    });
  }

  calculateLossIndicatorChange(
    currentHighImpactOfLoss: boolean,
    previousHighImpactOfLoss: boolean
  ): PmgmArrow {
    if (currentHighImpactOfLoss === null || previousHighImpactOfLoss === null) {
      return PmgmArrow.NONE;
    }
    if (currentHighImpactOfLoss === previousHighImpactOfLoss) {
      return PmgmArrow.RIGHT;
    }

    return currentHighImpactOfLoss ? PmgmArrow.DOWN : PmgmArrow.UP;
  }

  calculateManagerChange(
    currentIsManager: boolean,
    previousIsManager: boolean
  ): PmgmArrow {
    if (currentIsManager === previousIsManager) {
      return PmgmArrow.RIGHT;
    }

    return currentIsManager ? PmgmArrow.UP : PmgmArrow.DOWN;
  }

  calculateOverallRatingChange(
    currentRating: PerformanceRating,
    previousRating: PerformanceRating
  ): PmgmArrow {
    if (
      currentRating === PerformanceRating.UNRATED ||
      previousRating === PerformanceRating.UNRATED
    ) {
      return PmgmArrow.NONE;
    }
    if (currentRating === previousRating) {
      return PmgmArrow.RIGHT;
    }

    return currentRating > previousRating ? PmgmArrow.UP : PmgmArrow.DOWN;
  }

  calculateAssessment(dto: PmgmDataDto): PmgmAssessment {
    let result: PmgmAssessment;

    switch (dto.overallPerformanceRating) {
      case PerformanceRating.UNRATED: {
        result = this.assessUnrated(dto.highRiskOfLoss, dto.highImpactOfLoss);
        break;
      }
      case PerformanceRating.BELOW_EXPECTATIONS: {
        result = this.assessBelowExpectations(
          dto.highRiskOfLoss,
          dto.highImpactOfLoss
        );
        break;
      }
      case PerformanceRating.MEETS_EXPECTATIONS: {
        result = this.assessMeetsExpectations(
          dto.highRiskOfLoss,
          dto.highImpactOfLoss
        );
        break;
      }
      case PerformanceRating.EXCEEDS_EXPECTATIONS: {
        result = this.assessExceedsExpectations(
          dto.highRiskOfLoss,
          dto.highImpactOfLoss
        );
        break;
      }
      default: {
        throw new Error('Invalid performance rating');
      }
    }

    return result;
  }

  assessUnrated(
    highRiskOfLoss: boolean | null,
    highImpactOfLoss: boolean | null
  ): PmgmAssessment {
    let result: PmgmAssessment;

    if (highRiskOfLoss === null && highImpactOfLoss === null) {
      result = PmgmAssessment.GREY;
    } else if (highRiskOfLoss && highImpactOfLoss) {
      result = PmgmAssessment.RED;
    } else if (
      (highRiskOfLoss && !highImpactOfLoss) ||
      (!highRiskOfLoss && highImpactOfLoss)
    ) {
      result = PmgmAssessment.YELLOW;
    } else if (!highRiskOfLoss && !highImpactOfLoss) {
      result = PmgmAssessment.GREEN;
    }

    return result;
  }

  assessBelowExpectations(
    highRiskOfLoss: boolean | null,
    highImpactOfLoss: boolean | null
  ): PmgmAssessment {
    let result: PmgmAssessment;

    if (highRiskOfLoss && highImpactOfLoss) {
      result = PmgmAssessment.RED;
    } else if (
      (highRiskOfLoss && !highImpactOfLoss) ||
      (!highRiskOfLoss && highImpactOfLoss)
    ) {
      result = PmgmAssessment.YELLOW;
    } else if (!highRiskOfLoss && !highImpactOfLoss) {
      result = PmgmAssessment.GREEN;
    }

    return result;
  }

  assessMeetsExpectations(
    highRiskOfLoss: boolean | null,
    highImpactOfLoss: boolean | null
  ): PmgmAssessment {
    let result: PmgmAssessment;

    if (highRiskOfLoss && highImpactOfLoss) {
      result = PmgmAssessment.RED;
    } else if (
      (highRiskOfLoss && !highImpactOfLoss) ||
      (!highRiskOfLoss && highImpactOfLoss) ||
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
      (highRiskOfLoss === null && highImpactOfLoss === false)
    ) {
      result = PmgmAssessment.YELLOW;
    } else if (!highRiskOfLoss && !highImpactOfLoss) {
      result = PmgmAssessment.GREEN;
    }

    return result;
  }

  assessExceedsExpectations(
    highRiskOfLoss: boolean | null,
    highImpactOfLoss: boolean | null
  ): PmgmAssessment {
    let result: PmgmAssessment;

    if (
      (highRiskOfLoss && highImpactOfLoss) ||
      (highRiskOfLoss && !highImpactOfLoss) ||
      (!highRiskOfLoss && highImpactOfLoss)
    ) {
      result = PmgmAssessment.RED;
    } else if (!highRiskOfLoss && !highImpactOfLoss) {
      result = PmgmAssessment.YELLOW;
    }

    return result;
  }
}
