import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ParameterEffects } from '../core/store/effects';
import { parameterReducer } from './../core/store/reducers/parameter/parameter.reducer';
import { SharedModule } from './../shared/shared.module';
import { ParametersComponent } from './parameters.component';
import { ParametersRoutingModule } from './parameters-routing.module';

@NgModule({
  declarations: [ParametersComponent],
  imports: [
    CommonModule,
    ParametersRoutingModule,
    SharedModule,
    ReactiveComponentModule,

    // UI Modules
    SubheaderModule,
    BreadcrumbsModule,

    // Material Modules
    MatButtonModule,
    MatProgressSpinnerModule,

    // Translation
    SharedTranslocoModule,

    // Store
    StoreModule.forFeature('parameter', parameterReducer),
    EffectsModule.forFeature([ParameterEffects]),
  ],
})
export class ParametersModule {}
