import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { translate } from '@jsverse/transloco';
import {
  IServerSideDatasource,
  IServerSideGetRowsParams,
  SortModelItem,
} from 'ag-grid-community';

import { formatFilterModelForBackend } from '../../shared/ag-grid/grid-filter-model';
import { GlobalSelectionState } from '../../shared/components/global-selection-criteria/global-selection-state.service';
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

@Injectable({
  providedIn: 'root',
})
export class CMPService {
  private readonly CMP_CRITERIA_DATA_API =
    'api/customer-material-portfolio/criteria-fields';
  private readonly CMP_CFCR_ACTION_API =
    'api/customer-material-portfolio/cfcr-action';
  private readonly CMP_SINGLE_SUBSTITUTION_API =
    'api/customer-material-portfolio/single-substitution';
  private readonly CMP_BULK_PHASE_IN_API =
    'api/customer-material-portfolio/bulk-phase-in';
  private readonly CMP_DATA_API = 'api/customer-material-portfolio/';

  private readonly dataFetchedEvent = new Subject<CMPResponse>();
  private readonly fetchErrorEvent = new Subject<any>();

  constructor(private readonly http: HttpClient) {}

  getForecastActionData(
    cmpData: CMPData | null
  ): Observable<CfcrActionResponse> {
    if (
      !cmpData?.customerNumber ||
      !cmpData?.materialNumber ||
      !cmpData?.successorMaterial
    ) {
      return new Observable<CfcrActionResponse>();
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

  getCMPCriteriaData(): Observable<CriteriaFields> {
    // TODO handle error see useSwrErrorNotification --> snackbar should be opened
    return this.http.get<CriteriaFields>(this.CMP_CRITERIA_DATA_API);
  }

  // this method originally from src/domain/customerMaterialPortfolio/saveSubstitution.ts
  saveSubstitution(
    cmpData: CMPData,
    dryRun: boolean,
    confirmation?: boolean
  ): Observable<PostResult<CMPSingleSubstitutionResponse>> {
    const request: CMPWriteRequest = dataToCMPWriteRequest(cmpData);
    let params = new HttpParams().set('dryRun', dryRun.toString());
    if (confirmation !== undefined) {
      params = params.set('addMaterial', confirmation.toString());
    }

    return this.http
      .post<CMPSingleSubstitutionResponse>(
        this.CMP_SINGLE_SUBSTITUTION_API,
        request,
        { params }
      )
      .pipe(
        map((response) => {
          if (response.confirmationNeeded) {
            return {
              overallStatus: 'WARNING',
              overallErrorMsg: translate(
                'customer.material_portfolio.modal.substitution.warning.add_material',
                {}
              ),
              response: [],
            } as PostResult<CMPSingleSubstitutionResponse>;
          }

          return {
            overallStatus: 'SUCCESS',
            overallErrorMsg: null,
            response: [response],
          } as PostResult<CMPSingleSubstitutionResponse>;
        }),
        catchError((error) =>
          of({
            overallStatus: 'ERROR',
            overallErrorMsg: getErrorMessage(error),
            response: [],
          } as PostResult<CMPSingleSubstitutionResponse>)
        )
      );
  }

  // this method originally from src/domain/customerMaterialPortfolio/saveBulkPhaseIn.tsx
  saveBulkPhaseIn(
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
              overallStatus: 'SUCCESS',
              overallErrorMsg: null,
              response: response.materialResults,
            }) as PostResult<CMPMaterialPhaseInResponse>
        ),
        catchError((error) =>
          of({
            overallStatus: 'ERROR',
            overallErrorMsg: getErrorMessage(error),
            response: [],
          } as PostResult<CMPMaterialPhaseInResponse>)
        )
      );
  }

  saveCMPChange(
    cmpData: CMPData,
    dryRun: boolean,
    actionURL: string
  ): Observable<PostResult<CMPWriteResponse>> {
    const request: CMPWriteRequest = dataToCMPWriteRequest(cmpData);
    const params = new HttpParams().set('dryRun', dryRun.toString());
    const url = encodeURI(`api/customer-material-portfolio/${actionURL}`);

    return this.http.post<CMPWriteResponse>(url, request, { params }).pipe(
      map(
        (response) =>
          ({
            overallStatus: 'SUCCESS',
            overallErrorMsg: null,
            response: [response],
          }) as PostResult<CMPWriteResponse>
      ),
      catchError((error) =>
        of({
          overallStatus: 'ERROR',
          overallErrorMsg: getErrorMessage(error),
          response: [],
        } as PostResult<CMPWriteResponse>)
      )
    );
  }

  acceptSubstitution(
    cmpData: CMPData,
    dryRun: boolean
  ): Observable<PostResult<CMPWriteResponse>> {
    return this.saveCMPChange(cmpData, dryRun, 'accept-substitution');
  }

  saveInactive(
    cmpData: CMPData,
    dryRun: boolean
  ): Observable<PostResult<CMPWriteResponse>> {
    return this.saveCMPChange(cmpData, dryRun, 'single-inactivation');
  }

  saveReactivation(
    cmpData: CMPData,
    dryRun: boolean
  ): Observable<PostResult<CMPWriteResponse>> {
    return this.saveCMPChange(cmpData, dryRun, 'single-reactivation');
  }

  saveEdit(
    cmpData: CMPData,
    dryRun: boolean
  ): Observable<PostResult<CMPWriteResponse>> {
    return this.saveCMPChange(cmpData, dryRun, 'update');
  }

  savePhaseIn(
    cmpData: CMPData,
    dryRun: boolean
  ): Observable<PostResult<CMPWriteResponse>> {
    return this.saveCMPChange(cmpData, dryRun, 'single-phase-in');
  }

  savePhaseOut(
    cmpData: CMPData,
    dryRun: boolean
  ): Observable<PostResult<CMPWriteResponse>> {
    return this.saveCMPChange(cmpData, dryRun, 'single-phase-out');
  }

  saveVeto(
    cmpData: CMPData,
    dryRun: boolean
  ): Observable<PostResult<CMPWriteResponse>> {
    return this.saveCMPChange(cmpData, dryRun, 'veto-substitution');
  }

  createCustomerMaterialPortfolioDatasource(
    selectedCustomer: CustomerEntry,
    globalSelectionCriteriaFields: GlobalSelectionState,
    childMaterialsCache: Map<string, CMPEntry[]>
  ): IServerSideDatasource {
    return {
      // SAP returns the head and child materials. However, AGGRid does not support providing both at the same time.
      // Instead, a separate request is made for head material with children. Therefore, we use a small cache here
      // containing the child materials of the first request. After some edit operations, parts of the cache must be
      // invalidated. Therefore, the cache is hold outside the data source.
      getRows: (params) => {
        const { startRow, endRow, sortModel, filterModel, groupKeys } =
          params.request;

        if (groupKeys?.length > 0) {
          this.getRowsForGroup(
            childMaterialsCache,
            groupKeys,
            startRow,
            endRow,
            sortModel,
            selectedCustomer.customerNumber,
            params
          );
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
            },
            error: (error) => {
              params.fail();
              this.fetchErrorEvent.next(error);
            },
          });
        }
      },
    };
  }

  private getRowsForGroup(
    childMaterialsCache: Map<string, CMPEntry[]>,
    groupKeys: string[],
    startRow: number | undefined,
    endRow: number | undefined,
    sortModel: SortModelItem[],
    selectedCustomer: string,
    params: IServerSideGetRowsParams
  ) {
    const headMaterialNumberOfGroup = groupKeys[0];
    if (childMaterialsCache.has(headMaterialNumberOfGroup)) {
      const cachedValue = childMaterialsCache.get(groupKeys[0]);
      const childMaterials = cachedValue ?? [];
      params.success({
        rowData: childMaterials,
        rowCount: childMaterials.length,
      });
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
        },
        error: (error) => {
          params.fail();
          this.fetchErrorEvent.next(error);
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

  getDataFetchedEvent(): Observable<CMPResponse> {
    return this.dataFetchedEvent.asObservable();
  }

  getFetchErrorEvent(): Observable<any> {
    return this.fetchErrorEvent.asObservable();
  }
}
