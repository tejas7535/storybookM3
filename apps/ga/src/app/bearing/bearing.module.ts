import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingEffects } from '../core/store';
import { bearingReducer } from './../core/store/reducers/bearing/bearing.reducer';
import { BearingComponent } from './bearing.component';
import { BearingRoutingModule } from './bearing-routing.module';

@NgModule({
  declarations: [BearingComponent],
  imports: [
    CommonModule,
    BearingRoutingModule,
    ReactiveFormsModule,

    // Schaeffler Libs
    SearchAutocompleteModule,
    SubheaderModule,

    // Material Modules
    MatButtonModule,
    MatSnackBarModule,

    // Transloco
    SharedTranslocoModule,

    ReactiveComponentModule,

    StoreModule.forFeature('bearing', bearingReducer),
    EffectsModule.forFeature([BearingEffects]),
  ],
})
export class BearingModule {}
