import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { CustomerHeaderComponent } from './customer-header.component';

@NgModule({
  declarations: [CustomerHeaderComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    MatCardModule,
    MatButtonModule,
    SharedPipesModule,
  ],
  exports: [CustomerHeaderComponent],
})
export class CustomerHeaderModule {}
