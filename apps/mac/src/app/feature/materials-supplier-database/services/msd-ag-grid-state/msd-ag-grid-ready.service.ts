import { Injectable } from '@angular/core';

import { BehaviorSubject, filter } from 'rxjs';

import {
  ColumnApi,
  GridApi,
  IServerSideGetRowsParams,
} from 'ag-grid-enterprise';

import {
  SAPMaterialsRequest,
  SAPMaterialsResponse,
  SAPMaterialsResult,
} from '@mac/msd/models';
import { fetchSAPMaterials } from '@mac/msd/store/actions/data';
import { DataFacade } from '@mac/msd/store/facades/data';

@Injectable({
  providedIn: 'root',
})
// service to access ag Grid API
export class MsdAgGridReadyService {
  public agGridApi$ = new BehaviorSubject<{
    gridApi: GridApi;
    columnApi: ColumnApi;
  }>(undefined);

  private readonly serverSideParamsStore = new Map<
    number,
    IServerSideGetRowsParams
  >();
  private readonly sapResult$ = this.dataFacade.sapResult$;

  constructor(private readonly dataFacade: DataFacade) {
    this.sapResult$
      .pipe(filter((result) => this.serverSideParamsStore.size > 0 && !!result))
      .subscribe((result) => {
        if (!result.data) {
          this.paramFailure(result.startRow);
        } else {
          this.paramSuccess(result as SAPMaterialsResponse, result.startRow);
        }
      });
  }

  // needs to be run by agGrid component
  public agGridApiready(gridApi: GridApi, columnApi: ColumnApi) {
    this.agGridApi$.next({ gridApi, columnApi });
  }

  public setParams(params: IServerSideGetRowsParams) {
    this.serverSideParamsStore.set(params.request.startRow, params);
    this.dataFacade.dispatch(
      fetchSAPMaterials({ request: params.request as SAPMaterialsRequest })
    );
  }

  public unsetParams() {
    this.serverSideParamsStore.clear();
  }

  private paramSuccess(
    { data, subTotalRows }: SAPMaterialsResponse,
    startRow: number
  ) {
    const serverSideParams = this.serverSideParamsStore.get(startRow);
    if (!serverSideParams) {
      return;
    }
    const params: SAPMaterialsResult = {
      rowData: data,
      rowCount: subTotalRows,
    };
    serverSideParams.success(params);
    this.serverSideParamsStore.delete(startRow);
  }

  private paramFailure(startRow: number) {
    const serverSideParams = this.serverSideParamsStore.get(startRow);
    if (!serverSideParams) {
      return;
    }
    serverSideParams.fail();
    this.serverSideParamsStore.delete(startRow);
  }
}
