import { inject, Injectable } from '@angular/core';

import { catchError, map, mergeMap, of, skipWhile, switchMap } from 'rxjs';

import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import {
  Actions,
  concatLatestFrom,
  createEffect,
  ofType,
  OnInitEffects,
} from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { getIsLoggedIn } from '@schaeffler/azure-auth';

import { RolesFacade } from '../facades/roles.facade';
import { OfferTypeActions } from './offer-type.actions';

@Injectable()
export class OfferTypeEffects implements OnInitEffects {
  ngrxOnInitEffects(): Action {
    return OfferTypeActions.getAllOfferTypes();
  }
  readonly actions$: Actions = inject(Actions);
  readonly quotationService: QuotationService = inject(QuotationService);
  readonly rolesFacade: RolesFacade = inject(RolesFacade);
  readonly store = inject(Store);

  getAllOfferTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OfferTypeActions.getAllOfferTypes),
      switchMap(() =>
        this.store.select(getIsLoggedIn).pipe(
          skipWhile((isLoggedIn) => !isLoggedIn),
          concatLatestFrom(
            () => this.rolesFacade.userHasRegionWorldOrGreaterChinaRole$
          ),
          mergeMap(([_, userHasOfferTypeAccess]) => {
            if (!userHasOfferTypeAccess) {
              return of(
                OfferTypeActions.getAllOfferTypesFailure({
                  errorMessage: 'User does not have access to offer types',
                })
              );
            }

            return this.quotationService.getOfferTypes().pipe(
              map((offerTypeResponse) =>
                OfferTypeActions.getAllOfferTypesSuccess({
                  offerTypes: offerTypeResponse.results,
                })
              ),
              catchError((errorMessage) =>
                of(
                  OfferTypeActions.getAllOfferTypesFailure({
                    errorMessage,
                  })
                )
              )
            );
          })
        )
      )
    );
  });
}
