import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LetModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CompareButtonComponent } from './compare-button.component';

@NgModule({
  imports: [
    MatButtonModule,
    SharedTranslocoModule,
    LetModule,
    MatTooltipModule,
  ],
  declarations: [CompareButtonComponent],
  exports: [CompareButtonComponent],
})
export class CompareButtonModule {}
