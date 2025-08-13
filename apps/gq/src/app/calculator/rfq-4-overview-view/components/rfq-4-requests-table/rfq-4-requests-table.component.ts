import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Observable } from 'rxjs';

import { RfqRequest } from '@gq/calculator/service/models/get-rfq-requests-response.interface';
import { BaseAgGridComponent } from '@gq/shared/ag-grid/base-component/base-ag-grid.component';
import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import { ColumnUtilityService } from '@gq/shared/ag-grid/services/column-utility.service';
import {
  basicTableStyle,
  disableTableHorizontalScrollbar,
  statusBarStlye,
} from '@gq/shared/constants';
import { PushPipe } from '@ngrx/component';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  FilterChangedEvent,
  GetContextMenuItemsParams,
  GridReadyEvent,
  MenuItemDef,
} from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculatorTab } from '../../models/calculator-tab.enum';
import {
  customViewIdByCalculatorTab,
  RFQ_4_REQUESTS_TABLE_CUSTOM_VIEWS_CONFIG,
  TABLE_KEY,
} from './configs/custom-request-views.config';
import { DEFAULT_COLUMN_DEFS } from './configs/default-column-def.config';
import { Rfq4RequestsColDefService } from './configs/rfq-4-request-col-def-service';
import { Rfq4RequestsFields } from './configs/rfq-4-requests-fields.enum';
import { ROW_SELECTION } from './configs/row-selection.config';
@Component({
  selector: 'gq-rfq-4-requests-table',
  templateUrl: './rfq-4-requests-table.component.html',
  imports: [CommonModule, AgGridAngular, PushPipe, SharedTranslocoModule],
  styles: [basicTableStyle, disableTableHorizontalScrollbar, statusBarStlye],
})
export class Rfq4RequestsTableComponent
  extends BaseAgGridComponent
  implements OnInit, OnDestroy
{
  rowData = input<RfqRequest[]>([]);
  activeTab = input<CalculatorTab>();

  private readonly columnDefService: Rfq4RequestsColDefService = inject(
    Rfq4RequestsColDefService
  );

  private readonly columnUtilityService = inject(ColumnUtilityService);

  readonly TABLE_KEY = TABLE_KEY;
  localeText$: Observable<AgGridLocale> = this.localizationService.locale$;

  columnDefs: ColDef[];

  defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  rowSelection = ROW_SELECTION;

  updateActiveTab = effect(() =>
    this.agGridStateService.setActiveView(this.getActiveView())
  );

  ngOnInit(): void {
    this.columnDefs =
      this.activeTab() === CalculatorTab.OPEN
        ? this.columnDefService.getColDefsForOpenTab()
        : this.columnDefService.getColDefsForNonOpenTab();

    this.agGridStateService.init(
      this.TABLE_KEY,
      RFQ_4_REQUESTS_TABLE_CUSTOM_VIEWS_CONFIG
    );
  }

  onGridReady(event: GridReadyEvent): void {
    super.onGridReady(event);

    // apply filters
    const filterState =
      this.agGridStateService.getColumnFiltersForCurrentView();
    const curFilter = filterState.find(
      (filterVal) => filterVal.actionItemId === this.activeTab()
    );
    event?.api?.setFilterModel?.(curFilter?.filterModels || {});
  }

  onFilterChanged(event: FilterChangedEvent): void {
    const filterModels = event.api.getFilterModel();
    this.agGridStateService.setColumnFilterForCurrentView(
      this.activeTab(),
      filterModels
    );
  }

  getContextMenuItems(
    params: GetContextMenuItemsParams
  ): (string | MenuItemDef)[] {
    let hyperlinkMenuItems: (string | MenuItemDef)[] = [];
    const HYPERLINK_COLUMNS: string[] = [Rfq4RequestsFields.RFQ_ID];

    if (HYPERLINK_COLUMNS.includes(params.column.getColId())) {
      hyperlinkMenuItems = [
        ColumnUtilityService.getOpenInNewTabContextMenuItem(params),
        ColumnUtilityService.getOpenInNewWindowContextMenuItem(params),
      ];
    }

    return [
      this.columnUtilityService.getCopyCellContentContextMenuItem(params),
      ...hyperlinkMenuItems,
    ];
  }

  private getActiveView(): number {
    return customViewIdByCalculatorTab.get(this.activeTab());
  }
}
