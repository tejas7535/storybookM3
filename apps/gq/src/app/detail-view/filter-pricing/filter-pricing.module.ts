import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared';
import { LoadingSpinnerModule } from '../../shared/loading-spinner/loading-spinner.module';
import { FilterPricingCardComponent } from './filter-pricing-card/filter-pricing-card.component';
import { FilterPricingComponent } from './filter-pricing.component';
import { GqPriceComponent } from './gq-price/gq-price.component';
import { ManualPriceComponent } from './manual-price/manual-price.component';

@NgModule({
  declarations: [
    FilterPricingComponent,
    FilterPricingCardComponent,
    ManualPriceComponent,
    GqPriceComponent,
  ],
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    LoadingSpinnerModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    SharedModule,
    SharedTranslocoModule,
  ],
  exports: [FilterPricingComponent],
})
export class FilterPricingModule {}
