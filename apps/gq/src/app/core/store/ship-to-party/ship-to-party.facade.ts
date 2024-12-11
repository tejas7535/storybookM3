import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { ShipToPartyActions } from '@gq/core/store/ship-to-party/ship-to-party.actions';
import { shipToPartyFeature } from '@gq/core/store/ship-to-party/ship-to-party.reducer';
import { SelectableValue } from '@gq/shared/models/selectable-value.model';
import { ShipToParty } from '@gq/shared/models/ship-to-party.model';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class ShipToPartyFacade {
  private readonly store = inject(Store);

  shipToParties$: Observable<ShipToParty[]> = this.store.select(
    shipToPartyFeature.selectShipToParties
  );

  shipToPartiesAsSelectableValues$: Observable<SelectableValue[]> =
    this.shipToParties$.pipe(
      map((shipToParty) =>
        shipToParty.map(
          (stp: ShipToParty) =>
            ({
              id: stp.customerId,
              value: stp.customerName,
              value2: stp.countryName,
              defaultSelection: stp.defaultCustomer,
            }) as SelectableValue
        )
      )
    );

  shipToPartiesLoading$: Observable<boolean> = this.store.select(
    shipToPartyFeature.selectShipToPartyLoading
  );

  loadShipToPartyByCustomerAndSalesOrg(
    customerId: string,
    salesOrg: string
  ): void {
    this.store.dispatch(
      ShipToPartyActions.getAllShipToParties({ customerId, salesOrg })
    );
  }

  selectShipToParty(shipToParty: ShipToParty): void {
    this.store.dispatch(ShipToPartyActions.selectShipToParty({ shipToParty }));
  }

  resetAllShipToParties(): void {
    this.store.dispatch(ShipToPartyActions.resetAllShipToParties());
  }
}
