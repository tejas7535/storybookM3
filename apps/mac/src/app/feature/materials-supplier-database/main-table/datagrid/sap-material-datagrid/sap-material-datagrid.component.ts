import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { filter, takeUntil } from 'rxjs';

import { AgGridModule } from 'ag-grid-angular';
import {
  ExcelStyle,
  GridApi,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  SAPMaterial,
  SapMaterialsDatabaseUploadStatus,
  SapMaterialsDatabaseUploadStatusResponse,
} from '@mac/feature/materials-supplier-database/models';
import {
  MsdAgGridConfigService,
  MsdAgGridReadyService,
  MsdAgGridStateService,
  MsdDataService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';
import { QuickFilterFacade } from '@mac/feature/materials-supplier-database/store/facades/quickfilter';

import { LoadingCellRendererComponent } from '../../components/loading-cell-renderer/loading-cell-renderer.component';
import { excelStyles } from '../../table-config/materials/sap-materials/sap-excel-styles';
import { BaseDatagridComponent } from '../base-datagrid.component';

@Component({
  selector: 'mac-sap-material-datagrid',
  imports: [
    // ag grid
    AgGridModule,
    // default
    CommonModule,
    // angular material
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    // libs
    SharedTranslocoModule,
  ],
  templateUrl: './sap-material-datagrid.component.html',
})
export class SapMaterialDatagridComponent
  extends BaseDatagridComponent
  implements OnInit, OnDestroy
{
  public readonly DEFAULT_BLOCK_SIZE = 100;
  // loading cell renderer
  public loadingCellRenderer = LoadingCellRendererComponent;
  public serverSideRowData!: SAPMaterial[];
  public excelStyles: ExcelStyle[] = excelStyles;

  public constructor(
    protected readonly dataFacade: DataFacade,
    protected readonly agGridStateService: MsdAgGridStateService,
    protected readonly agGridReadyService: MsdAgGridReadyService,
    protected readonly agGridConfigService: MsdAgGridConfigService,
    protected readonly quickFilterFacade: QuickFilterFacade,
    public readonly dataService: MsdDataService,
    protected readonly dialogFacade: DialogFacade
  ) {
    super(
      dataFacade,
      agGridStateService,
      agGridReadyService,
      agGridConfigService,
      quickFilterFacade
    );
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.reloadDataOnSapMaterialsDatabaseUploadSuccess();
  }

  public onGridReady({ api }: { api: GridApi }): void {
    super.onGridReady({ api });

    api.updateGridOptions({
      serverSideDatasource: this.createServerSideDataSource(),
    });
  }

  protected getCellRendererParams() {
    return {};
  }

  private createServerSideDataSource(): IServerSideDatasource {
    return {
      getRows: (params: IServerSideGetRowsParams<SAPMaterial>): void => {
        this.agGridReadyService.setParams(params);
      },
      destroy: () => {
        this.agGridReadyService.unsetParams();
      },
    } as IServerSideDatasource;
  }

  private reloadDataOnSapMaterialsDatabaseUploadSuccess(): void {
    this.dialogFacade.sapMaterialsDatabaseUploadStatus$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (databaseUploadStatus: SapMaterialsDatabaseUploadStatusResponse) =>
            databaseUploadStatus?.status ===
            SapMaterialsDatabaseUploadStatus.DONE
        )
      )
      .subscribe(() => this.agGridApi.refreshServerSide());
  }
}
