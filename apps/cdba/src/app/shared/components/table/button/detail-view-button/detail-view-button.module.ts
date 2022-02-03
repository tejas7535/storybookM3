import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DetailViewButtonComponent } from './detail-view-button.component';

@NgModule({
  imports: [
    RouterModule,
    MatButtonModule,
    SharedTranslocoModule,
    ReactiveComponentModule,
  ],
  declarations: [DetailViewButtonComponent],
  exports: [DetailViewButtonComponent],
})
export class DetailViewButtonModule {}
