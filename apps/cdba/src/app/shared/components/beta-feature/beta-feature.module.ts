import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BetaFeatureBadgeComponent } from './beta-feature-badge/beta-feature-badge.component';
import { BetaFeatureDialogComponent } from './beta-feature-dialog/beta-feature-dialog.component';
import { BetaFeatureSettingsComponent } from './beta-feature-settings/beta-feature-settings.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSlideToggleModule,

    SharedTranslocoModule,
  ],
  declarations: [
    BetaFeatureBadgeComponent,
    BetaFeatureDialogComponent,
    BetaFeatureSettingsComponent,
  ],
  exports: [BetaFeatureBadgeComponent, BetaFeatureSettingsComponent],
})
export class BetaFeatureModule {}
