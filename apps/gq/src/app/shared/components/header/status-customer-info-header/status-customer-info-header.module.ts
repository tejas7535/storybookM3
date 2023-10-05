import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatIconModule,
    MatTooltipModule,
  ],
  declarations: [StatusCustomerInfoHeaderComponent],
  exports: [StatusCustomerInfoHeaderComponent],
})
export class StatusCustomerInfoHeaderModule {}
