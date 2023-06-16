import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { LetDirective } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CompareButtonComponent } from './compare-button.component';

@NgModule({
  imports: [
    MatButtonModule,
    SharedTranslocoModule,
    LetDirective,
    MatTooltipModule,
  ],
  declarations: [CompareButtonComponent],
  exports: [CompareButtonComponent],
})
export class CompareButtonModule {}
