import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared';
import { DialogHeaderModule } from '../../../shared/header/dialog-header/dialog-header.module';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { FilterPricingCardComponent } from './filter-pricing-card/filter-pricing-card.component';
import { FilterPricingComponent } from './filter-pricing.component';
import { GqPriceComponent } from './gq-price/gq-price.component';
import { ManualPriceComponent } from './manual-price/manual-price.component';
import { QuantityDisplayComponent } from './quantity/quantity-display/quantity-display.component';
import { QuantityModalComponent } from './quantity/quantity-modal/quantity-modal.component';
import { SapPriceComponent } from './sap-price/sap-price.component';

@NgModule({
  declarations: [
    FilterPricingComponent,
    FilterPricingCardComponent,
    ManualPriceComponent,
    GqPriceComponent,
    SapPriceComponent,
    QuantityModalComponent,
    QuantityDisplayComponent,
  ],
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    SharedPipesModule,
    SharedModule,
    DialogHeaderModule,
    LoadingSpinnerModule,
    SharedTranslocoModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'detail-view' }],
  exports: [FilterPricingComponent],
})
export class FilterPricingModule {}
