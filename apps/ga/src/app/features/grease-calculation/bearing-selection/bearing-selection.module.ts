import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { LetModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingSelectionEffects } from '@ga/core/store';
import { QuickBearingSelectionModule } from '@ga/shared/components/quick-bearing-selection';

import { AdvancedBearingSelectionModule } from './components/advanced-bearing-selection';
import { BearingSelectionComponent } from './bearing-selection.component';
import { BearingSelectionRoutingModule } from './bearing-selection-routing.module';

@NgModule({
  declarations: [BearingSelectionComponent],
  imports: [
    // Angular
    CommonModule,
    LetModule,

    // Routing
    BearingSelectionRoutingModule,

    // Material Modules
    MatSlideToggleModule,
    MatIconModule,

    // Transloco
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([BearingSelectionEffects]),

    // Components
    AdvancedBearingSelectionModule,
    QuickBearingSelectionModule,
  ],
})
export class BearingSelectionModule {}
