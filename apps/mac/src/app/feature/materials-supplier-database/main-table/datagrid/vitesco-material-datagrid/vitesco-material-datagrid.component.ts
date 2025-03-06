import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { filter, takeUntil } from 'rxjs';

import { AgGridModule } from 'ag-grid-angular';
import {
  GridApi,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  ServerSideMaterialsRequest,
  VitescoMaterialsResponse,
  VitescoMaterialsResult,
} from '@mac/feature/materials-supplier-database/models';
import { VitescoMaterial } from '@mac/feature/materials-supplier-database/models/data/vitesco-material/vitesco-material.model';
import {
  MsdAgGridConfigService,
  MsdAgGridReadyService,
  MsdAgGridStateService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { QuickFilterFacade } from '@mac/feature/materials-supplier-database/store/facades/quickfilter';

import { BaseDatagridComponent } from '../base-datagrid.component';

@Component({
  selector: 'mac-vitesco-material-datagrid',
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
  templateUrl: './vitesco-material-datagrid.component.html',
})
export class VitescoMaterialDatagridComponent
  extends BaseDatagridComponent
  implements OnInit, OnDestroy
{
  private readonly rowData$ = this.dataFacade.vitescoResult$;
  private params: IServerSideGetRowsParams<VitescoMaterial>;

  public constructor(
    protected readonly dataFacade: DataFacade,
    protected readonly agGridStateService: MsdAgGridStateService,
    protected readonly agGridReadyService: MsdAgGridReadyService,
    protected readonly agGridConfigService: MsdAgGridConfigService,
    protected readonly quickFilterFacade: QuickFilterFacade
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

    this.rowData$
      .pipe(
        takeUntil(this.destroy$),
        filter((result) => !!result)
      )
      .subscribe((result) => {
        if (result.data) {
          const obj = result as VitescoMaterialsResponse;
          const p: VitescoMaterialsResult = {
            rowData: obj.data,
            rowCount: obj.subTotalRows,
          };
          this.params?.success(p);
          this.params = undefined;
        }
      });
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
      getRows: (params: IServerSideGetRowsParams<VitescoMaterial>): void => {
        this.params?.fail();
        this.params = params;
        // fetch new data from request
        this.dataFacade.fetchVitescoMaterials(
          params.request as ServerSideMaterialsRequest
        );
      },
      destroy: () => {
        this.params?.fail();
        this.params = undefined;
      },
    } as IServerSideDatasource;
  }
}
