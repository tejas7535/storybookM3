import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { tap } from 'rxjs';

import { TranslocoDirective } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { AgGridAngular } from 'ag-grid-angular';
import {
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-enterprise';

import { ChangeHistoryService } from '../../../../feature/sales-planning/change-history.service';
import { serverSideTableDefaultProps } from '../../../../shared/ag-grid/grid-defaults';
import { applyColumnSettings } from '../../../../shared/ag-grid/grid-utils';
import { NoDataOverlayComponent } from '../../../../shared/components/ag-grid/no-data/no-data.component';
import { TableToolbarComponent } from '../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { changeHistoryColumnDefinitions } from './column-definition';
import { ChangeHistoryColumnSettingsService } from './customer-planning-details-change-history-column-settings.service';

type ChangeHistoryColumnDefinitions = ReturnType<
  typeof changeHistoryColumnDefinitions
>[number];

export interface ChangeHistoryModalProps {
  customerNumber: string;
  customerName: string;
}

@Component({
  selector: 'd360-customer-planning-details-change-history-modal',
  imports: [
    AgGridAngular,
    TableToolbarComponent,
    TranslocoDirective,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    CdkDrag,
    CdkDragHandle,
    PushPipe,
  ],
  templateUrl:
    './customer-planning-details-change-history-modal.component.html',
  styleUrl: './customer-planning-details-change-history-modal.component.scss',
})
export class CustomerPlanningDetailsChangeHistoryModalComponent {
  protected readonly agGridLocalizationService: AgGridLocalizationService =
    inject(AgGridLocalizationService);
  protected readonly changeHistoryService: ChangeHistoryService =
    inject(ChangeHistoryService);
  protected readonly noDataOverlayComponent = NoDataOverlayComponent;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly dialogRef: MatDialogRef<CustomerPlanningDetailsChangeHistoryModalComponent> =
    inject(MatDialogRef);

  public readonly data: ChangeHistoryModalProps = inject(MAT_DIALOG_DATA);
  public readonly columnSettingsService: ChangeHistoryColumnSettingsService<
    string,
    ChangeHistoryColumnDefinitions
  > = inject(
    ChangeHistoryColumnSettingsService<string, ChangeHistoryColumnDefinitions>
  );
  protected gridApi: GridApi | null = null;
  protected gridOptions: GridOptions = {
    ...serverSideTableDefaultProps,
  };

  public onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.setServerSideDatasource();

    this.createColumnDefs();
  }

  protected onDataUpdated(): void {
    if (this.gridApi) {
      if (this.gridApi.getDisplayedRowCount() === 0) {
        this.gridApi.showNoRowsOverlay();
      } else {
        this.gridApi.hideOverlay();
      }
    }
  }

  private createColumnDefs(): void {
    this.gridApi?.setGridOption(
      'columnDefs',
      this.columnSettingsService.getDefaultColumns()
    );
    this.columnSettingsService
      .loadColumnSettings$()
      .pipe(
        tap((settings) => {
          if (settings) {
            applyColumnSettings(this.gridApi, settings);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private setServerSideDatasource(): void {
    if (this.gridApi) {
      this.gridApi.setGridOption(
        'serverSideDatasource',
        this.changeHistoryService.createChangeHistoryDatasource(
          this.data.customerNumber
        )
      );
    }
  }

  protected onCancel(): void {
    this.dialogRef.close(null);
  }

  protected onFirstDataRendered(event: FirstDataRenderedEvent): void {
    this.columnSettingsService.applyStoredFilters(event.api);
    this.gridApi.autoSizeAllColumns();
  }
}
