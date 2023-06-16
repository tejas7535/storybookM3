import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { LetDirective, PushPipe } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ReportModule } from '@schaeffler/report';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationResultEffects } from '@ga/core/store';
import { calculationResultReducer } from '@ga/core/store/reducers/calculation-result/calculation-result.reducer';
import { MediasButtonComponent } from '@ga/shared/components/medias-button';

import { CalculationParametersService } from '../calculation-parameters/services';
import { CalculationResultComponent } from './calculation-result.component';
import { CalculationResultRoutingModule } from './calculation-result-routing.module';
import { GreaseReportComponent } from './components/grease-report';

@NgModule({
  declarations: [CalculationResultComponent],
  imports: [
    CommonModule,
    CalculationResultRoutingModule,
    PushPipe,
    FormsModule,

    // Translation
    SharedTranslocoModule,

    // Store
    StoreModule.forFeature('calculationResult', calculationResultReducer),
    EffectsModule.forFeature([CalculationResultEffects]),
    LetDirective,

    // Material
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTooltipModule,

    // Components
    SubheaderModule,
    ReportModule,
    GreaseReportComponent,
    MediasButtonComponent,
  ],
  providers: [CalculationParametersService],
})
export class CalculationResultModule {}
