import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DialogHeaderModule } from '../../../shared/components/header/dialog-header/dialog-header.module';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { DetailButtonComponent } from './detail-button/detail-button.component';
import { FilterPricingComponent } from './filter-pricing.component';
import { FilterPricingCardComponent } from './filter-pricing-card/filter-pricing-card.component';
import { GqPriceComponent } from './gq-price/gq-price.component';
import { ManualPriceComponent } from './manual-price/manual-price.component';
import { QuantityDisplayComponent } from './quantity/quantity-display/quantity-display.component';
import { SapPriceComponent } from './sap-price/sap-price.component';

@NgModule({
  declarations: [
    FilterPricingComponent,
    FilterPricingCardComponent,
    ManualPriceComponent,
    GqPriceComponent,
    SapPriceComponent,
    QuantityDisplayComponent,
    DetailButtonComponent,
  ],
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    PushModule,
    SharedPipesModule,
    DialogHeaderModule,
    LoadingSpinnerModule,
    SharedTranslocoModule,
    CommonModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'detail-view' }],
  exports: [FilterPricingComponent],
})
export class FilterPricingModule {}
