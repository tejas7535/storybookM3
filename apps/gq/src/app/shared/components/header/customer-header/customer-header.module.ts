import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../../pipes/shared-pipes.module';
import { CustomerHeaderComponent } from './customer-header.component';

@NgModule({
  declarations: [CustomerHeaderComponent],
  imports: [
    SharedTranslocoModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    SharedPipesModule,
    CommonModule,
  ],
  exports: [CustomerHeaderComponent],
})
export class CustomerHeaderModule {}
