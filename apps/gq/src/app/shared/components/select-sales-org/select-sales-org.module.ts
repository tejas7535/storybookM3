import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

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
