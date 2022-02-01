import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { ExcludedCalculationsModule } from '@cdba/shared/components/excluded-calculations/index';
import { InViewModule } from '@cdba/shared/directives/in-view';
import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CompareCalculationsButtonComponent } from './compare-calculations-button/compare-calculations-button.component';
import { CompareResultsButtonComponent } from './compare-results-button/compare-results-button.component';
import { DetailViewButtonComponent } from './detail-view-button/detail-view-button.component';
import { LoadBomButtonComponent } from './load-bom-button/load-bom-button.component';

@NgModule({
  declarations: [
    DetailViewButtonComponent,
    LoadBomButtonComponent,
    CompareResultsButtonComponent,
    CompareCalculationsButtonComponent,
  ],
  imports: [
    RouterModule,
    ReactiveComponentModule,
    SharedTranslocoModule,
    MatButtonModule,
    MatTooltipModule,
    InViewModule,
    ExcludedCalculationsModule,
  ],
  exports: [
    DetailViewButtonComponent,
    LoadBomButtonComponent,
    CompareResultsButtonComponent,
    CompareCalculationsButtonComponent,
  ],
})
export class CustomStatusBarModule {}
