import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IServerSideGetRowsParams } from '@ag-grid-enterprise/all-modules';

import { environment } from '../../environments/environment';
import { SalesSummary } from '../core/store/reducers/sales-summary/models/sales-summary.model';
import { FilterType } from './enums/filter-type.enum';
import { UpdateDatesParams } from './models/dates-update.model';
import { Page } from './models/page.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private readonly http: HttpClient) {}

  private static addSortParams(
    httpParams: HttpParams,
    requestParams: IServerSideGetRowsParams
  ): HttpParams {
    let returnParams = httpParams;

    if (requestParams.request.sortModel.length !== 0) {
      for (const sortModel of requestParams.request.sortModel) {
        const paramName = `sort${sortModel.colId
          .charAt(0)
          .toUpperCase()}${sortModel.colId.slice(1)}`;
        const paramValue = sortModel.sort.toUpperCase();
        returnParams = returnParams.set(paramName, paramValue);
      }
    }

    return returnParams;
  }

  private static addFilterParams(
    httpParams: HttpParams,
    requestParams: IServerSideGetRowsParams
  ): HttpParams {
    let returnParams = httpParams;

    const filterKeys = Object.keys(requestParams.request.filterModel);
    if (filterKeys.length !== 0) {
      for (const filterKey of filterKeys) {
        if (requestParams.request.filterModel[filterKey].type === 'equals') {
          const filterValue = requestParams.request.filterModel[filterKey]
            .dateFrom
            ? DataService.createIsoDateString(
                requestParams.request.filterModel[filterKey].dateFrom
              )
            : requestParams.request.filterModel[filterKey].filter;
          returnParams = returnParams.set(
            DataService.buildFilterParamKey(filterKey, FilterType.FILTER),
            filterValue
          );
        } else if (
          requestParams.request.filterModel[filterKey].type === 'inRange'
        ) {
          const dateFrom = DataService.createIsoDateString(
            requestParams.request.filterModel[filterKey].dateFrom
          );
          const dateTo = DataService.createIsoDateString(
            requestParams.request.filterModel[filterKey].dateTo
          );
          const paramValue = `${dateFrom}|${dateTo}`;
          returnParams = returnParams.set(
            DataService.buildFilterParamKey(filterKey, FilterType.DATE_RANGE),
            paramValue
          );
        }
      }
    }

    return returnParams;
  }

  private static buildFilterParamKey(
    filterKey: string,
    filterType: FilterType
  ): string {
    return `${filterType}${filterKey.charAt(0).toUpperCase()}${filterKey.slice(
      1
    )}`;
  }

  private static createIsoDateString(dateString: string): string {
    return new Date(dateString.split(' ')[0]).toISOString();
  }

  public getSalesSummary(): Observable<Page<SalesSummary>> {
    return this.http
      .get<Page<SalesSummary>>(`${environment.apiBaseUrl}/sales`)
      .pipe(map((salesSummaryPage: Page<SalesSummary>) => salesSummaryPage));
  }

  public async getSalesSummaryPromise(
    requestParams: IServerSideGetRowsParams
  ): Promise<Page<SalesSummary>> {
    let httpParams = new HttpParams();

    httpParams = DataService.addSortParams(httpParams, requestParams);
    httpParams = DataService.addFilterParams(httpParams, requestParams);

    const pageSize =
      requestParams.request.endRow - requestParams.request.startRow;
    const pageNumber = requestParams.request.endRow / pageSize - 1;

    httpParams = httpParams.set('pageNumber', pageNumber.toString());

    return this.http
      .get<Page<SalesSummary>>(`${environment.apiBaseUrl}/sales`, {
        params: httpParams,
      })
      .toPromise();
  }

  public async updateDates(
    updateDatesParams: UpdateDatesParams
  ): Promise<void> {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/sales/update-dates`,
        updateDatesParams
      )
      .toPromise();
  }
}
