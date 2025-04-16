import { NgModule } from '@angular/core';

import { QuotationKpiSimulationEffects } from '@gq/core/store/active-case/quotation-kpi-simulation/quotation-kpi-simulation.effects';
import { SapSyncStatusEffects } from '@gq/core/store/active-case/sap-sync-status/sap-sync-status.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ActiveCaseEffects } from './active-case.effects';
import { ActiveCaseFacade } from './active-case.facade';
import { activeCaseFeature } from './active-case.reducer';
import { QuotationMetadataEffects } from './quotation-metadata/quotation-metadata.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(activeCaseFeature),
    EffectsModule.forFeature([
      ActiveCaseEffects,
      SapSyncStatusEffects,
      QuotationMetadataEffects,
      QuotationKpiSimulationEffects,
    ]),
  ],
  providers: [ActiveCaseFacade],
})
export class ActiveCaseModule {}
