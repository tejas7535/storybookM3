import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslocoDatePipe } from '@ngneat/transloco-locale';
import { LetDirective, PushPipe } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ReportModule } from '@schaeffler/report';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationResultEffects } from '@ga/core/store';
import { calculationResultReducer } from '@ga/core/store/reducers/calculation-result/calculation-result.reducer';
import { ENV, getEnv } from '@ga/environments/environments.provider';
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
import { FontsLoaderService } from './services/pdf/fonts-loader.service';
import { GreaseReportPdfFileSaveService } from './services/pdf/grease-report-pdf-file-save.service';

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
    MatButtonModule,

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
    GreaseReportPdfFileSaveService,
    FontsLoaderService,
    TranslocoDatePipe,
    {
      provide: ENV,
      useFactory: getEnv,
    },
  ],
})
export class CalculationResultModule {}
