import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CustomerDetailsService } from '../../../../process-quotation-case-view/service/customer-details.service';
import { QuotationDetailsService } from '../../../../process-quotation-case-view/service/quotation-details.service';
import {
  customerDetailsRequest,
  customerDetailsFailure,
  customerDetailsSuccess,
  quotationDetailsRequest,
  quotationDetailsFailure,
  quotationDetailsSuccess,
} from '../../actions';

/**
 * Effect class for all tagging related actions which trigger side effects
 */
@Injectable()
export class QuotationEffect {
  /**
   * Get possible values for a form field
   *
   */
  customerDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customerDetailsRequest.type),
      mergeMap((action: any) =>
        this.customerDetailsService.customerDetails(action.customerNumber).pipe(
          map((customerDetails) =>
            customerDetailsSuccess({
              customerDetails,
            })
          ),
          catchError((_e) => of(customerDetailsFailure()))
        )
      )
    )
  );

  /**
   * Get possible values for a form field
   *
   */
  quotationDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(quotationDetailsRequest.type),
      mergeMap((action: any) =>
        this.quotationDetailsService
          .quotationDetails(action.quotationNumber)
          .pipe(
            map((quotationDetails) =>
              quotationDetailsSuccess({
                quotationDetails,
              })
            ),
            catchError((_e) => of(quotationDetailsFailure()))
          )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly customerDetailsService: CustomerDetailsService,
    private readonly quotationDetailsService: QuotationDetailsService
  ) {}
}
