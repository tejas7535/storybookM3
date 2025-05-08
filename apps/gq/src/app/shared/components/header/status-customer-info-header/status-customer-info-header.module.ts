import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../../pipes/shared-pipes.module';
import { CustomerSubheaderContentComponent } from '../customer-subheader-content/customer-subheader-content.component';
import { StatusCustomerInfoHeaderComponent } from './status-customer-info-header.component';
@NgModule({
  imports: [
    CommonModule,
    SharedTranslocoModule,
    SharedPipesModule,
    PushPipe,
    MatIconModule,
    MatTooltipModule,
    CustomerSubheaderContentComponent,
  ],
  declarations: [StatusCustomerInfoHeaderComponent],
  exports: [StatusCustomerInfoHeaderComponent],
})
export class StatusCustomerInfoHeaderModule {}
