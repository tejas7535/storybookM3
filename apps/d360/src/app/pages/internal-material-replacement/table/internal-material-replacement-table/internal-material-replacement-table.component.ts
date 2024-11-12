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
import { AgGridModule, INoRowsOverlayAngularComp } from 'ag-grid-angular';
import {
  ColDef,
  ColumnApi,
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  INoRowsOverlayParams,
} from 'ag-grid-community';

import { IMRService } from '../../../../feature/internal-material-replacement/imr.service';
import { IMRSubstitution } from '../../../../feature/internal-material-replacement/model';
import {
  getDefaultColDef,
  serverSideTableDefaultProps,
  sideBar,
} from '../../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { TableToolbarComponent } from '../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import { DataHintComponent } from '../../../../shared/components/data-hint/data-hint.component';
import { StyledGridSectionComponent } from '../../../../shared/components/styled-grid-section/styled-grid-section.component';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { InternalMaterialReplacementSingleDeleteModalComponent } from '../../components/modals/internal-material-replacement-single-delete-modal/internal-material-replacement-single-delete-modal.component';
import { InternalMaterialReplacementSingleSubstitutionModalComponent } from '../../components/modals/internal-material-replacement-single-substitution-modal/internal-material-replacement-single-substitution-modal.component';
import { getIMRColumnDefinitions } from './column-definitions';

@Component({
  selector: 'd360-no-data-overlay',
  template: ` <d360-data-hint [text]="text"></d360-data-hint>`,
  imports: [DataHintComponent],
  standalone: true,
})
class NoDataOverlayComponent implements INoRowsOverlayAngularComp {
  protected text = translate('hint.noData', {});

  agInit(_: INoRowsOverlayParams): void {}
}

@Component({
  selector: 'd360-internal-material-replacement-table',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    TableToolbarComponent,
    StyledGridSectionComponent,
    NoDataOverlayComponent,
  ],
  templateUrl: './internal-material-replacement-table.component.html',
  styleUrl: './internal-material-replacement-table.component.scss',
})
export class InternalMaterialReplacementTableComponent {
  readonly selectedRegion = input.required<string>();

  public gridApi: GridApi;
  public columnApi: ColumnApi;

  public getApi: OutputEmitterRef<GridApi> = output();

  protected readonly isGridAutoSized = signal(false);
  protected readonly rowCount = signal(0);

  protected readonly destroyRef = inject(DestroyRef);

  constructor(
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
    this.columnApi = event.columnApi;
    this.getApi.emit(event.api);

    this.setServerSideDatasource(this.selectedRegion());
    if (this.gridApi) {
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
              this.columnApi?.autoSizeAllColumns();
            }
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  setServerSideDatasource(selectedRegion: string) {
    this.rowCount.set(0);
    this.gridApi?.setServerSideDatasource(
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

  protected columnDefs = [
    ...(getIMRColumnDefinitions(this.agGridLocalizationService).map((col) => ({
      ...getDefaultColDef(col.filter, col.filterParams),
      colId: col.property,
      field: col.property,
      headerName: translate(col.colId, {}),
      sortable: true,
      filter: col.filter,
      valueFormatter: col.valueFormatter,
      cellRenderer: col.cellRenderer,
      tooltipComponent: col.tooltipComponent,
      tooltipField: col.tooltipField,
    })) || []),
    {
      cellClass: ['fixed-action-column'],
      field: 'menu',
      headerName: '',
      cellRenderer: ActionsMenuCellRendererComponent,
      lockVisible: true,
      pinned: 'right',
      lockPinned: true,
      suppressMenu: true,
      maxWidth: 64,
      suppressSizeToFit: true,
    },
  ] as ColDef[];

  protected gridOptions: GridOptions = {
    ...serverSideTableDefaultProps,
    sideBar,
  };

  protected getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    const data = params.data;

    // those five values are defined as the entity key in SAP and uniquely identify a row as they can't be changed
    return `${data.customerNumber ?? ''}-${data.predecessorMaterial ?? ''}-${data.region ?? ''}-${data.salesArea ?? ''}-${data.salesOrg ?? ''}`;
  };

  protected readonly NoDataOverlayComponent = NoDataOverlayComponent;

  onFirstDataRendered($event: FirstDataRenderedEvent) {
    $event.columnApi.autoSizeAllColumns();
  }
}
