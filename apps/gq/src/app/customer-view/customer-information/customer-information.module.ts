import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomerInformationComponent } from './customer-information.component';

@NgModule({
  declarations: [CustomerInformationComponent],
  imports: [CommonModule, MatCardModule, SharedTranslocoModule],
  exports: [CustomerInformationComponent],
})
export class CustomerInformationModule {}
