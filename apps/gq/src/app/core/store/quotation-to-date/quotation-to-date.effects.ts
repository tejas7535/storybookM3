import { inject, Injectable } from '@angular/core';

import { catchError, map, of, switchMap } from 'rxjs';

import { QuotationToDateActions } from '@gq/core/store/quotation-to-date/quotation-to-date.actions';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

@Injectable()
export class QuotationToDateEffects {
  private readonly actions = inject(Actions);
  private readonly quotationService = inject(QuotationService);

  getQuotationToDate$ = createEffect(() => {
    return this.actions.pipe(
      ofType(QuotationToDateActions.getQuotationToDate),
      switchMap(({ customerId }) =>
        this.quotationService
          .getQuotationToDateForCaseCreation(customerId)
          .pipe(
            map((quotationToDate) =>
              QuotationToDateActions.getQuotationToDateSuccess({
                quotationToDate,
              })
            ),
            catchError((error) =>
              of(
                QuotationToDateActions.getQuotationToDateFailure({
                  errorMessage: error,
                })
              )
            )
          )
      )
    );
  });
}
