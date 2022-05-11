import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingEffects } from '../core/store';
import { SharedModule } from '../shared/shared.module';
import { AdvancedBearingComponent } from './advanced-bearing/advanced-bearing.component';
import { BearingComponent } from './bearing.component';
import { BearingRoutingModule } from './bearing-routing.module';

@NgModule({
  declarations: [AdvancedBearingComponent, BearingComponent],
  imports: [
    CommonModule,
    BearingRoutingModule,
    SharedModule,
    ReactiveFormsModule,

    // Schaeffler Libs
    SearchAutocompleteModule,
    SubheaderModule,

    // Material Modules
    MatButtonModule,
    MatSnackBarModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,

    // Transloco
    SharedTranslocoModule,

    ReactiveComponentModule,

    EffectsModule.forFeature([BearingEffects]),
  ],
})
export class BearingModule {}
