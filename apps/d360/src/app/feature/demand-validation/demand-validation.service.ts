/* eslint-disable max-lines */
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { catchError, map, Observable, of, switchMap, take } from 'rxjs';

import { translate, TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { format, formatISO, parse } from 'date-fns';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { GlobalSelectionStateService } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import {
  BackendTableResponse,
  RequestParams,
} from '../../shared/components/table';
import { AUTO_CONFIGURE_APPLICATION_JSON_HEADER } from '../../shared/interceptors/headers.interceptor';
import { USE_DEFAULT_HTTP_ERROR_INTERCEPTOR } from '../../shared/interceptors/http-error.interceptor';
import {
  MessageType,
  MessageTypes,
} from '../../shared/models/message-type.enum';
import { DateRange, DateRangePeriod } from '../../shared/utils/date-range';
import {
  errorsFromSAPtoMessage,
  PostResult,
  ResultMessage,
} from '../../shared/utils/error-handling';
import { getErrorMessage } from '../../shared/utils/errors';
import { strictlyParseLocalFloat } from '../../shared/utils/number';
import { SnackbarService } from '../../shared/utils/service/snackbar.service';
import { StreamSaverService } from '../../shared/utils/service/stream-saver.service';
import { ValidationHelper } from '../../shared/utils/validation/validation-helper';
import { GlobalSelectionUtils } from '../global-selection/global-selection.utils';
import {
  DemandValidationFilter,
  demandValidationFilterToStringFilter,
} from './demand-validation-filters';
import {
  BucketRequest,
  DeleteKpiDataRequest,
  DeleteKpiDataResponse,
  DemandValidationBatch,
  DemandValidationBatchResponse,
  KpiBucket,
  KpiBucketType,
  KpiBucketTypeEnum,
  KpiData,
  KpiDataRequest,
  KpiDateRanges,
  KpiType,
  MaterialListEntry,
  MaterialType,
  MultiType,
  MultiTypes,
  SelectedKpis,
  WriteKpiData,
  WriteKpiDataResponse,
} from './model';
import { getTranslationsForExport } from './translations';

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
  private readonly EXPORT_DEMAND_VALIDATION_API =
    'api/demand-validation/export';

  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translocoService = inject(TranslocoService);
  private readonly streamSaverService = inject(StreamSaverService);
  private readonly snackBarService = inject(SnackbarService);
  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );
  private readonly appInsights = inject(ApplicationInsightsService);

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
    materialType: MaterialType,
    listOrGrid: MultiTypes = MultiType.Grid
  ): Observable<PostResult<DemandValidationBatchResponse>> {
    const writeKpiData: WriteKpiData[] = data.map((entry) => ({
      ids: [entry.id],
      customerNumber,
      materialNumber: entry.material,
      kpiEntries: entry?.kpiEntries ?? [
        {
          idx: entry.id ? Number.parseInt(entry.id, 10) : undefined,
          fromDate: format(
            parse(
              entry.dateString,
              ValidationHelper.getDateFormat(),
              new Date()
            ),
            'yyyy-MM-dd'
          ),
          bucketType: (entry.periodType === 'month'
            ? KpiBucketTypeEnum.MONTH
            : KpiBucketTypeEnum.WEEK) as KpiBucketType,
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

          const getMessages = (
            row: WriteKpiDataResponse,
            type: MessageTypes
          ): (ResultMessage & { id?: number })[] =>
            row.results
              .map((entry) => ({
                ...entry.result,
                id: entry.idx,
              }))
              .filter((result) => result.messageType === type);

          if (listOrGrid === MultiType.Grid) {
            // TODO: add a generic way to parse ID and IDX in Error Messages.
            response.forEach((entry) => {
              if (entry.ids) {
                entry.ids.forEach((id) => {
                  const errors: (ResultMessage & { id?: number })[] =
                    getMessages(entry, MessageType.Error);
                  const successes: (ResultMessage & { id?: number })[] =
                    getMessages(entry, MessageType.Success);

                  batchResponse.push({
                    id,
                    customerNumber: entry.customerNumber,
                    materialNumber: entry.materialNumber,
                    // TODO: Only fill one error message for now, as we can only handle one error message per row
                    // the entire functionality will be refactored in the future and we get a better allocation from
                    // error message and the row
                    hasMultipleEntries:
                      (errors?.length ?? 0) + (successes?.length ?? 0) > 1,
                    countErrors: errors.length,
                    countSuccesses: successes.length,
                    result:
                      errors?.length > 0 || successes?.length > 0
                        ? // Take the first error message
                          (errors?.[0] ??
                          // Or use the first success message
                          successes?.[0])
                        : null,
                    allErrors:
                      errors?.length > 0 || successes?.length > 0
                        ? errors
                        : null,
                  });
                });
              }
            });
          } else {
            response.forEach((combinedRows) => {
              batchResponse.push(
                ...combinedRows.results.map((result) => ({
                  id: String(result.idx),
                  customerNumber: combinedRows.customerNumber,
                  materialNumber: combinedRows.materialNumber,
                  result: result.result,
                }))
              );
            });
          }

          return {
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: batchResponse,
          } as PostResult<DemandValidationBatchResponse>;
        }),
        catchError((error) =>
          of({
            overallStatus: MessageType.Error,
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
            result.results.every(
              (res) => res.result.messageType === MessageType.Success
            )
          ) {
            return null; // no error, success!
          } else {
            const errorDatesAndCauses = result.results
              .map((val) =>
                val.result.messageType === MessageType.Error
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
      range2:
        kpiDateRanges.range2 &&
        // it's only possible to have a range2 if the period is weekly
        kpiDateRanges.range1.period === DateRangePeriod.Weekly
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
              [KpiType.ActiveAndPredecessor]: true,
              [KpiType.Deliveries]: true,
              [KpiType.FirmBusiness]: true,
              [KpiType.Opportunities]: true,
              [KpiType.ForecastProposal]: true,
              [KpiType.ForecastProposalDemandPlanner]: true,
              [KpiType.ValidatedForecast]: true,
              [KpiType.DemandRelevantSales]: true,
              [KpiType.OnTopOrder]: true,
              [KpiType.OnTopCapacityForecast]: true,
              [KpiType.SalesAmbition]: true,
              [KpiType.SalesPlan]: true,
              [KpiType.ConfirmedDeliveries]: true,
              [KpiType.ConfirmedFirmBusiness]: true,
              [KpiType.ConfirmedDemandRelevantSales]: true,
              [KpiType.ConfirmedOnTopOrder]: true,
              [KpiType.ConfirmedOnTopCapacityForecast]: true,
              [KpiType.ConfirmedSalesAmbition]: true,
              [KpiType.ConfirmedSalesPlan]: true,
              [KpiType.ConfirmedOpportunities]: true,
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
            range2:
              kpiDateRanges.range2 &&
              // it's only possible to have a range2 if the period is weekly
              kpiDateRanges.range1.period === DateRangePeriod.Weekly
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

  public getMaterialCustomerData(
    selectionFilters: any,
    params: RequestParams
  ): Observable<BackendTableResponse> {
    return this.http.post<{
      rows: any[];
      rowCount: number;
    }>(
      this.DEMAND_VALIDATION_CUSTOMER_MATERIAL_LIST_API,
      {
        startRow: params.startRow,
        endRow: params.endRow,
        sortModel: params.sortModel,
        selectionFilters,
        columnFilters: params.columnFilters,
      },
      {
        params: new HttpParams().set(
          'language',
          this.translocoService.getActiveLang()
        ),
      }
    );
  }

  public triggerExport(
    selectedKpis: SelectedKpis,
    filledRange: { range1: DateRange; range2?: DateRange } | undefined,
    demandValidationFilters: DemandValidationFilter
  ): Observable<void> {
    const dataFilters = {
      columnFilters: [] as any[],
      selectionFilters: {
        ...GlobalSelectionUtils.globalSelectionCriteriaToFilter(
          this.globalSelectionStateService.getState()
        ),
        ...demandValidationFilterToStringFilter(demandValidationFilters),
      },
    };

    this.snackBarService.openSnackBar(
      translate('validation_of_demand.export_modal.download_started')
    );

    this.appInsights.logEvent('[Validated Sales Planning] Export Data');

    return this.http
      .post(
        this.EXPORT_DEMAND_VALIDATION_API,
        {
          dataFilters,
          selectedKpis,
          range1: {
            from: formatISO(filledRange.range1.from, {
              representation: 'date',
            }),
            to: formatISO(filledRange.range1.to, { representation: 'date' }),
            period: filledRange.range1.period,
          },
          range2:
            filledRange.range2 &&
            // it's only possible to have a range2 if the period is weekly
            filledRange.range1.period === DateRangePeriod.Weekly
              ? {
                  from: formatISO(filledRange.range2.from, {
                    representation: 'date',
                  }),
                  to: formatISO(filledRange.range2.to, {
                    representation: 'date',
                  }),
                  period: filledRange.range2.period,
                }
              : undefined,
          translations: getTranslationsForExport(
            selectedKpis.activeAndPredecessor,
            this.translocoLocaleService.getLocale()
          ),
        },
        {
          responseType: 'blob',
          observe: 'response',
          context: new HttpContext().set(
            USE_DEFAULT_HTTP_ERROR_INTERCEPTOR,
            false
          ),
        }
      )
      .pipe(
        take(1),
        switchMap((response) => {
          this.streamSaverService.streamResponseToFile(
            'demandValidationExport.xlsx',
            response
          );
          this.appInsights.logEvent(
            '[Validated Sales Planning] Export Data Success'
          );

          return of(null);
        }),
        catchError((error) => {
          this.snackBarService.openSnackBar(getErrorMessage(error));

          this.appInsights.logEvent(
            '[Validated Sales Planning] Export Data Failure'
          );

          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      );
  }
}
