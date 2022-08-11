import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import { ApiVersion, IdValue, Slice } from '../shared/models';

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
        { params, context: withCache() }
      )
      .pipe(map((result) => result.content));
  }

  getRegions(): Observable<IdValue[]> {
    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.REGIONS}`,
      { context: withCache() }
    );
  }

  getSubRegions(): Observable<IdValue[]> {
    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.SUB_REGIONS}`,
      { context: withCache() }
    );
  }

  getCountries(): Observable<IdValue[]> {
    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.COUNTRIES}`,
      { context: withCache() }
    );
  }

  getFunctions(): Observable<IdValue[]> {
    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.FUNCTIONS}`,
      { context: withCache() }
    );
  }

  getSubFunctions(): Observable<IdValue[]> {
    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.SUB_FUNCTIONS}`,
      { context: withCache() }
    );
  }

  getSegments(): Observable<IdValue[]> {
    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.SEGMENTS}`,
      { context: withCache() }
    );
  }

  getSubSegments(): Observable<IdValue[]> {
    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.SUB_SEGMENTS}`,
      { context: withCache() }
    );
  }

  getSegmentUnits(): Observable<IdValue[]> {
    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.SEGMENT_UNITS}`,
      { context: withCache() }
    );
  }

  getBoards(): Observable<IdValue[]> {
    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.BOARDS}`,
      { context: withCache() }
    );
  }

  getSubBoards(): Observable<IdValue[]> {
    return this.http.get<IdValue[]>(
      `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.SUB_BOARDS}`,
      { context: withCache() }
    );
  }
}
