import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, EMPTY, Observable, of, switchMap, take } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { GridApi } from 'ag-grid-enterprise';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { GlobalSelectionCriteriaFilters } from '../../../../feature/global-selection/model';
import { formatFilterModelForBackend } from '../../../../shared/ag-grid/grid-filter-model';
import { USE_DEFAULT_HTTP_ERROR_INTERCEPTOR } from '../../../../shared/interceptors/http-error.interceptor';
import {
  CustomErrorMessages,
  getErrorMessage,
} from '../../../../shared/utils/errors';
import { SnackbarService } from '../../../../shared/utils/service/snackbar.service';
import { StreamSaverService } from '../../../../shared/utils/service/stream-saver.service';
import { ColId } from '../column-definition';

@Injectable({
  providedIn: 'root',
})
export class ExportMaterialCustomerService {
  private readonly http = inject(HttpClient);
  private readonly streamSaverService = inject(StreamSaverService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly appInsights = inject(ApplicationInsightsService);

  private readonly EXPORT_MATERIAL_CUSTOMER_API =
    'api/material-customer/export';

  private readonly customErrorMessages: CustomErrorMessages = {
    'material_customer.export.maxCountExceeded': (detail) =>
      translate('material_customer.export.maxCountExceeded', {
        max_count: detail.values?.max_count,
      }),
    'material_customer.export.failed': (detail) =>
      translate('material_customer.export.failed', {
        reason: detail.values?.reason,
      }),
  };

  public triggerExport(
    gridApi: GridApi,
    globalSelectionFilters: GlobalSelectionCriteriaFilters
  ): Observable<void> {
    if (!gridApi || !globalSelectionFilters) {
      return EMPTY;
    }

    this.appInsights.logEvent('[Home] Export Field List Data');

    const columnFilters = [
      formatFilterModelForBackend(gridApi.getFilterModel()),
    ];

    const columnState = gridApi.getColumnState();

    const sortModel = columnState
      ?.map((c) => ({ colId: c.colId, sort: c.sort }))
      ?.filter((f) => f.sort != null);

    const filteredRequest = {
      startRow: 0,
      endRow: 1,
      sortModel,
      selectionFilters: globalSelectionFilters,
      columnFilters,
    };

    this.snackbarService.success(
      translate('material_customer.export.downloadStarted')
    );

    // we will just export the visible columns
    // technical columns (starting with an _) will also be excluded
    const exportColIds: ColId[] = columnState
      ?.filter((state) => !state.hide && !state.colId.startsWith('_'))
      ?.map((state) => state.colId as ColId);

    return this.http
      .post(
        this.EXPORT_MATERIAL_CUSTOMER_API,
        {
          filteredRequest,
          columns: exportColIds,
          translations: {
            ...Object.fromEntries(
              (exportColIds || [])?.map((colId) => [
                colId,
                translate(`material_customer.column.${colId}`, {}),
              ])
            ),
            forecastMaintained_true: translate(
              'field.forecastMaintained.value.true',
              {}
            ),
            forecastMaintained_false: translate(
              'field.forecastMaintained.value.false',
              {}
            ),
          },
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
          this.streamSaverService.streamResponseToFile('export.xlsx', response);
          this.appInsights.logEvent('[Home] Export Field List Data Success');

          return of(null);
        }),
        catchError((error) => {
          const errorMessage = translate('material_customer.export.failed', {
            reason: getErrorMessage(error, this.customErrorMessages),
          });

          this.snackbarService.error(errorMessage);
          this.appInsights.logEvent('[Home] Export Field List Data Failure');

          return of(null);
        })
      );
  }
}
