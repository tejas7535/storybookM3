import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { PushModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { ViewToggleModule } from '@schaeffler/view-toggle';

import { ProcessCaseEffect } from '../../../core/store/effects/process-case/process-case.effects';
import { processCaseReducer } from '../../../core/store/reducers/process-case/process-case.reducer';
import { SharedDirectivesModule } from '../../../shared/directives/shared-directives.module';
import { QuotationDetailsTableModule } from '../../quotation-details-table/quotation-details-table.module';
import { CalculationInProgressComponent } from './calculation-in-progress/calculation-in-progress.component';
import { SingleQuotesTabComponent } from './single-quotes-tab.component';
import { SingleQuotesTabRoutingModule } from './single-quotes-tab.routing.module';

@NgModule({
  declarations: [SingleQuotesTabComponent, CalculationInProgressComponent],
  imports: [
    CommonModule,
    EffectsModule.forFeature([ProcessCaseEffect]),
    StoreModule.forFeature('processCase', processCaseReducer),
    MatCardModule,
    QuotationDetailsTableModule,
    PushModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    SingleQuotesTabRoutingModule,
    ViewToggleModule,
    SharedDirectivesModule,
  ],
  exports: [SingleQuotesTabComponent],
})
export class SingleQuotesTabModule {}
