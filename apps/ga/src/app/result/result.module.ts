import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';
import { StoreModule } from '@ngrx/store';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { resultReducer } from '../core/store/reducers/result/result.reducer';
import { SharedModule } from '../shared/shared.module';
import { ResultRoutingModule } from './result-routing.module';
import { ResultComponent } from './result.component';

@NgModule({
  declarations: [ResultComponent],
  imports: [
    CommonModule,
    ResultRoutingModule,
    SharedModule,
    ReactiveComponentModule,

    // UI Modules
    SubheaderModule,
    BreadcrumbsModule,

    // Material Modules

    // Translation
    SharedTranslocoModule,

    // Store
    StoreModule.forFeature('result', resultReducer),
  ],
})
export class ResultModule {}
