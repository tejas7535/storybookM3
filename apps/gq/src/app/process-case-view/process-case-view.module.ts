import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ProcessCaseEffect } from '../core/store/effects/process-case/process-case.effect';
import { processCaseReducer } from '../core/store/reducers/process-case/process-case.reducers';
import { SharedModule } from '../shared';
import { CaseHeaderModule } from '../shared/case-header/case-header.module';
import { OfferDrawerModule } from '../shared/offer-drawer/offer-drawer.module';
import { ProcessCaseViewRoutingModule } from './process-case-view-routing.module';
import { ProcessCaseViewComponent } from './process-case-view.component';
import { QuotationDetailsTableModule } from './quotation-details-table/quotation-details-table.module';

@NgModule({
  declarations: [ProcessCaseViewComponent],
  imports: [
    CaseHeaderModule,
    EffectsModule.forFeature([ProcessCaseEffect]),
    MatSidenavModule,
    OfferDrawerModule,
    ProcessCaseViewRoutingModule,
    QuotationDetailsTableModule,
    SharedModule,
    StoreModule.forFeature('processCase', processCaseReducer),
  ],
})
export class ProcessCaseViewModule {}
