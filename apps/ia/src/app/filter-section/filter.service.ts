import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EMPTY, map, Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import { ApiVersion, FilterDimension, IdValue, Slice } from '../shared/models';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  readonly FILTER_BASE_PATH = 'filters';
  readonly AUTOCOMPLETE_ORG_UNITS = 'org-units';
  readonly REGIONS = 'regions';
  readonly SUB_REGIONS = 'sub-regions';
  readonly COUNTRIES = 'countries';
  readonly FUNCTIONS = 'functions';
  readonly SUB_FUNCTIONS = 'sub-functions';
  readonly SEGMENTS = 'segments';
  readonly SUB_SEGMENTS = 'sub-segments';
  readonly SEGMENT_UNITS = 'segment-units';
  readonly BOARDS = 'boards';
  readonly SUB_BOARDS = 'sub-boards';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getOrgUnits(searchFor: string, timeRange: string): Observable<IdValue[]> {
    const params = this.paramsCreator.createHttpParamsForAutoCompleteOrgUnits(
      searchFor,
      timeRange
    );

    return this.http
      .get<Slice<IdValue>>(
        `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.AUTOCOMPLETE_ORG_UNITS}`,
        {
          params,
          context: withCache(),
        }
      )
      .pipe(map((result) => result.content));
  }

  getRegions(timeRange: string): Observable<IdValue[]> {
    const params = this.paramsCreator.createHttpParamsForTimeRange(timeRange);

    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.REGIONS}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getSubRegions(timeRange: string): Observable<IdValue[]> {
    const params = this.paramsCreator.createHttpParamsForTimeRange(timeRange);

    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.SUB_REGIONS}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getCountries(timeRange: string): Observable<IdValue[]> {
    const params = this.paramsCreator.createHttpParamsForTimeRange(timeRange);

    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.COUNTRIES}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getFunctions(timeRange: string): Observable<IdValue[]> {
    const params = this.paramsCreator.createHttpParamsForTimeRange(timeRange);

    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.FUNCTIONS}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getSubFunctions(timeRange: string): Observable<IdValue[]> {
    const params = this.paramsCreator.createHttpParamsForTimeRange(timeRange);

    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.SUB_FUNCTIONS}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getSegments(timeRange: string): Observable<IdValue[]> {
    const params = this.paramsCreator.createHttpParamsForTimeRange(timeRange);

    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.SEGMENTS}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getSubSegments(timeRange: string): Observable<IdValue[]> {
    const params = this.paramsCreator.createHttpParamsForTimeRange(timeRange);

    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.SUB_SEGMENTS}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getSegmentUnits(timeRange: string): Observable<IdValue[]> {
    const params = this.paramsCreator.createHttpParamsForTimeRange(timeRange);

    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.SEGMENT_UNITS}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getBoards(timeRange: string): Observable<IdValue[]> {
    const params = this.paramsCreator.createHttpParamsForTimeRange(timeRange);

    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.BOARDS}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getSubBoards(timeRange: string): Observable<IdValue[]> {
    const params = this.paramsCreator.createHttpParamsForTimeRange(timeRange);

    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.SUB_BOARDS}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getDataForFilterDimension(
    filterDimension: string,
    searchFor?: string,
    timeRangeId?: string
  ): Observable<IdValue[]> {
    switch (filterDimension) {
      case FilterDimension.ORG_UNIT:
        return this.getOrgUnits(searchFor, timeRangeId);

      case FilterDimension.REGION:
        return this.getRegions(timeRangeId);

      case FilterDimension.SUB_REGION:
        return this.getSubRegions(timeRangeId);

      case FilterDimension.COUNTRY:
        return this.getCountries(timeRangeId);

      case FilterDimension.FUNCTION:
        return this.getFunctions(timeRangeId);

      case FilterDimension.SUB_FUNCTION:
        return this.getSubFunctions(timeRangeId);

      case FilterDimension.SEGMENT:
        return this.getSegments(timeRangeId);

      case FilterDimension.SUB_SEGMENT:
        return this.getSubSegments(timeRangeId);

      case FilterDimension.SEGMENT_UNIT:
        return this.getSegmentUnits(timeRangeId);

      case FilterDimension.BOARD:
        return this.getBoards(timeRangeId);

      case FilterDimension.SUB_BOARD:
        return this.getSubBoards(timeRangeId);

      default:
        return EMPTY;
    }
  }
}
