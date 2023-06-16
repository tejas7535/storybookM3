import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';

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
