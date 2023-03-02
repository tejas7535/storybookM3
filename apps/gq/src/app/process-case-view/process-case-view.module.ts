import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';

import { ProcessCaseEffect } from '@gq/core/store/effects';
import { processCaseReducer } from '@gq/core/store/reducers/process-case/process-case.reducer';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SyncStatusCustomerInfoHeaderModule } from '../../app/shared/components/header/sync-status-customer-info-header/sync-status-customer-info-header.module';
import { TabsHeaderModule } from '../../app/shared/components/tabs-header/tabs-header.module';
import { ExportExcelModalModule } from '../shared/components/modal/export-excel-modal/export-excel-modal.module';
import { SharedPipesModule } from '../shared/pipes/shared-pipes.module';
import { AddMaterialDialogModule } from './add-material-dialog/add-material-dialog.module';
import { HeaderContentModule } from './header-content/header-content.module';
import { ProcessCaseViewComponent } from './process-case-view.component';
import { ProcessCaseViewRoutingModule } from './process-case-view-routing.module';
import { CalculationInProgressComponent } from './tabs/single-quotes-tab/calculation-in-progress/calculation-in-progress.component';

@NgModule({
  declarations: [ProcessCaseViewComponent, CalculationInProgressComponent],
  imports: [
    CommonModule,
    EffectsModule.forFeature([ProcessCaseEffect]),
    MatSidenavModule,
    HeaderContentModule,
    ProcessCaseViewRoutingModule,
    SharedPipesModule,
    StoreModule.forFeature('processCase', processCaseReducer),
    AddMaterialDialogModule,
    LoadingSpinnerModule,
    PushModule,
    SharedTranslocoModule,
    SubheaderModule,
    BreadcrumbsModule,
    ShareButtonModule,
    ExportExcelModalModule,
    MatTabsModule,
    SubheaderModule,
    TabsHeaderModule,
    SyncStatusCustomerInfoHeaderModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'process-case-view' }],
})
export class ProcessCaseViewModule {}
