import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingEffects } from '../core/store/effects/bearing/bearing.effects';
import { bearingReducer } from '../core/store/reducers/bearing/bearing.reducer';
import { BearingRoutingModule } from './bearing-routing.module';
import { BearingComponent } from './bearing.component';

@NgModule({
  declarations: [BearingComponent],
  imports: [
    CommonModule,
    BearingRoutingModule,

    // Schaeffler Libs
    SearchAutocompleteModule,

    // Transloco
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([BearingEffects]),
    StoreModule.forFeature('bearing', bearingReducer),
    ReactiveComponentModule,
  ],
})
export class BearingModule {}
