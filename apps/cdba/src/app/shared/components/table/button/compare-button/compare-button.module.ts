import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CompareButtonComponent } from './compare-button.component';

@NgModule({
  imports: [
    MatButtonModule,
    SharedTranslocoModule,
    ReactiveComponentModule,
    MatTooltipModule,
  ],
  declarations: [CompareButtonComponent],
  exports: [CompareButtonComponent],
})
export class CompareButtonModule {}
