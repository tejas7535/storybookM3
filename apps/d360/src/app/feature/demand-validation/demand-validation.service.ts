import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, Observable, of, Subject } from 'rxjs';

import { translate } from '@jsverse/transloco';
import {
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-community';
import { formatISO } from 'date-fns';

import { errorsFromSAPtoMessage } from '../../shared/utils/error-handling';
import { GlobalSelectionCriteriaFilters } from '../global-selection/model';
import { DemandValidationStringFilter } from './demand-validation-filters';
import {
  BucketRequest,
  DeleteKpiDataRequest,
  DeleteKpiDataResponse,
  DemandMaterialCustomerRequest,
  ForecastInfo,
  KpiBucket,
  KpiData,
  KpiDataRequest,
  KpiDateRanges,
  MaterialListEntry,
  MaterialType,
  ValidatedDemandBatchErrorMessages,
  ValidatedDemandBatchResult,
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

  constructor(private readonly http: HttpClient) {}

  getDataFetchedEvent(): Observable<{ rowData: any[]; rowCount: number }> {
    return this.dataFetchedEvent.asObservable();
  }

  getFetchErrorEvent(): Observable<any> {
    return this.fetchErrorEvent.asObservable();
  }

  deleteValidatedDemandBatch(
    data: DeleteKpiDataRequest,
    dryRun: boolean
  ): Observable<DeleteKpiDataResponse> {
    const params = new HttpParams().set('dryRun', dryRun.toString());

    return this.http.delete<DeleteKpiDataResponse>(this.DEMAND_VALIDATION_API, {
      body: data,
      params,
    });
  }

  saveValidatedDemandBatch(
    data: WriteKpiData[],
    dryRun: boolean,
    materialType: MaterialType
  ): Observable<ValidatedDemandBatchResult> {
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(data)], {
      type: 'application/json',
    });
    formData.append('data', jsonBlob);

    const params = new HttpParams().set('dryRun', dryRun.toString());
    if (materialType === 'customer') {
      params.set('useCustomerMaterials', 'true');
    }

    return this.http
      .patch<WriteKpiDataResponse[]>(this.DEMAND_VALIDATION_API, formData, {
        params,
        // In order for a multipart to work, the browser needs to automatically deduce the
        // content type and set the correct header with a boundary, hence we need to turn the autoHeader off.
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .pipe(
        map((resData) => {
          const errorMessages: ValidatedDemandBatchErrorMessages = {};

          resData.forEach((entry) => {
            if (entry.ids) {
              const resultMessages = entry.results
                .map((result) => result.result)
                .filter((message) => message.messageType !== 'SUCCESS');
              const deduplicatedResultMessages = resultMessages.filter(
                (value, index) => {
                  const _value = JSON.stringify(value);

                  return (
                    index ===
                    resultMessages.findIndex(
                      (obj) => JSON.stringify(obj) === _value
                    )
                  );
                }
              );

              entry.ids.forEach((id) => {
                errorMessages[id] =
                  deduplicatedResultMessages.length > 0
                    ? deduplicatedResultMessages
                    : undefined;
              });
            }
          });

          const savedCount = Object.values(errorMessages).filter(
            (entry) => entry === undefined || entry.length === 0
          ).length;

          return {
            savedCount,
            errorMessages,
          };
        })
      );
  }

  saveValidatedDemandSingleMcc(
    validatedDemandToWrite: WriteKpiData | null,
    errorInputIdentifiers: Set<string>,
    dryRun: boolean
  ): Observable<string | null> {
    if (!validatedDemandToWrite) {
      return of(translate('validation_of_demand.error.no_data'));
    }

    if (errorInputIdentifiers.size > 0) {
      const dates = [...errorInputIdentifiers.values()].join(', ');

      return of(
        translate(
          `validation_of_demand.${dryRun ? 'check' : 'save'}.error_specific`,
          { dates }
        )
      );
    }

    const body = JSON.stringify(validatedDemandToWrite);
    const params = new HttpParams().set('dryRun', dryRun.toString());

    return this.http
      .post<WriteKpiDataResponse>(this.DEMAND_VALIDATION_API, body, { params })
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
              {
                dates: errorDatesAndCauses,
              }
            );
          }
        }),
        catchError(() =>
          of(translate('validation_of_demand.save.error_unspecific'))
        )
      );
  }

  getForecastInfo(
    customerNumber: string | undefined,
    materialNumber: string | undefined
  ): Observable<ForecastInfo> {
    if (!customerNumber || !materialNumber) {
      // TODO improve error handling here react doesn't handle this
      throw new Error('Customer number and material number must be provided');
    }

    return this.http.get<ForecastInfo>(
      `api/demand-validation/material-infos/${customerNumber}/${materialNumber}`
    );
  }

  getKpiBuckets(kpiDateRanges: KpiDateRanges): Observable<KpiBucket[]> {
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

  getKpiData(
    materialListEntry: MaterialListEntry | undefined,
    kpiDateRanges: KpiDateRanges,
    exceptions: Date[]
  ): Observable<KpiData> {
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
      : undefined;
  }

  createDemandMaterialCustomerDatasource(
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
          }>(this.DEMAND_VALIDATION_CUSTOMER_MATERIAL_LIST_API, request)
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
