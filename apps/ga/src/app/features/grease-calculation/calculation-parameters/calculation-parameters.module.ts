import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { LetDirective, PushPipe } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { MaintenanceModule } from '@schaeffler/empty-states';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationParametersEffects } from '@ga/core/store/effects';
import { FormFieldModule } from '@ga/shared/components/form-field';
import { MediasButtonComponent } from '@ga/shared/components/medias-button';
import { PreferredGreaseSelectionComponent } from '@ga/shared/components/preferred-grease-selection';

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
