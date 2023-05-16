import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, take } from 'rxjs';

import { deselectCase, selectCase } from '@gq/core/store/actions';
import { getSelectedCaseIds } from '@gq/core/store/selectors';
import { Store } from '@ngrx/store';
import {
  ColDef,
  GetContextMenuItemsParams,
  GetMainMenuItemsParams,
  GridReadyEvent,
  MenuItemDef,
  RowDoubleClickedEvent,
  RowSelectedEvent,
} from 'ag-grid-community';

import { AppRoutePath } from '../../app-route-path.enum';
import { CaseTableColumnFields } from '../../shared/ag-grid/constants/column-fields.enum';
import { AgGridLocale } from '../../shared/ag-grid/models/ag-grid-locale.interface';
import { AgStatusBar } from '../../shared/ag-grid/models/ag-status-bar.model';
import { ColumnUtilityService } from '../../shared/ag-grid/services/column-utility.service';
import { LocalizationService } from '../../shared/ag-grid/services/localization.service';
import {
  basicTableStyle,
  disableTableHorizontalScrollbar,
  statusBarStlye,
} from '../../shared/constants';
import { QuotationStatus, ViewQuotation } from '../../shared/models/quotation';
import { COMPONENTS, DEFAULT_COLUMN_DEFS } from './config';
import { ColumnDefService } from './config/column-def.service';
@Component({
  selector: 'gq-case-table',
  templateUrl: './case-table.component.html',
  styles: [basicTableStyle, disableTableHorizontalScrollbar, statusBarStlye],
})
export class CaseTableComponent implements OnInit {
  constructor(
    private readonly columnDefService: ColumnDefService,
    private readonly columnUtilityService: ColumnUtilityService,
    private readonly localizationService: LocalizationService,
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  public columnDefs: ColDef[];
  public components = COMPONENTS;
  public localeText$: Observable<AgGridLocale>;
  public selectedRows: number[] = [];

  @Input() rowData: ViewQuotation[];
  @Input() statusBar: AgStatusBar;
  @Input() displayStatus: QuotationStatus;

  ngOnInit(): void {
    this.localeText$ = this.localizationService.locale$;
    this.store
      .select(getSelectedCaseIds)
      .pipe(take(1))
      .subscribe((val) => {
        this.selectedRows = val;
      });
    this.columnDefs = this.columnDefService.COLUMN_DEFS.filter((colDef) =>
      this.columnUtilityService.filterQuotationStatusColumns(
        colDef,
        this.displayStatus
      )
    ).map((colDef) =>
      this.columnUtilityService.mapLastUpdateDateOnColumn(
        colDef,
        this.displayStatus
      )
    );
  }

  onGridReady(event: GridReadyEvent): void {
    event.api.forEachNode((node) => {
      if (this.selectedRows.includes(node.data.gqId)) {
        node.setSelected(true);
      }
    });
  }

  onRowSelected(event: RowSelectedEvent): void {
    if (event.node.isSelected()) {
      this.store.dispatch(selectCase({ gqId: event.node.data.gqId }));
    } else {
      this.store.dispatch(deselectCase({ gqId: event.node.data.gqId }));
    }
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate([AppRoutePath.ProcessCaseViewPath], {
      queryParamsHandling: 'merge',
      queryParams: {
        quotation_number: event.data.gqId,
        customer_number: event.data.customerIdentifiers.customerId,
        sales_org: event.data.customerIdentifiers.salesOrg,
      },
    });
  }

  getMainMenuItems(params: GetMainMenuItemsParams): (string | MenuItemDef)[] {
    const menuItems: (MenuItemDef | string)[] = [...params.defaultItems];
    menuItems.push(
      ColumnUtilityService.getResetAllFilteredColumnsMenuItem(params)
    );

    return menuItems;
  }

  getContextMenuItems(
    params: GetContextMenuItemsParams
  ): (string | MenuItemDef)[] {
    let hyperlinkMenuItems: (string | MenuItemDef)[] = [];
    const HYPERLINK_COLUMNS: string[] = [CaseTableColumnFields.GQ_ID];

    if (HYPERLINK_COLUMNS.includes(params.column.getColId())) {
      hyperlinkMenuItems = [
        ColumnUtilityService.getOpenInNewTabContextMenuItem(params),
        ColumnUtilityService.getOpenInNewWindowContextMenuItem(params),
      ];
    }

    return [
      ColumnUtilityService.getCopyCellContentContextMenuItem(params),
      ...hyperlinkMenuItems,
    ];
  }
}
