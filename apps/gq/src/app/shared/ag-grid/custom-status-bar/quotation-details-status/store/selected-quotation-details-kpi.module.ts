import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SelectedQuotationDetailsKpiEffects } from './selected-quotation-details-kpi.effects';
import { selectedQuotationDetailsKpiFeature } from './selected-quotation-details-kpi.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(selectedQuotationDetailsKpiFeature),
    EffectsModule.forFeature([SelectedQuotationDetailsKpiEffects]),
  ],
})
export class SelectedQuotationDetailsKpiStoreModule {}
