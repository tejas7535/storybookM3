import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { AgGridModule } from '@ag-grid-community/angular';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DataViewEffects } from '../../core/store/effects/data-view/data-view.effects';
import { dataViewReducer } from '../../core/store/reducers/data-view/data-view.reducer';
import { DateRangeModule } from '../../shared/date-range/date-range.module';
import { EmptyGraphModule } from '../../shared/empty-graph/empty-graph.module';
import { SharedModule } from '../../shared/shared.module';
import { DataViewComponent } from './data-view.component';
import { DataViewRoutingModule } from './data-view-routing.module';

@NgModule({
  declarations: [DataViewComponent],
  imports: [
    CommonModule,
    DataViewRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    DateRangeModule,
    EmptyGraphModule,

    // UI Modules
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule,

    // ag-Grid
    AgGridModule.withComponents([]),

    // Translation
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([DataViewEffects]),
    StoreModule.forFeature('dataView', dataViewReducer),
    ReactiveComponentModule,
  ],
})
export class DataViewModule {}
