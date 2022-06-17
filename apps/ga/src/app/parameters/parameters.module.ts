import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { PushModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ParameterEffects } from '../core/store/effects';
import { SharedModule } from './../shared/shared.module';
import { ParametersComponent } from './parameters.component';
import { ParametersRoutingModule } from './parameters-routing.module';

@NgModule({
  declarations: [ParametersComponent],
  imports: [
    CommonModule,
    ParametersRoutingModule,
    SharedModule,
    PushModule,

    // UI Modules
    BreadcrumbsModule,

    // Material Modules
    MatButtonModule,
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
