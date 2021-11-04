import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ReportModule } from '@schaeffler/report';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ResultEffects } from '../core/store';
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
    FormsModule,

    // UI Modules
    SubheaderModule,
    BreadcrumbsModule,
    ReportModule,
    LoadingSpinnerModule,

    // Material Modules
    MatSlideToggleModule,

    // Translation
    SharedTranslocoModule,

    // Store
    StoreModule.forFeature('result', resultReducer),
    EffectsModule.forFeature([ResultEffects]),
  ],
})
export class ResultModule {}
