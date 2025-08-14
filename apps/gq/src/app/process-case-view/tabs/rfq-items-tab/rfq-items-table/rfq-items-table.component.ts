import { Component, inject, OnInit } from '@angular/core';

import { RfqItemsFacade } from '@gq/core/store/active-case/rfq-items.facade';
import { BaseAgGridComponent } from '@gq/shared/ag-grid/base-component/base-ag-grid.component';
import { ColumnUtilityService } from '@gq/shared/ag-grid/services';
import { basicTableStyle } from '@gq/shared/constants';
import { PushPipe } from '@ngrx/component';
import { AgGridAngular } from 'ag-grid-angular';
import { GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-enterprise';

import { ColumnDefinitionService } from './config/column-definition.service';
import { ROW_SELECTION } from './config/row-selection.config';

@Component({
  selector: 'gq-rfq-items-table',
  imports: [AgGridAngular, PushPipe],
  providers: [ColumnDefinitionService],
  templateUrl: './rfq-items-table.component.html',
  styles: [basicTableStyle],
})
export class RfqItemsTableComponent
  extends BaseAgGridComponent
  implements OnInit
{
  private readonly rfqItemsFacade: RfqItemsFacade = inject(RfqItemsFacade);

  private readonly colDefService: ColumnDefinitionService = inject(
    ColumnDefinitionService
  );
  private readonly columnUtilityService = inject(ColumnUtilityService);

  protected readonly TABLE_KEY = 'rfq-items';

  rowData$ = this.rfqItemsFacade.rfqItems$;

  components = this.colDefService.COMPONENTS;
  gridOptions = this.colDefService.GRID_OPTIONS;
  defaultColDef = this.colDefService.DEFAULT_COL_DEF;
  columnDefs = this.colDefService.COLUMN_DEFS;
  rowSelection = ROW_SELECTION;

  ngOnInit(): void {
    super.ngOnInit();
  }
  getContextMenuItems(
    params: GetContextMenuItemsParams
  ): (string | MenuItemDef)[] {
    return [
      this.columnUtilityService.getCopyCellContentContextMenuItem(params),
    ];
  }
}
