import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import { getDefaultColDef } from '../../../../shared/ag-grid/grid-defaults';
import {
  AbstractColumnSettingsService,
  ColumnDefinition,
} from '../../../../shared/services/abstract-column-settings.service';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { changeHistoryColumnDefinitions } from './column-definition';

@Injectable({ providedIn: 'root' })
export class ChangeHistoryColumnSettingsService<
  COLUMN_KEYS extends string,
  COLDEF extends ColumnDefinition<COLUMN_KEYS>,
> extends AbstractColumnSettingsService<COLUMN_KEYS, COLDEF> {
  protected tableName = 'change-history';
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  public constructor(
    httpClient: HttpClient,
    private readonly agGridLocalizationService: AgGridLocalizationService
  ) {
    super(
      httpClient,
      changeHistoryColumnDefinitions(agGridLocalizationService)
    );
    this.refreshColumnSettings$().pipe(takeUntilDestroyed()).subscribe();
  }

  public getDefaultColumns() {
    return changeHistoryColumnDefinitions(this.agGridLocalizationService).map(
      (col) => ({
        ...getDefaultColDef(
          this.translocoLocaleService.getLocale(),
          col.filter,
          col.filterParams
        ),
        title: col.colId,
        key: col.colId,
        colId: col.colId,
        field: col.colId,
        headerName: translate(
          `sales_planning.changeHistory.columnHeadlines.${col.title}`
        ),
        filter: col?.filter ?? null,
        cellRenderer: col.cellRenderer,
        hide: !col.visible,
        sortable: col.sortable,
        sort: col.sort,
        lockVisible: col.alwaysVisible,
        valueFormatter: col.valueFormatter,
        minWidth: col?.minWidth,
        flex: col?.flex,
      })
    );
  }
}
