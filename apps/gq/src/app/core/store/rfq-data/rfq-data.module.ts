import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { RfqDataEffects } from './rfq-data.effects';
import { RfqDataFacade } from './rfq-data.facade';
import { rfqDataFeature } from './rfq-data.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(rfqDataFeature),
    EffectsModule.forFeature([RfqDataEffects]),
  ],
  providers: [RfqDataFacade],
})
export class RfqDataModule {}
