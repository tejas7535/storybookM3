import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  BackendTableResponse,
  RequestParams,
} from '../../shared/components/table';
import { MessageType } from '../../shared/models/message-type.enum';
import { PostResult } from '../../shared/utils/error-handling';
import { getErrorMessage } from '../../shared/utils/errors';
import { IMRSubstitution, IMRSubstitutionResponse } from './model';
import { dataToIMRSubstitutionRequest } from './request-helper';

@Injectable({ providedIn: 'root' })
export class IMRService {
  private readonly IMR_MULTI_SUBSTITUTION_API =
    'api/internal-material-replacement/multi-substitution';
  private readonly IMR_SINGLE_SUBSTITUTION_API =
    'api/internal-material-replacement/single-substitution';
  private readonly IMR_API = 'api/internal-material-replacement';

  private readonly http = inject(HttpClient);

  public saveMultiIMRSubstitution(
    substitutions: IMRSubstitution[],
    dryRun: boolean
  ): Observable<PostResult<IMRSubstitutionResponse>> {
    const request = substitutions.map((sub) =>
      dataToIMRSubstitutionRequest(sub)
    );
    const params = new HttpParams().set('dryRun', dryRun.toString());

    return this.http
      .post<
        IMRSubstitutionResponse[]
      >(this.IMR_MULTI_SUBSTITUTION_API, request, { params })
      .pipe(
        map(
          (response) =>
            ({
              overallStatus: MessageType.Success,
              overallErrorMsg: null,
              response,
            }) as PostResult<IMRSubstitutionResponse>
        ),
        catchError((error) =>
          of({
            overallStatus: MessageType.Error,
            overallErrorMsg: getErrorMessage(error),
            response: [],
          } as PostResult<IMRSubstitutionResponse>)
        )
      );
  }

  public deleteIMRSubstitution(
    substitution: IMRSubstitution,
    dryRun: boolean
  ): Observable<PostResult<IMRSubstitutionResponse>> {
    return this.writeSingleIMRSubstitution(substitution, dryRun, true);
  }

  public saveSingleIMRSubstitution(
    substitution: IMRSubstitution,
    dryRun: boolean
  ): Observable<PostResult<IMRSubstitutionResponse>> {
    return this.writeSingleIMRSubstitution(substitution, dryRun, false);
  }

  private writeSingleIMRSubstitution(
    substitution: IMRSubstitution,
    dryRun: boolean,
    deleteData = false
  ): Observable<PostResult<IMRSubstitutionResponse>> {
    const request = dataToIMRSubstitutionRequest(substitution);
    const action = deleteData ? 'DELETE' : 'POST';
    const params = new HttpParams().set('dryRun', dryRun.toString());

    return this.http
      .request<IMRSubstitutionResponse>(
        action,
        this.IMR_SINGLE_SUBSTITUTION_API,
        { body: request, params }
      )
      .pipe(
        map(
          (response) =>
            ({
              overallStatus: MessageType.Success,
              overallErrorMsg: null,
              response: [response],
            }) as PostResult<IMRSubstitutionResponse>
        ),
        catchError((error) =>
          of({
            overallStatus: MessageType.Error,
            overallErrorMsg: getErrorMessage(error),
            response: [],
          } as PostResult<IMRSubstitutionResponse>)
        )
      );
  }

  public getIMRData(
    selectionFilters: any,
    params: RequestParams
  ): Observable<BackendTableResponse> {
    return this.http.post<BackendTableResponse>(this.IMR_API, {
      startRow: params.startRow,
      endRow: params.endRow,
      sortModel: params.sortModel,
      selectionFilters,
      columnFilters: params.columnFilters,
    });
  }
}
