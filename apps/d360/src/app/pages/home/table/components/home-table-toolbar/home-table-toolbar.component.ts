import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

import { tap } from 'rxjs';

import { translate, TranslocoModule } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { ColumnApi, GridApi } from 'ag-grid-community';

import { GlobalSelectionUtils } from '../../../../../feature/global-selection/global-selection.utils';
import { MaterialCustomerService } from '../../../../../feature/material-customer/material-customer.service';
import {
  GlobalSelectionState,
  GlobalSelectionStateService,
} from '../../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { DisplayFunctions } from '../../../../../shared/components/inputs/display-functions.utils';
import { MaterialCustomerTableService } from '../../services/material-customer-table.service';
import { ColumnLayoutManagementModalComponent } from '../column-layout-management-modal/column-layout-management-modal.component';
import { LayoutId } from '../column-layout-management-modal/column-layout-management-modal.model';
import { ExportTableDialogComponent } from '../export-table-dialog/export-table-dialog.component';

@Component({
  selector: 'app-home-table-toolbar',
  standalone: true,
  imports: [MatIcon, MatButton, TranslocoModule, MatIconButton, MatDivider],
  templateUrl: './home-table-toolbar.component.html',
  styleUrl: './home-table-toolbar.component.scss',
})
export class HomeTableToolbarComponent implements OnInit {
  resetLayout = input.required<(layoutId: LayoutId) => any>();
  saveLayout = input.required<(layoutId: LayoutId) => any>();
  loadLayout = input.required<(layoutId: LayoutId) => any>();
  globalSelection = input.required<GlobalSelectionState>();
  gridApi = input.required<GridApi>();
  columnApi = input.required<ColumnApi>();

  totalRowCount = signal<number>(0);

  private showFloatingFilter = false;

  protected readonly displayFnText = DisplayFunctions.displayFnText;

  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );

  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  readonly materialCustomerService = inject(MaterialCustomerService);

  readonly dialog = inject(MatDialog);

  readonly materialCustomerTableService = inject(MaterialCustomerTableService);

  readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.materialCustomerTableService
      .getDataFetchedEvent()
      .pipe(
        tap(({ totalRowCount }) => {
          this.totalRowCount.set(totalRowCount);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

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

  openExport() {
    this.dialog.open(ExportTableDialogComponent, {
      data: {
        columnApi: this.columnApi(),
        gridApi: this.gridApi(),
        filter: GlobalSelectionUtils.globalSelectionCriteriaToFilter(
          this.globalSelection()
        ),
        backdrop: false,
      },
    });
  }

  getTotalRowCountText(): string {
    return translate('table.toolbar.material_count', {
      count: this.translocoLocaleService.localizeNumber(
        this.totalRowCount(),
        'decimal'
      ),
    });
  }

  getFilterCountText(): string {
    return translate('table.toolbar.filter_count', {
      count: this.translocoLocaleService.localizeNumber(
        this.getFilterCount(),
        'decimal'
      ),
    });
  }

  openColumnLayoutManagementModal(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    this.dialog.open(ColumnLayoutManagementModalComponent, {
      data: {
        resetLayout: this.resetLayout(),
        saveLayout: this.saveLayout(),
        loadLayout: this.loadLayout(),
      },
      position: {
        top: `${rect.top + 30}px`,
        left: `${rect.left - 280}px`,
      },
    });
  }
}
