import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, Observable, of, shareReplay, switchMap } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { USE_DEFAULT_HTTP_ERROR_INTERCEPTOR } from '../../shared/interceptors/http-error.interceptor';
import { PostResult } from '../../shared/utils/error-handling';
import { getErrorMessage } from '../../shared/utils/errors';
import { CurrencyService } from '../info/currency.service';
import {
  AlertRule,
  AlertRuleResponse,
  AlertRuleSaveResponse,
  AlertTypeDescription,
  dataToAlertRuleRequest,
} from './model';

@Injectable({
  providedIn: 'root',
})
export class AlertRulesService {
  private readonly MULTI_ALERT_RULES_API = 'api/alert-rules/multi-alerts';
  private readonly SINGLE_ALERT_RULES_API = 'api/alert-rules/single-alert';
  private readonly ALERT_RULES_API = 'api/alert-rules';
  private readonly ALERT_TYPE_SET_API = 'api/alert-rules/alert-type-set';

  constructor(
    private readonly http: HttpClient,
    private readonly currencyService: CurrencyService,
    private readonly translocoService: TranslocoService
  ) {}

  // TODO change to BehaviourSubject to avoid multiple requests
  getRuleTypeData(): Observable<AlertTypeDescription[]> {
    return this.currencyService.getCurrentCurrency().pipe(
      switchMap((currentCurrency) => {
        const preferredLanguage = this.translocoService.getActiveLang();
        const params = new HttpParams()
          .set('language', preferredLanguage)
          .set('currency', currentCurrency);

        return this.http.get<AlertTypeDescription[]>(this.ALERT_TYPE_SET_API, {
          params,
        });
      }),
      shareReplay(1)
    );
  }

  getAlertRuleData(): Observable<AlertRuleResponse> {
    return this.currencyService.getCurrentCurrency().pipe(
      switchMap((currentCurrency) => {
        const params = new HttpParams().set('currency', currentCurrency);

        return this.http.get<AlertRuleResponse>(this.ALERT_RULES_API, {
          params,
        });
      })
    );
  }

  saveMultiAlertRules(
    data: AlertRule[],
    dryRun?: boolean
  ): Observable<PostResult<AlertRuleSaveResponse>> {
    if (dryRun) {
      return of({
        overallStatus: 'SUCCESS',
        overallErrorMsg: null,
        response: [] as AlertRuleSaveResponse[],
      });
    }
    const request = data.map((d) => dataToAlertRuleRequest(d));

    return this.http
      .post<
        AlertRuleSaveResponse[]
      >(this.MULTI_ALERT_RULES_API, request, { context: new HttpContext().set(USE_DEFAULT_HTTP_ERROR_INTERCEPTOR, false) })
      .pipe(
        map(
          (response) =>
            ({
              overallStatus: 'SUCCESS',
              overallErrorMsg: null,
              response,
            }) as PostResult<AlertRuleSaveResponse>
        ),
        catchError((error) =>
          of({
            overallStatus: 'ERROR',
            overallErrorMsg: getErrorMessage(error),
            response: [],
          } as PostResult<AlertRuleSaveResponse>)
        )
      );
  }

  deleteMultiAlterRules(
    data: AlertRule[],
    dryRun: boolean
  ): Observable<PostResult<AlertRuleSaveResponse>> {
    if (dryRun) {
      return of({
        overallStatus: 'SUCCESS',
        overallErrorMsg: null,
        response: [] as AlertRuleSaveResponse[],
      });
    }
    const request = data.map((d) => dataToAlertRuleRequest(d));

    return this.http
      .request<AlertRuleSaveResponse[]>('delete', this.MULTI_ALERT_RULES_API, {
        body: request,
        context: new HttpContext().set(
          USE_DEFAULT_HTTP_ERROR_INTERCEPTOR,
          false
        ),
      })
      .pipe(
        map(
          (response) =>
            ({
              overallStatus: 'SUCCESS',
              overallErrorMsg: null,
              response,
            }) as PostResult<AlertRuleSaveResponse>
        ),
        catchError((error) =>
          of({
            overallStatus: 'ERROR',
            overallErrorMsg: getErrorMessage(error),
            response: [],
          } as PostResult<AlertRuleSaveResponse>)
        )
      );
  }

  deleteSingleAlterRule(
    data: AlertRule
  ): Observable<PostResult<AlertRuleSaveResponse>> {
    const request = dataToAlertRuleRequest(data);

    return this.http
      .request<AlertRuleSaveResponse[]>('delete', this.SINGLE_ALERT_RULES_API, {
        body: request,
        context: new HttpContext().set(
          USE_DEFAULT_HTTP_ERROR_INTERCEPTOR,
          false
        ),
      })
      .pipe(
        map(
          (response) =>
            ({
              overallStatus: 'SUCCESS',
              overallErrorMsg: null,
              response,
            }) as PostResult<AlertRuleSaveResponse>
        ),
        catchError((error) =>
          of({
            overallStatus: 'ERROR',
            overallErrorMsg: getErrorMessage(error),
            response: [],
          } as PostResult<AlertRuleSaveResponse>)
        )
      );
  }
}
