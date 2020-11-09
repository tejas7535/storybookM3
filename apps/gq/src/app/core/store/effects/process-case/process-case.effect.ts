import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { CustomerDetailsService } from '../../../../process-case-view/service/customer-details.service';
import { QuotationDetailsService } from '../../../../process-case-view/service/quotation-details.service';
import {
  createQuotation,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
  selectQuotation,
} from '../../actions';
import { Customer, Quotation, QuotationIdentifier } from '../../models';
import * as fromRouter from '../../reducers';
import { getSelectedQuotationIdentifier } from '../../selectors';

/**
 * Effect class for all tagging related actions which trigger side effects
 */
@Injectable()
export class ProcessCaseEffect {
  /**
   * Get possible values for a form field
   *
   */
  customerDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomer),
      withLatestFrom(this.store.pipe(select(getSelectedQuotationIdentifier))),
      map(([_action, quotationIdentifier]) => quotationIdentifier),
      mergeMap((quotationIdentifier: QuotationIdentifier) =>
        this.customerDetailsService
          .getCustomer(quotationIdentifier.customerNumber)
          .pipe(
            map((item: Customer) =>
              loadCustomerSuccess({
                item,
              })
            ),
            catchError((errorMessage) =>
              of(loadCustomerFailure({ errorMessage }))
            )
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
      ofType(loadQuotation),
      withLatestFrom(this.store.pipe(select(getSelectedQuotationIdentifier))),
      map(([_action, quotationIdentifier]) => quotationIdentifier),
      mergeMap((quotationIdentifier: QuotationIdentifier) =>
        this.quotationDetailsService
          .getQuotation(quotationIdentifier.quotationNumber)
          .pipe(
            map((item: Quotation) => ProcessCaseEffect.addRandomValues(item)),
            catchError((errorMessage) =>
              of(loadQuotationFailure({ errorMessage }))
            )
          )
      )
    )
  );

  triggerDataLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectQuotation),
      // tslint:disable-next-line: no-unnecessary-callback-wrapper
      map(() => loadQuotation())
    )
  );

  triggerCreateQuotation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createQuotation),
      mergeMap(() => {
        return [loadCustomer()]; // TODO: add creat quotation effect
      })
    )
  );

  triggerCustomerLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuotationSuccess),
      // tslint:disable-next-line: no-unnecessary-callback-wrapper
      map(() => loadCustomer())
    )
  );

  selectQuotation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter(
        (routerState) =>
          routerState.url.indexOf(AppRoutePath.ProcessCaseViewPath) >= 0
      ),
      map((routerState) =>
        ProcessCaseEffect.mapQueryParamsToIdentifier(routerState.queryParams)
      ),
      filter((quotationIdentifier: QuotationIdentifier) => {
        if (quotationIdentifier === undefined) {
          this.router.navigate(['not-found']);
        }

        return quotationIdentifier !== undefined;
      }),
      withLatestFrom(this.store.pipe(select(getSelectedQuotationIdentifier))),
      filter(
        ([identifierFromRoute, identifierCurrent]) =>
          !ProcessCaseEffect.checkEqualityOfIdentifier(
            identifierFromRoute,
            identifierCurrent
          )
      ),
      map(([identifierFromRoute, _identifierCurrent]) => identifierFromRoute),
      map((quotationIdentifier: QuotationIdentifier) => {
        return quotationIdentifier.quotationNumber
          ? selectQuotation({ quotationIdentifier })
          : createQuotation({ quotationIdentifier });
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly customerDetailsService: CustomerDetailsService,
    private readonly quotationDetailsService: QuotationDetailsService,
    private readonly store: Store<fromRouter.AppState>,
    private readonly router: Router
  ) {}

  private static mapQueryParamsToIdentifier(
    queryParams: any
  ): { quotationNumber: string; customerNumber: string } {
    const quotationNumber: string = queryParams['quotation_number'];
    const customerNumber: string = queryParams['customer_number'];

    return quotationNumber || customerNumber
      ? { quotationNumber, customerNumber }
      : undefined;
  }

  private static checkEqualityOfIdentifier(
    fromRoute: QuotationIdentifier,
    current: QuotationIdentifier
  ): boolean {
    return (
      fromRoute.customerNumber === current?.customerNumber &&
      fromRoute.quotationNumber === current?.quotationNumber
    );
  }

  private static addRandomValues(item: Quotation): any {
    item.quotationDetails.forEach((value) => {
      value.rsp = (Math.random() * 10).toFixed(2);
      value.margin = `${(Math.random() * 100).toFixed(2).toString()} %`;
      value.quantity = (Math.floor(Math.random() * 10) + 1) * 10;
      value.netValue = (value.quantity * Number(value.rsp)).toString();
      const arr = ['PAT', 'SAP System', 'Custom'];
      value.priceSource = arr[Math.floor(Math.random() * 3)];
    });

    return loadQuotationSuccess({
      item,
    });
  }
}
