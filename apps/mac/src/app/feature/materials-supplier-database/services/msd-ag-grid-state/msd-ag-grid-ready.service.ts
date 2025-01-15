import { Injectable } from '@angular/core';

import { BehaviorSubject, filter } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { GridApi, IServerSideGetRowsParams } from 'ag-grid-community';

import {
  SAPMaterialsRequest,
  SAPMaterialsResponse,
  SAPMaterialsResult,
} from '@mac/msd/models';
import { DataFacade } from '@mac/msd/store/facades/data';

@Injectable({
  providedIn: 'root',
})
// service to access ag Grid API
export class MsdAgGridReadyService {
  public agGridApi$ = new BehaviorSubject<{
    gridApi: GridApi;
  }>(undefined);

  private readonly serverSideParamsStore = new Map<
    number,
    IServerSideGetRowsParams
  >();
  private readonly sapResult$ = this.dataFacade.sapResult$;
  private readonly delayConfiguration: number[] = [5, 10, 20];

  constructor(private readonly dataFacade: DataFacade) {
    this.sapResult$
      .pipe(filter((result) => this.serverSideParamsStore.size > 0 && !!result))
      .subscribe((result) => {
        const serverSideParams = this.serverSideParamsStore.get(
          result.startRow
        );
        if (!serverSideParams) {
          // nothing to do
        } else if (result.data) {
          this.paramSuccess(serverSideParams, result as SAPMaterialsResponse);
        } else {
          this.paramFailure(
            serverSideParams,
            result.errorCode,
            result.retryCount
          );
        }
      });
  }

  // needs to be run by agGrid component
  public agGridApiready(gridApi: GridApi) {
    this.agGridApi$.next({ gridApi });
  }

  public setParams(params: IServerSideGetRowsParams) {
    this.serverSideParamsStore.set(params.request.startRow, params);
    this.dataFacade.fetchSAPMaterials(params.request as SAPMaterialsRequest);
  }

  public unsetParams() {
    this.serverSideParamsStore.clear();
  }

  private paramSuccess(
    serverSideParams: IServerSideGetRowsParams,
    { data, subTotalRows }: SAPMaterialsResponse
  ) {
    const params: SAPMaterialsResult = {
      rowData: data,
      rowCount: subTotalRows,
    };
    serverSideParams.success(params);
    this.serverSideParamsStore.delete(serverSideParams.request.startRow);
  }

  private paramFailure(
    serverSideParams: IServerSideGetRowsParams,
    errorCode: number,
    retryCount: number
  ) {
    // copy request to avoid mutation
    const request = { ...serverSideParams.request } as SAPMaterialsRequest;
    if (errorCode === 0 && retryCount < this.delayConfiguration.length) {
      // error code 0 is mostly caused by a gateway timeout - make a retry
      const seconds = this.delayConfiguration[retryCount];
      request.retryCount = retryCount + 1;
      const message = translate(
        'materialsSupplierDatabase.loading.snackbar.failedDataLoad',
        {
          retryCount: request.retryCount,
          seconds,
        }
      );
      this.dataFacade.errorSnackBar(message);
      setTimeout(
        () => this.dataFacade.fetchSAPMaterials(request),
        seconds * 1000
      );
    } else {
      // other error codes just fail
      serverSideParams.fail();
      this.serverSideParamsStore.delete(request.startRow);
      const message = translate(
        'materialsSupplierDatabase.loading.snackbar.failedDataLoadFinal'
      );
      this.dataFacade.errorSnackBar(message);
    }
  }
}
