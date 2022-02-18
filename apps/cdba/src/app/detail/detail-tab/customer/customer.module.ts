import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DetailsLabelValueModule } from '../details-label-value';
import { CustomerComponent } from './customer.component';

@NgModule({
  declarations: [CustomerComponent],
  imports: [SharedTranslocoModule, DetailsLabelValueModule, CommonModule],
  exports: [CustomerComponent],
})
export class CustomerModule {}
