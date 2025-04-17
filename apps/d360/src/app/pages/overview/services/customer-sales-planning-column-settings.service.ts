import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { ColDef } from 'ag-grid-enterprise';

import { getDefaultColDef } from '../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import {
  AbstractColumnSettingsService,
  ColumnDefinition,
} from '../../../shared/services/abstract-column-settings.service';
import { AgGridLocalizationService } from '../../../shared/services/ag-grid-localization.service';
import { getColumnDefs } from '../components/customer-sales-planning-grid/column-definitions';
import { CustomerSalesPlanningLayout } from '../overview.component';

@Injectable({ providedIn: 'root' })
export class CustomerSalesPlanningColumnSettingsService<
  COLUMN_KEYS extends string,
  COLDEF extends ColumnDefinition<COLUMN_KEYS>,
> extends AbstractColumnSettingsService<COLUMN_KEYS, COLDEF> {
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );
  protected tableName = 'customer-sales-planning';

  public constructor(
    httpClient: HttpClient,
    private readonly agGridLocalizationService: AgGridLocalizationService
  ) {
    super(
      httpClient,
      getColumnDefs(
        agGridLocalizationService,
        CustomerSalesPlanningLayout.PreviousToCurrent
      )
    );
    this.refreshColumnSettings$(CustomerSalesPlanningLayout.PreviousToCurrent)
      .pipe(takeUntilDestroyed())
      .subscribe();
  }

  public getColumnDefs(layout: CustomerSalesPlanningLayout) {
    return [
      ...getColumnDefs(this.agGridLocalizationService, layout).map(
        (column) => ({
          ...getDefaultColDef(
            this.translocoLocaleService.getLocale(),
            column.filter,
            column.filterParams
          ),
          ...column,
          headerName: translate(`overview.yourCustomer.grid.${column.colId}`),
          headerTooltip: translate(
            `overview.yourCustomer.grid.${column.colId}`
          ),
        })
      ),
      {
        cellClass: ['fixed-action-column'],
        field: 'menu',
        headerName: '',
        cellRenderer: ActionsMenuCellRendererComponent,
        lockVisible: true,
        lockPinned: true,
        pinned: 'right' as const,
        minWidth: 50,
        maxWidth: 50,
        suppressHeaderMenuButton: true,
        suppressSizeToFit: true,
        sortable: false,
      },
    ] as ColDef[];
  }
}
