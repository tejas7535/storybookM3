import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  catchError,
  map,
  Observable,
  of,
  ReplaySubject,
  share,
  switchMap,
} from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { format, parse } from 'date-fns';

import { USE_DEFAULT_HTTP_ERROR_INTERCEPTOR } from '../../shared/interceptors/http-error.interceptor';
import { PostResult } from '../../shared/utils/error-handling';
import { getErrorMessage } from '../../shared/utils/errors';
import { ValidationHelper } from '../../shared/utils/validation/validation-helper';
import { CurrencyService } from '../info/currency.service';
import {
  AlertRule,
  AlertRuleResponse,
  AlertRuleSaveResponse,
  AlertTypeDescription,
  dataToAlertRuleRequest,
} from './model';

@Injectable({ providedIn: 'root' })
export class AlertRulesService {
  private readonly MULTI_ALERT_RULES_API = 'api/alert-rules/multi-alerts';
  private readonly SINGLE_ALERT_RULES_API = 'api/alert-rules/single-alert';
  private readonly ALERT_RULES_API = 'api/alert-rules';
  private readonly ALERT_TYPE_SET_API = 'api/alert-rules/alert-type-set';

  /**
   * This is the cached Observable that uses a ReplaySubject under the hood.
   *
   * @private
   * @type {Observable<AlertTypeDescription[]>}
   * @memberof AlertRulesService
   */
  private ruleTypeData$: Observable<AlertTypeDescription[]>;

  constructor(
    private readonly http: HttpClient,
    private readonly currencyService: CurrencyService,
    private readonly translocoService: TranslocoService
  ) {}

  /**
   * Read the rule type data only once and then cache the Observable
   *
   * @return {Observable<AlertTypeDescription[]>}
   * @memberof AlertRulesService
   */
  public getRuleTypeData(): Observable<AlertTypeDescription[]> {
    // Cache it once, if ruleTypeData$ is undefined
    if (!this.ruleTypeData$) {
      this.ruleTypeData$ = this.currencyService.getCurrentCurrency().pipe(
        switchMap((currentCurrency) =>
          this.http.get<AlertTypeDescription[]>(this.ALERT_TYPE_SET_API, {
            params: new HttpParams()
              .set('language', this.translocoService.getActiveLang())
              .set('currency', currentCurrency),
          })
        ),
        // this tells RxJS to keep the Observable alive
        share({
          connector: () => new ReplaySubject(1), // this tells RxJS to cache the latest emitted
          resetOnError: true, // do not cache, if there was an error
          resetOnComplete: false,
          resetOnRefCountZero: false,
        })
      );
    }

    return this.ruleTypeData$;
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

    const request = data.map((row) =>
      dataToAlertRuleRequest({
        ...row,
        startDate: this.parse2Date(row.startDate),
        endDate: this.parse2Date(row.endDate),
      })
    );

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

    const request = data.map((row) =>
      dataToAlertRuleRequest({
        ...row,
        startDate: this.parse2Date(row.startDate),
        endDate: this.parse2Date(row.endDate),
      })
    );

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

  private parse2Date(date: Date | null | string): Date | null {
    return date
      ? new Date(
          format(
            parse(String(date), ValidationHelper.getDateFormat(), new Date()),
            'yyyy-MM-dd'
          )
        )
      : null;
  }
}
