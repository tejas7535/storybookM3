import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LoadBomButtonComponent } from './load-bom-button.component';

@NgModule({
  imports: [
    RouterModule,
    MatButtonModule,
    MatTooltipModule,
    SharedTranslocoModule,
  ],
  declarations: [LoadBomButtonComponent],
  exports: [LoadBomButtonComponent],
})
export class LoadBomButtonModule {}
