import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { PushModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { ReportModule } from '@schaeffler/report';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ResultEffects } from '../core/store';
import { resultReducer } from '../core/store/reducers/result/result.reducer';
import { SharedModule } from '../shared/shared.module';
import { ResultComponent } from './result.component';
import { ResultRoutingModule } from './result-routing.module';

@NgModule({
  declarations: [ResultComponent],
  imports: [
    CommonModule,
    ResultRoutingModule,
    SharedModule,
    PushModule,
    FormsModule,

    // UI Modules
    BreadcrumbsModule,
    ReportModule,

    // Material Modules
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,

    // Translation
    SharedTranslocoModule,

    // Store
    StoreModule.forFeature('result', resultReducer),
    EffectsModule.forFeature([ResultEffects]),
  ],
})
export class ResultModule {}
