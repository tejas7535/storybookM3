import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  OutputEmitterRef,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-enterprise';

import { IMRService } from '../../../../feature/internal-material-replacement/imr.service';
import { IMRSubstitution } from '../../../../feature/internal-material-replacement/model';
import {
  getDefaultColDef,
  serverSideTableDefaultProps,
  sideBar,
} from '../../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { TableToolbarComponent } from '../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { InternalMaterialReplacementSingleDeleteModalComponent } from '../../components/modals/internal-material-replacement-single-delete-modal/internal-material-replacement-single-delete-modal.component';
import { InternalMaterialReplacementSingleSubstitutionModalComponent } from '../../components/modals/internal-material-replacement-single-substitution-modal/internal-material-replacement-single-substitution-modal.component';
import { DateFilterComponent } from './../../../../shared/components/ag-grid/filters/mat-date-filter/date-filter.component';
import { NoDataOverlayComponent } from './../../../../shared/components/ag-grid/no-data/no-data.component';
import { getIMRColumnDefinitions } from './column-definitions';

@Component({
  selector: 'd360-internal-material-replacement-table',
  standalone: true,
  imports: [CommonModule, AgGridModule, TableToolbarComponent],
  templateUrl: './internal-material-replacement-table.component.html',
  styleUrl: './internal-material-replacement-table.component.scss',
})
export class InternalMaterialReplacementTableComponent {
  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  readonly selectedRegion = input.required<string>();

  public gridApi: GridApi;

  public getApi: OutputEmitterRef<GridApi> = output();

  protected readonly isGridAutoSized = signal(false);
  protected readonly rowCount = signal(0);

  protected readonly destroyRef = inject(DestroyRef);

  protected components: Record<string, any> = {
    agDateInput: DateFilterComponent,
  };

  public constructor(
    protected readonly imrService: IMRService,
    protected readonly dialog: MatDialog,
    protected readonly agGridLocalizationService: AgGridLocalizationService
  ) {
    effect(
      () => {
        this.setServerSideDatasource(this.selectedRegion());
      },
      { allowSignalWrites: true }
    );
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.getApi.emit(event.api);

    this.setServerSideDatasource(this.selectedRegion());
    if (this.gridApi) {
      this.updateColumnDefs();

      this.imrService
        .getDataFetchedEvent()
        .pipe(
          tap((value) => {
            this.rowCount.set(value.rowCount);
            if (this.rowCount() === 0) {
              this.gridApi.showNoRowsOverlay();
            } else {
              this.gridApi.hideOverlay();
            }
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();

      this.imrService
        .getDataFetchedEvent()
        .pipe(
          tap((_) => {
            if (!this.isGridAutoSized()) {
              this.isGridAutoSized.set(true);
              this.gridApi?.autoSizeAllColumns();
            }
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  setServerSideDatasource(selectedRegion: string) {
    this.rowCount.set(0);
    this.gridApi?.setGridOption(
      'serverSideDatasource',
      this.imrService.createInternalMaterialReplacementDatasource(
        selectedRegion
      )
    );
  }

  /**
   * The table context to pass the getMenu method used in ActionsMenuCellRendererComponent.
   *
   * @protected
   * @type {Record<string, any>}
   * @memberof AlertRuleTableComponent
   */
  protected context: Record<string, any> = {
    getMenu: (params: ICellRendererParams<any, IMRSubstitution>) => [
      {
        text: translate('button.edit'),
        onClick: () => this.edit(params),
      },
      {
        text: translate('button.delete'),
        onClick: () => this.delete(params),
      },
    ],
  };

  private updateColumnDefs(): void {
    this.gridApi?.setGridOption('columnDefs', [
      ...(getIMRColumnDefinitions(this.agGridLocalizationService).map(
        (col) => ({
          ...getDefaultColDef(
            this.translocoLocaleService.getLocale(),
            col.filter,
            col.filterParams
          ),
          colId: col.property,
          field: col.property,
          headerName: translate(col.colId),
          sortable: true,
          filter: col.filter,
          valueFormatter: col.valueFormatter,
          cellRenderer: col.cellRenderer,
          tooltipComponent: col.tooltipComponent,
          tooltipField: col.tooltipField,
        })
      ) || []),
      {
        cellClass: ['fixed-action-column'],
        field: 'menu',
        headerName: '',
        cellRenderer: ActionsMenuCellRendererComponent,
        lockVisible: true,
        pinned: 'right',
        lockPinned: true,
        suppressHeaderMenuButton: true,
        maxWidth: 64,
        suppressSizeToFit: true,
      },
    ] as ColDef[]);
  }

  edit(params: ICellRendererParams<any, IMRSubstitution>) {
    this.dialog
      .open(InternalMaterialReplacementSingleSubstitutionModalComponent, {
        data: {
          substitution: params.data,
          isNewSubstitution: false,
          gridApi: params.api,
        },
        panelClass: ['form-dialog', 'internal-material-replacement'],
        disableClose: true,
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        take(1),
        tap(({ reloadData, redefinedSubstitution }) => {
          if (reloadData) {
            this.gridApi.applyServerSideTransaction({
              update: [redefinedSubstitution],
            });
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  delete(params: ICellRendererParams<any, IMRSubstitution>) {
    this.dialog
      .open(InternalMaterialReplacementSingleDeleteModalComponent, {
        data: params.data,
        autoFocus: false,
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        take(1),
        tap((reloadData) => {
          if (reloadData) {
            params.api.applyServerSideTransaction({
              remove: [params.data],
            });
            this.rowCount.update((count) => count - 1);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected gridOptions: GridOptions = {
    ...serverSideTableDefaultProps,
    sideBar,
  };

  protected getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    const data = params.data;

    // those five values are defined as the entity key in SAP and uniquely identify a row as they can't be changed
    return `${data.customerNumber ?? ''}-${data.predecessorMaterial ?? ''}-${data.region ?? ''}-${data.salesArea ?? ''}-${data.salesOrg ?? ''}`;
  };

  protected readonly noDataOverlayComponent = NoDataOverlayComponent;

  onFirstDataRendered($event: FirstDataRenderedEvent) {
    $event.api.autoSizeAllColumns();
  }
}
