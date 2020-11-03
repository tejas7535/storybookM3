import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../index';
import { CustomerDetailsComponent } from './customer-details.component';

@NgModule({
  declarations: [CustomerDetailsComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    MatCardModule,
    MatButtonModule,
  ],
  exports: [CustomerDetailsComponent],
})
export class CustomerDetailsModule {}
