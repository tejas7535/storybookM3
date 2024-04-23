import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TRANSLOCO_SCOPE } from '@jsverse/transloco';

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
