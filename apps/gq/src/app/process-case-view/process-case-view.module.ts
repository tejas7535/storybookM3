import { NgModule } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ProcessCaseEffect } from '../core/store/effects/process-case/process-case.effect';
import { processCaseReducer } from '../core/store/reducers/process-case/process-case.reducer';
import { SharedModule } from '../shared';
import { CaseHeaderModule } from '../shared/header/case-header/case-header.module';
import { SharedPipesModule } from '../shared/pipes/shared-pipes.module';
import { AddMaterialDialogModule } from './add-material-dialog/add-material-dialog.module';
import { HeaderContentModule } from './header-content/header-content.module';
import { ProcessCaseViewRoutingModule } from './process-case-view-routing.module';
import { ProcessCaseViewComponent } from './process-case-view.component';
import { QuotationDetailsTableModule } from './quotation-details-table/quotation-details-table.module';
import { CalculationInProgressComponent } from './calculation-in-progress/calculation-in-progress.component';

@NgModule({
  declarations: [ProcessCaseViewComponent, CalculationInProgressComponent],
  imports: [
    CaseHeaderModule,
    EffectsModule.forFeature([ProcessCaseEffect]),
    MatSidenavModule,
    HeaderContentModule,
    ProcessCaseViewRoutingModule,
    QuotationDetailsTableModule,
    SharedModule,
    SharedPipesModule,
    StoreModule.forFeature('processCase', processCaseReducer),
    AddMaterialDialogModule,
    LoadingSpinnerModule,
    ReactiveComponentModule,
    SharedTranslocoModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true },
    },
    { provide: TRANSLOCO_SCOPE, useValue: 'process-case-view' },
  ],
})
export class ProcessCaseViewModule {}
