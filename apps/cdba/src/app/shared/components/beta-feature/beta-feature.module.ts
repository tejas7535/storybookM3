import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BetaFeatureBadgeComponent } from './beta-feature-badge/beta-feature-badge.component';
import { BetaFeatureDialogComponent } from './beta-feature-dialog/beta-feature-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,

    SharedTranslocoModule,
  ],
  declarations: [BetaFeatureBadgeComponent, BetaFeatureDialogComponent],
  exports: [BetaFeatureBadgeComponent],
})
export class BetaFeatureModule {}
