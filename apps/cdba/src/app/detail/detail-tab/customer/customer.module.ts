import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { CustomerComponent } from './customer.component';

@NgModule({
  declarations: [CustomerComponent],
  imports: [SharedModule, SharedTranslocoModule],
  exports: [CustomerComponent],
})
export class CustomerModule {}
