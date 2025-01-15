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
import { MatIcon } from '@angular/material/icon';

import { tap } from 'rxjs';

import { translate, TranslocoModule } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { GridApi } from 'ag-grid-enterprise';

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
  selector: 'd360-home-table-toolbar',
  standalone: true,
  imports: [MatIcon, MatButton, TranslocoModule, MatIconButton],
  templateUrl: './home-table-toolbar.component.html',
  styleUrl: './home-table-toolbar.component.scss',
})
export class HomeTableToolbarComponent implements OnInit {
  resetLayout = input.required<(layoutId: LayoutId) => any>();
  saveLayout = input.required<(layoutId: LayoutId) => any>();
  loadLayout = input.required<(layoutId: LayoutId) => any>();
  globalSelection = input.required<GlobalSelectionState>();
  gridApi = input.required<GridApi>();

  protected readonly totalRowCount = signal<number>(0);

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

  public ngOnInit(): void {
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

  protected onToggleFilter(): void {
    this.showFloatingFilter = !this.showFloatingFilter;

    const columnDefs = this.gridApi().getColumnDefs();
    columnDefs.forEach(
      (colDef: any) => (colDef.floatingFilter = !colDef.floatingFilter)
    );

    this.gridApi().setGridOption('columnDefs', columnDefs);
  }

  protected isExportDisabled(): boolean {
    return this.globalSelectionStateService.isEmpty();
  }

  protected getFilterCount(): number {
    if (!this.gridApi()) {
      return 0;
    }

    return Object.keys(this.gridApi().getFilterModel()).length;
  }

  protected openExport(): void {
    this.dialog.open(ExportTableDialogComponent, {
      data: {
        gridApi: this.gridApi(),
        filter: GlobalSelectionUtils.globalSelectionCriteriaToFilter(
          this.globalSelection()
        ),
        backdrop: false,
      },
    });
  }

  protected getTotalRowCountText(): string {
    return translate('table.toolbar.currentCount', {
      count: this.translocoLocaleService.localizeNumber(
        this.totalRowCount(),
        'decimal'
      ),
    });
  }

  protected getFilterCountText(): string {
    return translate('table.toolbar.activeFilterCount', {
      count: this.translocoLocaleService.localizeNumber(
        this.getFilterCount(),
        'decimal'
      ),
    });
  }

  protected onResetFilters(): void {
    this.gridApi()?.setFilterModel(null);
  }

  protected openColumnLayoutManagementModal(event: MouseEvent): void {
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
