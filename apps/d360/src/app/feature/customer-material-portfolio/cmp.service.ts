import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { EMPTY, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { translate } from '@jsverse/transloco';

import { RequestParams } from '../../shared/components/table';
import { MessageType } from '../../shared/models/message-type.enum';
import { PostResult } from '../../shared/utils/error-handling';
import { getErrorMessage } from '../../shared/utils/errors';
import { CriteriaFields } from '../material-customer/model';
import { CMPData } from './cmp-modal-types';
import {
  CfcrActionResponse,
  CMPBulkPhaseInRequest,
  CMPBulkPhaseInResponse,
  CMPMaterialPhaseInResponse,
  CMPResponse,
  CMPSingleSubstitutionResponse,
  CMPWriteRequest,
  CMPWriteResponse,
} from './model';
import { dataToCMPWriteRequest } from './request-helper';

@Injectable({ providedIn: 'root' })
export class CMPService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly CMP_CRITERIA_DATA_API =
    'api/customer-material-portfolio/criteria-fields';
  private readonly CMP_CFCR_ACTION_API =
    'api/customer-material-portfolio/cfcr-action';
  private readonly CMP_BULK_PHASE_IN_API =
    'api/customer-material-portfolio/bulk-phase-in';
  private readonly CMP_DATA_API = 'api/customer-material-portfolio/';

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

  public getCMPData(
    selectionFilters: any,
    params: RequestParams
  ): Observable<CMPResponse> {
    return this.http.post<CMPResponse>(this.CMP_DATA_API, {
      startRow: params.startRow,
      endRow: params.endRow,
      sortModel: params.sortModel,
      selectionFilters,
      columnFilters: params.columnFilters,
    });
  }
}
