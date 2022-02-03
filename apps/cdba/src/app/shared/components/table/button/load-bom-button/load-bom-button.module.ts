import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
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
