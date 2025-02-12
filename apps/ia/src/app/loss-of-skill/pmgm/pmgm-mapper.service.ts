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
  mapPmgmDataResponseToPmgmData(pmgmData: PmgmDataDto[]): PmgmData[] {
    return pmgmData.map((dto) => {
      const assessment = this.calculateAssessment(dto);
      const managerChange = this.calculateManagerChange(
        dto.isManager,
        dto.prevYearIsManager
      );
      const overallPerformanceRatingChange = this.calculateOverallRatingChange(
        dto.overallPerformanceRating,
        dto.prevYearOverallPerformanceRating
      );
      const highRiskOfLossChange = this.calculateRiskOfLossChange(
        dto.highRiskOfLoss,
        dto.prevYearHighRiskOfLoss
      );

      return {
        ...dto,
        assessment,
        managerChange,
        overallPerformanceRatingChange,
        highRiskOfLossChange,
      };
    });
  }

  calculateRiskOfLossChange(
    currentHighRiskOfLoss: boolean,
    previousHighRiskOfLoss: boolean
  ): PmgmArrow {
    if (currentHighRiskOfLoss === null || previousHighRiskOfLoss === null) {
      return PmgmArrow.NONE;
    }
    if (currentHighRiskOfLoss === previousHighRiskOfLoss) {
      return PmgmArrow.RIGHT;
    }

    return currentHighRiskOfLoss ? PmgmArrow.DOWN : PmgmArrow.UP;
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

    if (!dto.overallPerformanceRating) {
      return PmgmAssessment.GREY;
    }

    switch (dto.overallPerformanceRating) {
      case PerformanceRating.UNRATED: {
        result = this.assessUnrated(dto.highRiskOfLoss);
        break;
      }
      case PerformanceRating.BELOW_EXPECTATIONS:
      case PerformanceRating.MEETS_EXPECTATIONS: {
        result = dto.highRiskOfLoss
          ? PmgmAssessment.YELLOW
          : PmgmAssessment.GREEN;
        break;
      }
      case PerformanceRating.EXCEEDS_EXPECTATIONS: {
        result = dto.highRiskOfLoss
          ? PmgmAssessment.RED
          : PmgmAssessment.YELLOW;
        break;
      }
      default: {
        throw new Error('Invalid performance rating');
      }
    }

    return result;
  }

  assessUnrated(highRiskOfLoss: boolean | null): PmgmAssessment {
    let result: PmgmAssessment;

    if (highRiskOfLoss === null) {
      result = PmgmAssessment.GREY;
    } else if (highRiskOfLoss) {
      result = PmgmAssessment.YELLOW;
    } else {
      result = PmgmAssessment.GREEN;
    }

    return result;
  }
}
