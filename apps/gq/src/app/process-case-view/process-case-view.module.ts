import { NgModule } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ProcessCaseEffect } from '../core/store/effects/process-case/process-case.effect';
import { processCaseReducer } from '../core/store/reducers/process-case/process-case.reducer';
import { SharedModule } from '../shared';
import { CaseHeaderModule } from '../shared/header/case-header/case-header.module';
import { LoadingSpinnerModule } from '../shared/loading-spinner/loading-spinner.module';
import { OfferDrawerModule } from '../shared/offer-drawer/offer-drawer.module';
import { AddMaterialDialogModule } from './add-material-dialog/add-material-dialog.module';
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
    AddMaterialDialogModule,
    LoadingSpinnerModule,
    ReactiveComponentModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true },
    },
  ],
})
export class ProcessCaseViewModule {}
