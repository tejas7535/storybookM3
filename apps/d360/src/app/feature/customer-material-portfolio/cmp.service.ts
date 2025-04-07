import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { EMPTY, map, Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { translate } from '@jsverse/transloco';
import {
  GridApi,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  SortModelItem,
} from 'ag-grid-enterprise';

import { formatFilterModelForBackend } from '../../shared/ag-grid/grid-filter-model';
import { GlobalSelectionState } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { MessageType } from '../../shared/models/message-type.enum';
import { PostResult } from '../../shared/utils/error-handling';
import { getErrorMessage } from '../../shared/utils/errors';
import { GlobalSelectionUtils } from '../global-selection/global-selection.utils';
import { CustomerEntry } from '../global-selection/model';
import { CriteriaFields } from '../material-customer/model';
import { CMPData } from './cmp-modal-types';
import {
  CfcrActionResponse,
  CMPBulkPhaseInRequest,
  CMPBulkPhaseInResponse,
  CMPEntry,
  CMPMaterialPhaseInResponse,
  CMPRequest,
  CMPResponse,
  CMPSingleSubstitutionResponse,
  CMPWriteRequest,
  CMPWriteResponse,
} from './model';
import { dataToCMPWriteRequest } from './request-helper';

interface RowsForGroupData {
  childMaterialsCache: Map<string, CMPEntry[]>;
  groupKeys: string[];
  startRow: number | undefined;
  endRow: number | undefined;
  sortModel: SortModelItem[];
  selectedCustomer: string;
  params: IServerSideGetRowsParams;
  gridApi: GridApi | null;
}

@Injectable({
  providedIn: 'root',
})
export class CMPService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly CMP_CRITERIA_DATA_API =
    'api/customer-material-portfolio/criteria-fields';
  private readonly CMP_CFCR_ACTION_API =
    'api/customer-material-portfolio/cfcr-action';
  private readonly CMP_BULK_PHASE_IN_API =
    'api/customer-material-portfolio/bulk-phase-in';
  private readonly CMP_DATA_API = 'api/customer-material-portfolio/';

  private readonly dataFetchedEvent = new Subject<CMPResponse>();
  private readonly fetchErrorEvent = new Subject<any>();

  public getForecastActionData(
    cmpData: CMPData | null
  ): Observable<CfcrActionResponse> {
    if (
      !cmpData?.customerNumber ||
      !cmpData?.materialNumber ||
      !cmpData?.successorMaterial
    ) {
      return EMPTY;
    }

    const request = {
      customerNumber: cmpData?.customerNumber,
      materialNumber: cmpData?.materialNumber,
      successorMaterial: cmpData?.successorMaterial,
    };

    return this.http.post<CfcrActionResponse>(
      this.CMP_CFCR_ACTION_API,
      request
    );
  }

  public getCMPCriteriaData(): Observable<CriteriaFields> {
    return this.http.get<CriteriaFields>(this.CMP_CRITERIA_DATA_API);
  }

  public saveBulkPhaseIn(
    phaseIn: CMPBulkPhaseInRequest,
    dryRun: boolean
  ): Observable<PostResult<CMPMaterialPhaseInResponse>> {
    const params = new HttpParams().set('dryRun', dryRun.toString());

    return this.http
      .post<CMPBulkPhaseInResponse>(this.CMP_BULK_PHASE_IN_API, phaseIn, {
        params,
      })
      .pipe(
        map(
          (response) =>
            ({
              overallStatus: MessageType.Success,
              overallErrorMsg: null,
              response: response.materialResults,
            }) as PostResult<CMPMaterialPhaseInResponse>
        ),
        catchError((error) =>
          of({
            overallStatus: MessageType.Error,
            overallErrorMsg: getErrorMessage(error),
            response: [],
          } as PostResult<CMPMaterialPhaseInResponse>)
        )
      );
  }

  public saveCMPChange(
    cmpData: CMPData,
    dryRun: boolean,
    actionURL: string | null,
    confirmed?: boolean
  ): Observable<PostResult<CMPWriteResponse>> {
    if (!actionURL) {
      return of({
        overallStatus: MessageType.Error,
        overallErrorMsg: translate('error.unknown'),
        response: [],
      } as PostResult<CMPWriteResponse>);
    }

    const request: CMPWriteRequest = dataToCMPWriteRequest(cmpData);
    let params: Record<string, string> = { dryRun: dryRun.toString() };
    const url = encodeURI(`api/customer-material-portfolio/${actionURL}`);

    if (confirmed) {
      params = {
        ...params,
        addMaterial: confirmed.toString(),
      };
    }

    return this.http.post<CMPWriteResponse>(url, request, { params }).pipe(
      map((response) => {
        if (
          'confirmationNeeded' in response &&
          (response as CMPSingleSubstitutionResponse).confirmationNeeded
        ) {
          return {
            overallStatus: MessageType.Warning,
            overallErrorMsg: translate(
              'customer.material_portfolio.modal.substitution.warning.add_material'
            ),
            response: [response],
          } as PostResult<CMPWriteResponse>;
        }

        return {
          overallStatus: MessageType.Success,
          overallErrorMsg: null,
          response: [response],
        } as PostResult<CMPWriteResponse>;
      }),
      catchError((error) =>
        of({
          overallStatus: MessageType.Error,
          overallErrorMsg: getErrorMessage(error),
          response: [],
        } as PostResult<CMPWriteResponse>)
      )
    );
  }

  public createCustomerMaterialPortfolioDatasource(
    selectedCustomer: CustomerEntry,
    globalSelectionCriteriaFields: GlobalSelectionState,
    childMaterialsCache: Map<string, CMPEntry[]>,
    gridApi: GridApi | null
  ): IServerSideDatasource {
    return {
      // SAP returns the head and child materials. However, AGGRid does not support providing both at the same time.
      // Instead, a separate request is made for head material with children. Therefore, we use a small cache here
      // containing the child materials of the first request. After some edit operations, parts of the cache must be
      // invalidated. Therefore, the cache is hold outside the data source.
      getRows: (params) => {
        gridApi?.setGridOption('loading', true);

        const { startRow, endRow, sortModel, filterModel, groupKeys } =
          params.request;

        // Hint: unfortunately AG-Grid is not supporting to pass a colId to the autoGroupColumnDef for sorting it is
        // always: 'ag-Grid-AutoColumn'.
        // So, if a 'ag-Grid-AutoColumn' is in the sortModel...
        const autoColumn: number = sortModel.findIndex(
          (model) => model.colId === 'ag-Grid-AutoColumn'
        );

        // ...we replace the colId with the autoGroupColumnDef.field.
        if (autoColumn >= 0) {
          sortModel[autoColumn] = {
            ...sortModel[autoColumn],
            colId: params.api.getGridOption('autoGroupColumnDef').field,
          };
        }

        if (groupKeys?.length > 0) {
          this.getRowsForGroup({
            childMaterialsCache,
            groupKeys,
            startRow,
            endRow,
            sortModel,
            selectedCustomer: selectedCustomer.customerNumber,
            params,
            gridApi,
          });
        } else {
          const columnFilters = formatFilterModelForBackend(filterModel);
          const selectionFilters = {
            ...GlobalSelectionUtils.globalSelectionCriteriaToFilter(
              globalSelectionCriteriaFields
            ),
            customerNumber: [selectedCustomer.customerNumber],
          };

          this.fetchData(
            startRow,
            endRow,
            sortModel,
            selectionFilters,
            columnFilters
          ).subscribe({
            next: (data: CMPResponse) => {
              const { childOfHeadMaterial, headMaterials } = data;
              for (const [key, value] of Object.entries(childOfHeadMaterial)) {
                childMaterialsCache.set(key, value);
              }
              params.success({
                rowData: headMaterials.rows,
                rowCount: headMaterials.rowCount,
              });
              this.dataFetchedEvent.next(data);
              gridApi?.redrawRows();
              gridApi?.setGridOption('loading', false);
            },
            error: (error) => {
              params.fail();
              this.fetchErrorEvent.next(error);
              gridApi?.setGridOption('loading', false);
            },
          });
        }
      },
    };
  }

  private getRowsForGroup({
    childMaterialsCache,
    groupKeys,
    startRow,
    endRow,
    sortModel,
    selectedCustomer,
    params,
    gridApi,
  }: RowsForGroupData): void {
    const headMaterialNumberOfGroup = groupKeys[0];
    if (childMaterialsCache.has(headMaterialNumberOfGroup)) {
      const cachedValue = childMaterialsCache.get(groupKeys[0]);
      const childMaterials = cachedValue ?? [];
      params.success({
        rowData: childMaterials,
        rowCount: childMaterials.length,
      });

      gridApi?.setGridOption('loading', false);
    } else {
      this.fetchData(
        startRow || 0,
        endRow || 500,
        sortModel,
        {
          customerNumber: [selectedCustomer],
          materialNumber: [groupKeys[0]],
        },
        {}
      ).subscribe({
        next: (data) => {
          const { childOfHeadMaterial } = data;
          for (const [key, value] of Object.entries(childOfHeadMaterial)) {
            childMaterialsCache.set(key, value);
          }
          const cachedValue = childMaterialsCache.get(
            headMaterialNumberOfGroup
          );
          const childMaterials = cachedValue ?? [];
          params.success({
            rowData: childMaterials,
            rowCount: childMaterials.length,
          });
          this.dataFetchedEvent.next(data);

          gridApi?.setGridOption('loading', false);
        },
        error: (error) => {
          params.fail();
          this.fetchErrorEvent.next(error);

          gridApi?.setGridOption('loading', false);
        },
      });
    }
  }

  private fetchData(
    startRow: number | undefined,
    endRow: number | undefined,
    sortModel: SortModelItem[],
    selectionFilters: any,
    columnFilters: Record<string, any>
  ): Observable<CMPResponse> {
    const request: CMPRequest = {
      startRow,
      endRow,
      sortModel,
      selectionFilters,
      columnFilters: [columnFilters].filter(
        (x: Record<string, any>) => x && Object.keys(x).length > 0
      ),
    };

    return this.http.post<CMPResponse>(this.CMP_DATA_API, request);
  }

  public getDataFetchedEvent(): Observable<CMPResponse> {
    return this.dataFetchedEvent.asObservable();
  }

  public getFetchErrorEvent(): Observable<any> {
    return this.fetchErrorEvent.asObservable();
  }
}
