import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { TabsHeaderModule } from '../../app/shared/components/tabs-header/tabs-header.module';
import { ProcessCaseEffect } from '../core/store/effects/process-case/process-case.effects';
import { processCaseReducer } from '../core/store/reducers/process-case/process-case.reducer';
import { CustomerHeaderModule } from '../shared/components/header/customer-header/customer-header.module';
import { ExportExcelModalModule } from '../shared/components/modal/export-excel-modal/export-excel-modal.module';
import { SharedPipesModule } from '../shared/pipes/shared-pipes.module';
import { AddMaterialDialogModule } from './add-material-dialog/add-material-dialog.module';
import { HeaderContentModule } from './header-content/header-content.module';
import { ProcessCaseViewComponent } from './process-case-view.component';
import { ProcessCaseViewRoutingModule } from './process-case-view-routing.module';

@NgModule({
  declarations: [ProcessCaseViewComponent],
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
    CustomerHeaderModule,
    ShareButtonModule,
    ExportExcelModalModule,
    MatTabsModule,
    SubheaderModule,
    TabsHeaderModule,
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
