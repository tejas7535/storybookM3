import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../../pipes/shared-pipes.module';
import { StatusCustomerInfoHeaderComponent } from './status-customer-info-header.component';
@NgModule({
  imports: [
    CommonModule,
    SharedTranslocoModule,
    SharedPipesModule,
    PushPipe,
    MatTooltipModule,
  ],
  declarations: [StatusCustomerInfoHeaderComponent],
  exports: [StatusCustomerInfoHeaderComponent],
})
export class StatusCustomerInfoHeaderModule {}
