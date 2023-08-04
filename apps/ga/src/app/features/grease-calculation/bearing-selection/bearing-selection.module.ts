import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { LetDirective } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingSelectionEffects } from '@ga/core/store';
import { QualtricsInfoBannerComponent } from '@ga/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import { QuickBearingSelectionComponent } from '@ga/shared/components/quick-bearing-selection';

import { BearingSelectionComponent } from './bearing-selection.component';
import { BearingSelectionRoutingModule } from './bearing-selection-routing.module';
import { AdvancedBearingSelectionModule } from './components/advanced-bearing-selection';

@NgModule({
  declarations: [BearingSelectionComponent],
  imports: [
    // Angular
    CommonModule,
    LetDirective,

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
    QuickBearingSelectionComponent,
    SubheaderModule,
    QualtricsInfoBannerComponent,
  ],
})
export class BearingSelectionModule {}
