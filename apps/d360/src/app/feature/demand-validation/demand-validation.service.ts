import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { catchError, map, Observable, of, Subject } from 'rxjs';

import { translate, TranslocoService } from '@jsverse/transloco';
import {
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-enterprise';
import { format, formatISO } from 'date-fns';

import { AUTO_CONFIGURE_APPLICATION_JSON_HEADER } from '../../shared/interceptors/headers.interceptor';
import {
  errorsFromSAPtoMessage,
  PostResult,
  ResultMessage,
} from '../../shared/utils/error-handling';
import { getErrorMessage } from '../../shared/utils/errors';
import { strictlyParseLocalFloat } from '../../shared/utils/number';
import { ValidationHelper } from '../../shared/utils/validation/validation-helper';
import { GlobalSelectionCriteriaFilters } from '../global-selection/model';
import { DemandValidationStringFilter } from './demand-validation-filters';
import {
  BucketRequest,
  DeleteKpiDataRequest,
  DeleteKpiDataResponse,
  DemandMaterialCustomerRequest,
  DemandValidationBatch,
  DemandValidationBatchResponse,
  KpiBucket,
  KpiBucketType,
  KpiData,
  KpiDataRequest,
  KpiDateRanges,
  MaterialListEntry,
  MaterialType,
  WriteKpiData,
  WriteKpiDataResponse,
} from './model';

@Injectable({
  providedIn: 'root',
})
export class DemandValidationService {
  private readonly DEMAND_VALIDATION_API = 'api/demand-validation';
  private readonly DEMAND_VALIDATION_BUCKETS_API =
    'api/demand-validation/buckets';
  private readonly DEMAND_VALIDATION_KPI_API = 'api/demand-validation/kpis';
  private readonly DEMAND_VALIDATION_CUSTOMER_MATERIAL_LIST_API =
    'api/demand-validation/material-customer-list';
  private readonly dataFetchedEvent = new Subject<{
    rowData: any[];
    rowCount: number;
  }>();
  private readonly fetchErrorEvent = new Subject<any>();

  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translocoService = inject(TranslocoService);

  public getDataFetchedEvent(): Observable<{
    rowData: any[];
    rowCount: number;
  }> {
    return this.dataFetchedEvent.asObservable();
  }

  public getFetchErrorEvent(): Observable<any> {
    return this.fetchErrorEvent.asObservable();
  }

  public deleteValidatedDemandBatch(
    data: DeleteKpiDataRequest,
    dryRun: boolean
  ): Observable<DeleteKpiDataResponse> {
    const params = new HttpParams().set('dryRun', dryRun.toString());

    return this.http.delete<DeleteKpiDataResponse>(this.DEMAND_VALIDATION_API, {
      body: data,
      params,
    });
  }

  public saveValidatedDemandBatch(
    data: DemandValidationBatch[],
    customerNumber: string,
    dryRun: boolean,
    materialType: MaterialType
  ): Observable<PostResult<DemandValidationBatchResponse>> {
    const writeKpiData: WriteKpiData[] = data.map((entry) => ({
      ids: [entry.id],
      customerNumber,
      materialNumber: entry.material,
      kpiEntries: entry?.kpiEntries ?? [
        {
          idx: entry.id ? Number.parseInt(entry.id, 10) : undefined,
          fromDate: format(entry.dateString, 'yyyy-MM-dd'),
          bucketType: (entry.periodType === 'month'
            ? 'MONTH'
            : 'WEEK') as KpiBucketType,
          validatedForecast: strictlyParseLocalFloat(
            entry.forecast,
            ValidationHelper.getDecimalSeparatorForActiveLocale()
          ),
        },
      ],
    }));

    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(writeKpiData)], {
      type: 'application/json',
    });
    formData.append('data', jsonBlob);

    const params = new HttpParams()
      .set('dryRun', dryRun.toString())
      .set(
        'useCustomerMaterials',
        materialType === 'customer' ? 'true' : 'false'
      );

    return this.http
      .patch<WriteKpiDataResponse[]>(this.DEMAND_VALIDATION_API, formData, {
        params,
        context: new HttpContext().set(
          AUTO_CONFIGURE_APPLICATION_JSON_HEADER,
          false
        ),
      })
      .pipe(
        map((response) => {
          const batchResponse: DemandValidationBatchResponse[] = [];

          // TODO: add a generic way to parse ID and IDX in Error Messages.
          response.forEach((entry) => {
            if (entry.ids) {
              const messageStrings = entry.results.map((message) =>
                JSON.stringify(message)
              );

              const deduplicatedMessageStrings = [...new Set(messageStrings)];

              const deduplicatedResultMessages: ResultMessage[] =
                deduplicatedMessageStrings.map((str) => JSON.parse(str).result);

              entry.ids.forEach((id) => {
                batchResponse.push({
                  id,
                  customerNumber: entry.customerNumber,
                  materialNumber: entry.materialNumber,
                  // TODO: Only fill one error message for now, as we can only handle one error message per row
                  // the entire functionality will be refactored in the future and we get a better allocation from
                  // error message and the row
                  result:
                    deduplicatedResultMessages?.length > 0
                      ? deduplicatedResultMessages[0]
                      : null,
                });
              });
            }
          });

          return {
            overallStatus: 'SUCCESS',
            overallErrorMsg: null,
            response: batchResponse,
          } as PostResult<DemandValidationBatchResponse>;
        }),
        catchError((error) =>
          of({
            overallStatus: 'ERROR',
            overallErrorMsg: getErrorMessage(error),
            response: [],
          } as PostResult<DemandValidationBatchResponse>)
        ),
        takeUntilDestroyed(this.destroyRef)
      );
  }

  public saveValidatedDemandSingleMcc(
    kpiData: WriteKpiData | null,
    errors: Set<string>,
    dryRun: boolean
  ): Observable<string | null> {
    if (!kpiData) {
      return of(translate('validation_of_demand.error.no_data'));
    }

    if (errors.size > 0) {
      const dates = [...errors.values()].join(', ');

      return of(
        translate(
          `validation_of_demand.${dryRun ? 'check' : 'save'}.error_specific`,
          { dates }
        )
      );
    }

    const params = new HttpParams().set('dryRun', dryRun.toString());

    return this.http
      .post<WriteKpiDataResponse>(this.DEMAND_VALIDATION_API, kpiData, {
        params,
      })
      .pipe(
        map((result) => {
          if (
            result.results.every((res) => res.result.messageType === 'SUCCESS')
          ) {
            return null; // no error, success!
          } else {
            const errorDatesAndCauses = result.results
              .map((val) =>
                val.result.messageType === 'ERROR'
                  ? `\n ${val.fromDate}: ${errorsFromSAPtoMessage(val.result)}`
                  : null
              )
              .filter((v) => v !== null)
              .join(', ');

            return translate(
              `validation_of_demand.${dryRun ? 'check' : 'save'}.error_specific`,
              { dates: errorDatesAndCauses }
            );
          }
        }),
        catchError(() =>
          of(translate('validation_of_demand.save.error_unspecific'))
        )
      );
  }

  public getKpiBuckets(kpiDateRanges: KpiDateRanges): Observable<KpiBucket[]> {
    const requestParams: BucketRequest = {
      range1: {
        from: formatISO(kpiDateRanges.range1.from, { representation: 'date' }),
        to: formatISO(kpiDateRanges.range1.to, { representation: 'date' }),
        period: kpiDateRanges.range1.period,
      },
      range2: kpiDateRanges.range2
        ? {
            from: formatISO(kpiDateRanges.range2.from, {
              representation: 'date',
            }),
            to: formatISO(kpiDateRanges.range2.to, { representation: 'date' }),
            period: kpiDateRanges.range2.period,
          }
        : undefined,
    };

    return this.http.post<KpiBucket[]>(
      this.DEMAND_VALIDATION_BUCKETS_API,
      requestParams
    );
  }

  public getKpiData(
    materialListEntry: MaterialListEntry | undefined,
    kpiDateRanges: KpiDateRanges,
    exceptions: Date[]
  ): Observable<KpiData | null> {
    const requestParams: KpiDataRequest | undefined =
      materialListEntry?.materialNumber && materialListEntry?.customerNumber
        ? {
            customerNumber: materialListEntry.customerNumber,
            materialNumber: materialListEntry.materialNumber,
            selectedKpis: {
              activeAndPredecessor: true,
              deliveries: true,
              firmBusiness: true,
              opportunities: true,
              forecastProposal: true,
              forecastProposalDemandPlanner: true,
              validatedForecast: true,
              indicativeDemandPlan: true,
              currentDemandPlan: true,
              confirmedDeliveries: true,
              confirmedFirmBusiness: true,
              confirmedDemandPlan: true,
            },
            range1: {
              from: formatISO(kpiDateRanges.range1.from, {
                representation: 'date',
              }),
              to: formatISO(kpiDateRanges.range1.to, {
                representation: 'date',
              }),
              period: kpiDateRanges.range1.period,
            },
            range2: kpiDateRanges.range2
              ? {
                  from: formatISO(kpiDateRanges.range2.from, {
                    representation: 'date',
                  }),
                  to: formatISO(kpiDateRanges.range2.to, {
                    representation: 'date',
                  }),
                  period: kpiDateRanges.range2.period,
                }
              : undefined,
            exceptions: exceptions.map((e) =>
              formatISO(e, { representation: 'date' })
            ),
          }
        : undefined;

    return requestParams
      ? this.http.post<KpiData>(this.DEMAND_VALIDATION_KPI_API, requestParams)
      : of(null);
  }

  public createDemandMaterialCustomerDatasource(
    selectionFilters: GlobalSelectionCriteriaFilters &
      DemandValidationStringFilter
  ): IServerSideDatasource {
    return {
      getRows: (params: IServerSideGetRowsParams) => {
        const { startRow, endRow, sortModel } = params.request;

        const request: DemandMaterialCustomerRequest = {
          selectionFilters,
          sortModel,
          startRow: startRow || 0,
          endRow: endRow || 50,
        };

        this.http
          .post<{
            rows: any[];
            rowCount: number;
          }>(this.DEMAND_VALIDATION_CUSTOMER_MATERIAL_LIST_API, request, {
            params: new HttpParams().set(
              'language',
              this.translocoService.getActiveLang()
            ),
          })
          .subscribe({
            next: ({ rows, rowCount }) => {
              params.success({ rowData: rows, rowCount });
              this.dataFetchedEvent.next({ rowData: rows, rowCount });
            },
            error: (error) => {
              params.fail();
              this.fetchErrorEvent.next(error);
            },
          });
      },
    };
  }
}
