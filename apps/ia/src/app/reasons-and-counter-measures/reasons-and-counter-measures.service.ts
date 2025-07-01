import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ExitEntryEmployeesResponse } from '../overview/models';
import { ParamsCreatorService } from '../shared/http/params-creator.service';
import { ApiVersion, EmployeesRequest } from '../shared/models';
import { TextAnalysisResponse } from './models';
import { ReasonForLeavingStats } from './models/reason-for-leaving-stats.model';

@Injectable({
  providedIn: 'root',
})
export class ReasonsAndCounterMeasuresService {
  readonly REASONS_WHY_PEOPLE_LEFT = 'reasons-why-people-left';
  readonly REASONS_LEAVERS = 'reasons-leavers';
  readonly REASON_TEXT_ANALYSIS = 'reason-text-analysis';
  readonly REASON_GENERAL_QUESTIONS_ANALYSIS = 'general-questions-analysis';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getReasonsWhyPeopleLeft(
    employeesRequest: EmployeesRequest
  ): Observable<ReasonForLeavingStats> {
    const params = this.paramsCreator.createHttpParamsForDimensionAndTimeRange(
      employeesRequest.filterDimension,
      employeesRequest.value,
      employeesRequest.timeRange
    );

    return this.http.get<ReasonForLeavingStats>(
      `${ApiVersion.V1}/${this.REASONS_WHY_PEOPLE_LEFT}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getLeaversByReason(
    employeesRequest: EmployeesRequest
  ): Observable<ExitEntryEmployeesResponse> {
    const params = employeesRequest.detailedReasonId
      ? this.paramsCreator.createHttpParamsForDimensionTimeRangeReasonAndDetailedReason(
          employeesRequest.filterDimension,
          employeesRequest.value,
          employeesRequest.timeRange,
          employeesRequest.reasonId,
          employeesRequest.detailedReasonId
        )
      : this.paramsCreator.createHttpParamsForDimensionTimeRangeAndReason(
          employeesRequest.filterDimension,
          employeesRequest.value,
          employeesRequest.timeRange,
          employeesRequest.reasonId
        );

    return this.http.get<ExitEntryEmployeesResponse>(
      `${ApiVersion.V1}/${this.REASONS_LEAVERS}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getReasonTextAnalysis(
    employeesRequest: EmployeesRequest
  ): Observable<TextAnalysisResponse> {
    const params = this.paramsCreator.createHttpParamsForDimensionAndTimeRange(
      employeesRequest.filterDimension,
      employeesRequest.value,
      employeesRequest.timeRange
    );

    return this.http.get<TextAnalysisResponse>(
      `${ApiVersion.V1}/${this.REASON_TEXT_ANALYSIS}`,
      {
        params,
        context: withCache(),
      }
    );
  }
}
