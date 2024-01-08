import { NgModule } from '@angular/core';

import { SharedQuotationModule } from '@gq/core/store/shared-quotation';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ActiveCaseModule } from '../active-case';
import { ProcessCaseEffects } from './process-case.effects';
import { processCaseFeature } from './process-case.reducer';

@NgModule({
  imports: [
    ActiveCaseModule,
    SharedQuotationModule,
    StoreModule.forFeature(processCaseFeature),
    EffectsModule.forFeature([ProcessCaseEffects]),
  ],
})
export class ProcessCaseModule {}
