import { Component, inject, input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

import { TranslocoModule } from '@jsverse/transloco';
import { ColumnApi, GridApi } from 'ag-grid-community';

import { GlobalSelectionUtils } from '../../../../../feature/global-selection/global-selection.utils';
import { MaterialCustomerService } from '../../../../../feature/material-customer/material-customer.service';
import {
  GlobalSelectionState,
  GlobalSelectionStateService,
} from '../../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { SelectableValue } from '../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { FilterDropdownComponent } from '../../../../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import { ExportTableDialogComponent } from '../export-table-dialog/export-table-dialog.component';

export const LAYOUT_IDS = ['1', '2'] as const;
export type LayoutId = (typeof LAYOUT_IDS)[number];

@Component({
  selector: 'app-home-table-toolbar',
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    TranslocoModule,
    MatIconButton,
    FilterDropdownComponent,
    MatDivider,
  ],
  templateUrl: './home-table-toolbar.component.html',
  styleUrl: './home-table-toolbar.component.scss',
})
export class HomeTableToolbarComponent {
  private readonly globalSelectionStateService: GlobalSelectionStateService =
    inject(GlobalSelectionStateService);

  resetLayout = input.required<(layoutId: LayoutId) => any>();
  saveLayout = input.required<(layoutId: LayoutId) => any>();
  loadLayout = input.required<(layoutId: LayoutId) => any>();
  currentLayoutId = input.required<string>();
  globalSelection = input.required<GlobalSelectionState>();
  gridApi = input.required<GridApi>();
  columnApi = input.required<ColumnApi>();

  private showFloatingFilter = false;
  public layoutOptions = false;

  public layoutForm = new FormGroup({
    currentLayout: new FormControl<{ id: LayoutId; text: string } | null>({
      id: '1',
      text: '',
    }),
  });

  constructor(
    public materialCustomerService: MaterialCustomerService,
    private readonly dialog: MatDialog
  ) {}

  onToggleFilter() {
    this.showFloatingFilter = !this.showFloatingFilter;

    const colDefs = this.gridApi().getColumnDefs();
    colDefs.forEach((colDef: any) => {
      colDef.floatingFilter = !colDef.floatingFilter;
    });

    this.gridApi().setColumnDefs(colDefs);
  }

  isExportDisabled() {
    return this.globalSelectionStateService.isEmpty();
  }

  getFilterCount() {
    if (!this.gridApi()) {
      return 0;
    }

    return Object.keys(this.gridApi().getFilterModel()).length;
  }

  toggleLayoutOptions() {
    this.layoutOptions = !this.layoutOptions;
  }

  formatValue(option: SelectableValue) {
    return option.text;
  }

  openExport() {
    this.dialog.open(ExportTableDialogComponent, {
      data: {
        columnApi: this.columnApi(),
        gridApi: this.gridApi(),
        filter: GlobalSelectionUtils.globalSelectionCriteriaToFilter(
          this.globalSelection()
        ),
      },
    });
  }
}
