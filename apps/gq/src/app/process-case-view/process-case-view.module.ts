import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ProcessCaseEffect } from '../core/store/effects/process-case/process-case.effects';
import { processCaseReducer } from '../core/store/reducers/process-case/process-case.reducer';
import { SharedModule } from '../shared';
import { ExportExcelModalModule } from '../shared/export-excel-modal/export-excel-modal.module';
import { CustomerHeaderModule } from '../shared/header/customer-header/customer-header.module';
import { SharedPipesModule } from '../shared/pipes/shared-pipes.module';
import { AddMaterialDialogModule } from './add-material-dialog/add-material-dialog.module';
import { CalculationInProgressComponent } from './calculation-in-progress/calculation-in-progress.component';
import { HeaderContentModule } from './header-content/header-content.module';
import { ProcessCaseViewComponent } from './process-case-view.component';
import { ProcessCaseViewRoutingModule } from './process-case-view-routing.module';
import { QuotationDetailsTableModule } from './quotation-details-table/quotation-details-table.module';

@NgModule({
  declarations: [ProcessCaseViewComponent, CalculationInProgressComponent],
  imports: [
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
    SubheaderModule,
    BreadcrumbsModule,
    CustomerHeaderModule,
    MatCardModule,
    ShareButtonModule,
    ExportExcelModalModule,
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
