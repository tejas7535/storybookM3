import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, take } from 'rxjs';

import { Store } from '@ngrx/store';
import {
  GridReadyEvent,
  RowDoubleClickedEvent,
  RowSelectedEvent,
} from 'ag-grid-community';

import { AppRoutePath } from '../../app-route-path.enum';
import { deselectCase, getSelectedCaseIds, selectCase } from '../../core/store';
import { AgGridLocale } from '../../shared/ag-grid/models/ag-grid-locale.interface';
import { LocalizationService } from '../../shared/ag-grid/services/localization.service';
import {
  basicTableStyle,
  disableTableHorizontalScrollbar,
  statusBarStlye,
} from '../../shared/constants';
import { ViewQuotation } from '../models/view-quotation.model';
import { COMPONENTS, DEFAULT_COLUMN_DEFS, STATUS_BAR_CONFIG } from './config';
import { ColumnDefService } from './config/column-def.service';
@Component({
  selector: 'gq-case-table',
  templateUrl: './case-table.component.html',
  styles: [basicTableStyle, disableTableHorizontalScrollbar, statusBarStlye],
})
export class CaseTableComponent implements OnInit {
  constructor(
    private readonly columnDefService: ColumnDefService,
    private readonly localizationService: LocalizationService,
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  public columnDefs = this.columnDefService.COLUMN_DEFS;
  public statusBar = STATUS_BAR_CONFIG;
  public components = COMPONENTS;
  public localeText$: Observable<AgGridLocale>;
  public selectedRows: number[] = [];

  @Input() rowData: ViewQuotation[];

  ngOnInit(): void {
    this.localeText$ = this.localizationService.locale$;
    this.store
      .select(getSelectedCaseIds)
      .pipe(take(1))
      .subscribe((val) => {
        this.selectedRows = val;
      });
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
}
