import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { LetModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingEffects } from '@ga/core/store';
import { QuickBearingSelectionModule } from '@ga/shared/components/quick-bearing-selection';

import { AdvancedBearingSelectionModule } from './advanced-bearing-selection';
import { BearingComponent } from './bearing.component';
import { BearingRoutingModule } from './bearing-routing.module';

@NgModule({
  declarations: [BearingComponent],
  imports: [
    // Angular
    CommonModule,
    LetModule,

    // Routing
    BearingRoutingModule,

    // Material Modules
    MatSlideToggleModule,
    MatIconModule,

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
