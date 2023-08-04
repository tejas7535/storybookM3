import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LetDirective, PushPipe } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ReportModule } from '@schaeffler/report';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationResultEffects } from '@ga/core/store';
import { calculationResultReducer } from '@ga/core/store/reducers/calculation-result/calculation-result.reducer';
import { MediasButtonComponent } from '@ga/shared/components/medias-button';
import { QualtricsInfoBannerComponent } from '@ga/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';

import { CalculationParametersService } from '../calculation-parameters/services';
import { CalculationResultComponent } from './calculation-result.component';
import { CalculationResultRoutingModule } from './calculation-result-routing.module';
import { GreaseReportComponent } from './components/grease-report';
import {
  GreaseReportDataGeneratorService,
  GreaseReportPdfGeneratorService,
} from './services';

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
    QualtricsInfoBannerComponent,
  ],
  providers: [
    CalculationParametersService,
    GreaseReportDataGeneratorService,
    GreaseReportPdfGeneratorService,
  ],
})
export class CalculationResultModule {}
