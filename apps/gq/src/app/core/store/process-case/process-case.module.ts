import { NgModule } from '@angular/core';

import { ActiveCaseModule } from '@gq/core/store/active-case/active-case.module';
import { SharedQuotationModule } from '@gq/core/store/shared-quotation';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

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
