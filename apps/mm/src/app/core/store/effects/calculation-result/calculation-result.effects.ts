import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ReportParserService } from '@mm/core/services/report-parser/report-parser.service';
import { ResultPageService } from '@mm/home/result-page/result-page.service';
import { Result } from '@mm/shared/models';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import { CalculationResultActions } from '../../actions/calculation-result';
import { CalculationParametersFacade } from '../../facades/calculation-parameters/calculation-parameters.facade';
import { CalculationResult } from '../../models/calculation-result-state.model';

@Injectable()
export class CalculationResultEffects {
  public fetchCalculationResultResourcesLinks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationResultActions.fetchCalculationResultResourcesLinks),
      concatLatestFrom(() => [
        this.calculationParametersFacade.getCalculationParameters$,
      ]),
      switchMap(([_action, previousCalculationParameters]) => {
        if (previousCalculationParameters) {
          /* 
          parameters should be compared here and return cached value if they are the same, so we will save 
          currently there are 2 noticed problems.
            - selected parameters are different from the cached ones but the result is the same ( even selecting the same elements on the UI)
            naming IDMM_RADIAL_CLEARANCE_REDUCTION and IDMM_RADIAL_CLEARANCE_REDUCTION
            - with the third attempt of the same choices there is a crtical issue which breaks the application https://jira.schaeffler.com/browse/UFTABI-8047

            console.log('are parameters the same?');
          console.log(
            JSON.stringify(previousCalculationParameters) ===
              JSON.stringify(_action.formProperties)
          );
          */
        }

        this.calculationParametersFacade.setCalculationParameters(
          _action.formProperties
        );

        return this.resultPageService.getResult(_action.formProperties).pipe(
          map((data: Result) => {
            return CalculationResultActions.fetchCalculationJsonResult({
              jsonReportUrl: data.jsonReportUrl,
            });
          }),
          catchError((_error: HttpErrorResponse) =>
            of(
              CalculationResultActions.fetchCalculationResultResourcesLinksFailure(
                {
                  error: _error.error.detail,
                }
              )
            )
          )
        );
      })
    );
  });

  public fetchCalculationJsonResult$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationResultActions.fetchCalculationJsonResult),
      switchMap((action) => {
        return this.resultPageService.getJsonReport(action.jsonReportUrl).pipe(
          map((data) => {
            const calculationResult: CalculationResult =
              this.reportParserService.parseResponse(data);

            return CalculationResultActions.setCalculationJsonResult({
              result: calculationResult,
            });
          }),
          catchError((_error: HttpErrorResponse) =>
            of(
              CalculationResultActions.fetchCalculationJsonResultFailure({
                error: _error.error.detail,
              })
            )
          )
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly resultPageService: ResultPageService,
    private readonly reportParserService: ReportParserService,
    private readonly calculationParametersFacade: CalculationParametersFacade
  ) {}
}
