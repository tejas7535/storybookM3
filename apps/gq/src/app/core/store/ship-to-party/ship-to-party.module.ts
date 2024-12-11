import { NgModule } from '@angular/core';

import { ShipToPartyEffects } from '@gq/core/store/ship-to-party/ship-to-party.effects';
import { ShipToPartyFacade } from '@gq/core/store/ship-to-party/ship-to-party.facade';
import { shipToPartyFeature } from '@gq/core/store/ship-to-party/ship-to-party.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [
    StoreModule.forFeature(shipToPartyFeature),
    EffectsModule.forFeature([ShipToPartyEffects]),
  ],
  providers: [ShipToPartyFacade],
})
export class ShipToPartyModule {}
