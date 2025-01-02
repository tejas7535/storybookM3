import { NgModule } from '@angular/core';

import { QuotationToDateEffects } from '@gq/core/store/quotation-to-date/quotation-to-date.effects';
import { quotationToDateFeature } from '@gq/core/store/quotation-to-date/quotation-to-date.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [
    StoreModule.forFeature(quotationToDateFeature),
    EffectsModule.forFeature([QuotationToDateEffects]),
  ],
})
export class QuotationToDateStoreModule {}
