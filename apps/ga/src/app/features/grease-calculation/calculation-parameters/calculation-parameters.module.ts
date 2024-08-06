import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LetDirective, PushPipe } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { MaintenanceModule } from '@schaeffler/empty-states';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationParametersEffects } from '@ga/core/store/effects';
import { AppStoreButtonsComponent } from '@ga/shared/components/app-store-buttons/app-store-buttons.component';
import { FormFieldModule } from '@ga/shared/components/form-field';
import { MediasButtonComponent } from '@ga/shared/components/medias-button';
import { PreferredGreaseSelectionComponent } from '@ga/shared/components/preferred-grease-selection';
import { QualtricsInfoBannerComponent } from '@ga/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';

import { CalculationParametersComponent } from './calculation-parameters.component';
import { CalculationParametersRoutingModule } from './calculation-parameters-routing.module';
import { CalculationParametersService } from './services';

@NgModule({
  declarations: [CalculationParametersComponent],
  imports: [
    CommonModule,
    CalculationParametersRoutingModule,
    PushPipe,
    LetDirective,

    // UI
    BreadcrumbsModule,
    MaintenanceModule,
    SubheaderModule,
    FormFieldModule,
    PreferredGreaseSelectionComponent,
    MediasButtonComponent,
    QualtricsInfoBannerComponent,
    AppStoreButtonsComponent,

    // Material Modules
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTooltipModule,

    // Translation
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([CalculationParametersEffects]),
  ],
  providers: [CalculationParametersService],
})
export class CalculationParametersModule {}
