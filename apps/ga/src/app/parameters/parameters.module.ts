import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { ReactiveComponentModule } from '@ngrx/component';
import { StoreModule } from '@ngrx/store';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { parameterReducer } from './../core/store/reducers/parameter/parameter.reducer';
import { SharedModule } from './../shared/shared.module';
import { ParametersRoutingModule } from './parameters-routing.module';
import { ParametersComponent } from './parameters.component';

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

    // Translation
    SharedTranslocoModule,

    // Store
    StoreModule.forFeature('parameter', parameterReducer),
  ],
})
export class ParametersModule {}
