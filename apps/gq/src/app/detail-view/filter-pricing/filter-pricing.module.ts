import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared';
import { FilterPricingComponent } from './filter-pricing.component';

@NgModule({
  declarations: [FilterPricingComponent],
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    SharedModule,
    SharedTranslocoModule,
  ],
  exports: [FilterPricingComponent],
})
export class FilterPricingModule {}
