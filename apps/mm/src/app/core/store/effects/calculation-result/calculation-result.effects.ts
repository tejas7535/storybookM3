import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ReportParserService } from '@mm/core/services/report-parser/report-parser.service';
import { ResultPageService } from '@mm/home/result-page/result-page.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { CalculationResultActions } from '../../actions/calculation-result';
import { CalculationResult } from '../../models/calculation-result-state.model';

@Injectable()
export class CalculationResultEffects {
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
    private readonly reportParserService: ReportParserService
  ) {}
}
