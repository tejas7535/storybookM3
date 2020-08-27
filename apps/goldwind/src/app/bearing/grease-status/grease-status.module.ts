import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AgGridModule } from '@ag-grid-community/angular';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { GreaseStatusEffects } from '../../core/store/effects/grease-status/grease-status.effects';
import { greaseStatusReducer } from '../../core/store/reducers/grease-status/grease-status.reducer';
import { SharedModule } from '../../shared/shared.module';
import { GreaseStatusRoutingModule } from './grease-status-routing.module';
import { GreaseStatusComponent } from './grease-status.component';

@NgModule({
  declarations: [GreaseStatusComponent],
  imports: [
    CommonModule,
    GreaseStatusRoutingModule,
    ReactiveFormsModule,
    SharedModule,

    // UI Modules
    MatCardModule,
    MatCheckboxModule,

    // ag-Grid
    AgGridModule.withComponents([]),

    // Translation
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([GreaseStatusEffects]),
    StoreModule.forFeature('greaseStatus', greaseStatusReducer),
    ReactiveComponentModule,
  ],
})
export class GreaseStatusModule {}
