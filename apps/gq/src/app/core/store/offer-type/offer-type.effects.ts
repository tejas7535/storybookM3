import { inject, Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import { RolesFacade } from '../facades/roles.facade';
import { OfferTypeActions } from './offer-type.actions';

@Injectable()
export class OfferTypeEffects {
  readonly actions$: Actions = inject(Actions);
  readonly quotationService: QuotationService = inject(QuotationService);
  readonly rolesFacade: RolesFacade = inject(RolesFacade);

  getAllOfferTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OfferTypeActions.getAllOfferTypes),
      concatLatestFrom(
        () => this.rolesFacade.userHasRegionWorldOrGreaterChinaRole$
      ),
      mergeMap(([_action, userHasOfferTypeAccess]) => {
        if (!userHasOfferTypeAccess) {
          return of(
            OfferTypeActions.getAllOfferTypesFailure({
              errorMessage: 'User does not have access to offer types',
            })
          );
        }

        return this.quotationService.getOfferTypes().pipe(
          map((offerTypes) =>
            OfferTypeActions.getAllOfferTypesSuccess({
              offerTypes,
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
    );
  });
}
