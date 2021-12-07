import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { InViewModule } from '@cdba/shared/directives/in-view';
import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CompareViewButtonComponent } from './compare-view-button/compare-view-button.component';
import { DetailViewButtonComponent } from './detail-view-button/detail-view-button.component';
import { LoadBomButtonComponent } from './load-bom-button/load-bom-button.component';

@NgModule({
  declarations: [
    DetailViewButtonComponent,
    LoadBomButtonComponent,
    CompareViewButtonComponent,
  ],
  imports: [
    RouterModule,
    ReactiveComponentModule,
    SharedTranslocoModule,
    MatButtonModule,
    MatTooltipModule,
    InViewModule,
  ],
  exports: [
    DetailViewButtonComponent,
    LoadBomButtonComponent,
    CompareViewButtonComponent,
  ],
})
export class CustomStatusBarModule {}
