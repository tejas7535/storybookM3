import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { FeatureToggleViewComponent } from './feature-toggle-view.component';
import { FeatureToggleViewRoutingModule } from './feature-toggle-view-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FeatureToggleViewRoutingModule,
    SharedTranslocoModule,
    SubheaderModule,
    MatSlideToggleModule,
    MatCardModule,
    MatButtonModule,
  ],
  declarations: [FeatureToggleViewComponent],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'feature-toggle-view' }],
})
export class FeatureToggleViewModule {}
