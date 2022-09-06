import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { LetModule, PushModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { MaintenanceModule } from '@schaeffler/empty-states';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationParametersEffects } from '@ga/core/store/effects';
import { FormFieldModule } from '@ga/shared/components/form-field';
import { PreferredGreaseSelectionComponent } from '@ga/shared/components/preferred-grease-selection';

import { CalculationParametersComponent } from './calculation-parameters.component';
import { CalculationParametersRoutingModule } from './calculation-parameters-routing.module';
import { CalculationParametersService } from './services';

@NgModule({
  declarations: [CalculationParametersComponent],
  imports: [
    CommonModule,
    CalculationParametersRoutingModule,
    PushModule,

    // UI
    BreadcrumbsModule,
    MaintenanceModule,
    SubheaderModule,
    FormFieldModule,
    PreferredGreaseSelectionComponent,

    // Material Modules
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,

    // Translation
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([CalculationParametersEffects]),
    LetModule,
  ],
  providers: [CalculationParametersService],
})
export class CalculationParametersModule {}
