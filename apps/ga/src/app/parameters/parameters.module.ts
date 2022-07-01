import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { PushModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { MaintenanceModule } from '@schaeffler/empty-states';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ParameterEffects } from '@ga/core/store/effects';
import { PreferredGreaseSelectionComponent } from '@ga/shared/components/preferred-grease-selection';
import { SharedModule } from '@ga/shared/shared.module';

import { ParametersComponent } from './parameters.component';
import { ParametersRoutingModule } from './parameters-routing.module';

@NgModule({
  declarations: [ParametersComponent],
  imports: [
    CommonModule,
    ParametersRoutingModule,
    PushModule,

    // UI
    BreadcrumbsModule,
    SharedModule,
    PreferredGreaseSelectionComponent,
    MaintenanceModule,

    // Material Modules
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,

    // Translation
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([ParameterEffects]),
  ],
})
export class ParametersModule {}
