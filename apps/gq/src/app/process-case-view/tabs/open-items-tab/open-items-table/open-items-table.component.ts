import { Component, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { OpenItemsFacade } from '@gq/core/store/active-case/open-items.facade';
import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import {
  ColumnUtilityService,
  LocalizationService,
} from '@gq/shared/ag-grid/services';
import { basicTableStyle } from '@gq/shared/constants';
import { PushPipe } from '@ngrx/component';
import { AgGridAngular } from 'ag-grid-angular';
import { GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-enterprise';

import { ColumnDefinitionService } from './config/column-definition.service';
import { ROW_SELECTION } from './config/row-selection.config';

@Component({
  selector: 'gq-open-items-table',
  imports: [AgGridAngular, PushPipe],
  providers: [ColumnDefinitionService],
  templateUrl: './open-items-table.component.html',
  styles: [basicTableStyle],
})
export class OpenItemsTableComponent {
  protected localizationService: LocalizationService =
    inject(LocalizationService);
  private readonly openItemsFacade: OpenItemsFacade = inject(OpenItemsFacade);

  private readonly colDefService: ColumnDefinitionService = inject(
    ColumnDefinitionService
  );
  private readonly columnUtilityService = inject(ColumnUtilityService);

  localeText$: Observable<AgGridLocale> = this.localizationService.locale$;
  rowData$ = this.openItemsFacade.openItems$;

  components = this.colDefService.COMPONENTS;
  gridOptions = this.colDefService.GRID_OPTIONS;
  defaultColDef = this.colDefService.DEFAULT_COL_DEF;
  columnDefs = this.colDefService.COLUMN_DEFS;
  rowSelection = ROW_SELECTION;

  getContextMenuItems(
    params: GetContextMenuItemsParams
  ): (string | MenuItemDef)[] {
    return [
      this.columnUtilityService.getCopyCellContentContextMenuItem(params),
    ];
  }
}
