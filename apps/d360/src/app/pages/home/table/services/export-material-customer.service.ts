import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, EMPTY, Observable, of, switchMap, take } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { ColumnApi, GridApi } from 'ag-grid-community';

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
  private readonly snackBarService = inject(SnackbarService);

  private readonly EXPORT_MATERIAL_CUSTOMER_API =
    'api/material-customer/export';

  private readonly customErrorMessages: CustomErrorMessages = {
    'material_customer.export.max_count_exceeded': (detail) =>
      translate('material_customer.export.max_count_exceeded', {
        max_count: detail.values?.max_export_count,
      }),
  };

  public triggerExport(
    gridApi: GridApi,
    columnApi: ColumnApi,
    globalSelectionFilters: GlobalSelectionCriteriaFilters
  ): Observable<void> {
    if (!gridApi || !columnApi || !globalSelectionFilters) {
      return EMPTY;
    }

    const columnFilters = [
      formatFilterModelForBackend(gridApi.getFilterModel()),
    ];

    const columnState = columnApi.getColumnState();

    const sortModel = columnState
      .map((c) => ({ colId: c.colId, sort: c.sort }))
      .filter((f) => f.sort != null);

    const filteredRequest = {
      startRow: 0,
      endRow: 1,
      sortModel,
      selectionFilters: globalSelectionFilters,
      columnFilters,
    };

    this.snackBarService.openSnackBar(
      translate('material_customer.export.download_started')
    );

    // we will just export the visible columns
    // technical columns (starting with an _) will also be excluded
    const exportColIds: ColId[] = columnState
      .filter((state) => !state.hide && !state.colId.startsWith('_'))
      .map((state) => state.colId as ColId);

    return this.http
      .post(
        this.EXPORT_MATERIAL_CUSTOMER_API,
        {
          filteredRequest,
          columns: exportColIds,
          translations: {
            ...Object.fromEntries(
              exportColIds.map((colId) => [
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
        switchMap((response) =>
          this.streamSaverService.streamResponseToFile('export.xlsx', response)
        ),
        catchError((error) => {
          const errorMessage = translate('material_customer.export.failed', {
            reason: getErrorMessage(error, this.customErrorMessages),
          });

          this.snackBarService.openSnackBar(errorMessage);

          return of(null);
        })
      );
  }
}
