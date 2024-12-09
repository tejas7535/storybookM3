import { HttpClient, HttpContext } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { catchError, Observable, of, switchMap, take } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { formatISO } from 'date-fns';

import {
  DemandValidationFilter,
  demandValidationFilterToStringFilter,
} from '../../../feature/demand-validation/demand-validation-filters';
import { SelectedKpis } from '../../../feature/demand-validation/model';
import { getTranslationsForExport } from '../../../feature/demand-validation/translations';
import { GlobalSelectionUtils } from '../../../feature/global-selection/global-selection.utils';
import { GlobalSelectionStateService } from '../../../shared/components/global-selection-criteria/global-selection-state.service';
import { USE_DEFAULT_HTTP_ERROR_INTERCEPTOR } from '../../../shared/interceptors/http-error.interceptor';
import { DateRange } from '../../../shared/utils/date-range';
import { getErrorMessage } from '../../../shared/utils/errors';
import { SnackbarService } from '../../../shared/utils/service/snackbar.service';
import { StreamSaverService } from '../../../shared/utils/service/stream-saver.service';

@Injectable({
  providedIn: 'root',
})
export class ExportDemandValidationService {
  private readonly http = inject(HttpClient);
  private readonly streamSaverService = inject(StreamSaverService);
  private readonly snackBarService = inject(SnackbarService);
  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );
  private readonly destroyRef = inject(DestroyRef);

  private readonly EXPORT_DEMAND_VALIDATION_API =
    'api/demand-validation/export';

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
      translate('validation_of_demand.export_modal.download_started', {})
    );

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
          range2: filledRange.range2
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
        switchMap((response) =>
          this.streamSaverService.streamResponseToFile(
            'demandValidationExport.xlsx',
            response
          )
        ),
        catchError((error) => {
          this.snackBarService.openSnackBar(getErrorMessage(error));

          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      );
  }
}
