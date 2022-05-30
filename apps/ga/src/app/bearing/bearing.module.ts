import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { EffectsModule } from '@ngrx/effects';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingEffects } from '@ga/core/store';

import { AdvancedBearingSelectionModule } from './advanced-bearing-selection';
import { BearingComponent } from './bearing.component';
import { BearingRoutingModule } from './bearing-routing.module';
import { QuickBearingSelectionModule } from './quick-bearing-selection';

@NgModule({
  declarations: [BearingComponent],
  imports: [
    // Angular
    CommonModule,

    // Routing
    BearingRoutingModule,

    // Schaeffler Libs
    SubheaderModule,

    // Material Modules
    MatButtonModule,

    // Transloco
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([BearingEffects]),

    // Components
    AdvancedBearingSelectionModule,
    QuickBearingSelectionModule,
  ],
})
export class BearingModule {}
