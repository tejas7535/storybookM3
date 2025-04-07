import { HttpClient, HttpParams } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { map, Observable, of, Subject, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-enterprise';

import { formatFilterModelForBackend } from '../../shared/ag-grid/grid-filter-model';
import { MessageType } from '../../shared/models/message-type.enum';
import { PostResult } from '../../shared/utils/error-handling';
import { getErrorMessage } from '../../shared/utils/errors';
import { GlobalSelectionCriteriaFilters } from '../global-selection/model';
import { IMRRequest, IMRSubstitution, IMRSubstitutionResponse } from './model';
import { dataToIMRSubstitutionRequest } from './request-helper';

@Injectable({
  providedIn: 'root',
})
export class IMRService {
  private readonly IMR_MULTI_SUBSTITUTION_API =
    'api/internal-material-replacement/multi-substitution';
  private readonly IMR_SINGLE_SUBSTITUTION_API =
    'api/internal-material-replacement/single-substitution';
  private readonly IMR_API = 'api/internal-material-replacement';

  private readonly dataFetchedEvent = new Subject<{
    rowData: any[];
    rowCount: number;
  }>();
  private readonly fetchErrorEvent = new Subject<any>();

  private readonly destroyRef = inject(DestroyRef);
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

  public createInternalMaterialReplacementDatasource(
    selectedRegion: string
  ): IServerSideDatasource {
    return {
      getRows: (params: IServerSideGetRowsParams) => {
        const { startRow, endRow, sortModel, filterModel } = params.request;
        const columnFilters = formatFilterModelForBackend(filterModel);

        const selectionFilter: GlobalSelectionCriteriaFilters = {
          region: [selectedRegion],
        };
        const request: IMRRequest = {
          selectionFilters: selectionFilter,
          columnFilters: [columnFilters],
          sortModel,
          startRow: startRow || 0,
          endRow: endRow || 50,
        };

        this.http
          .post<{ rows: any[]; rowCount: number }>(this.IMR_API, request)
          .pipe(
            tap(({ rows, rowCount }) => {
              params.success({ rowData: rows, rowCount });
              this.dataFetchedEvent.next({ rowData: rows, rowCount });
            }),
            catchError((error) => {
              params.fail();
              this.fetchErrorEvent.next(error);

              return of();
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe();
      },
    };
  }

  public getDataFetchedEvent(): Observable<{
    rowData: any[];
    rowCount: number;
  }> {
    return this.dataFetchedEvent.asObservable();
  }
}
