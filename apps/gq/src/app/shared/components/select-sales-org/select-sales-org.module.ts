import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SelectSalesOrgComponent } from './select-sales-org.component';

@NgModule({
  declarations: [SelectSalesOrgComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    SharedTranslocoModule,
    LetDirective,
    PushPipe,
  ],
  exports: [SelectSalesOrgComponent],
})
export class SelectSalesOrgModule {}
