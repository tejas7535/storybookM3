import { inject, Injectable } from '@angular/core';

import { catchError, map, of, switchMap } from 'rxjs';

import { ShipToPartyActions } from '@gq/core/store/ship-to-party/ship-to-party.actions';
import { ShipToPartyService } from '@gq/shared/services/rest/ship-to-party/ship-to-party.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

@Injectable()
export class ShipToPartyEffects {
  readonly actions$ = inject(Actions);
  readonly shipToPartyService = inject(ShipToPartyService);

  getAllShipToPartyForGivenCustomerAndSalesOrg$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShipToPartyActions.getAllShipToParties),
      switchMap((action) => {
        return this.shipToPartyService
          .getShipToParties(action.customerId, action.salesOrg)
          .pipe(
            map((shipToParties) =>
              ShipToPartyActions.getAllShipToPartiesSuccess({
                shipToParties: shipToParties.results,
              })
            ),
            catchError((errorMessage) =>
              of(
                ShipToPartyActions.getAllShipToPartiesFailure({
                  errorMessage,
                })
              )
            )
          );
      })
    );
  });
}
