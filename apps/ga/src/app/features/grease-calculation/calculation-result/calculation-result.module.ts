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

import { CalculationResultEffects } from '@ga/core/store';
import { calculationResultReducer } from '@ga/core/store/reducers/calculation-result/calculation-result.reducer';

import { CalculationResultComponent } from './calculation-result.component';
import { CalculationResultRoutingModule } from './calculation-result-routing.module';
import { GreaseReportComponent } from './components/grease-report';

@NgModule({
  declarations: [CalculationResultComponent],
  imports: [
    CommonModule,
    CalculationResultRoutingModule,
    PushModule,
    FormsModule,

    // Translation
    SharedTranslocoModule,

    // Store
    StoreModule.forFeature('calculationResult', calculationResultReducer),
    EffectsModule.forFeature([CalculationResultEffects]),

    // Material
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,

    // Components
    BreadcrumbsModule,
    ReportModule,
    GreaseReportComponent,
  ],
})
export class CalculationResultModule {}
