import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared/shared.module';

import { CompareViewButtonComponent } from './compare-view-button/compare-view-button.component';
import { DetailViewButtonComponent } from './detail-view-button/detail-view-button.component';
import { LoadBomButtonComponent } from './load-bom-button/load-bom-button.component';

@NgModule({
  declarations: [
    DetailViewButtonComponent,
    LoadBomButtonComponent,
    CompareViewButtonComponent,
  ],
  imports: [SharedModule, SharedTranslocoModule, MatButtonModule, RouterModule],
  exports: [
    DetailViewButtonComponent,
    LoadBomButtonComponent,
    CompareViewButtonComponent,
  ],
})
export class CustomStatusBarModule {}
