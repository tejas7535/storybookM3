import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LoadingSpinnerModule } from '@cdba/shared/components';
import { MaterialNumberModule } from '@cdba/shared/pipes';

import { MultiSelectFilterComponentModule } from '../reference-types-filters/multi-select-filter/multi-select-filter.component';
import { NoResultsFoundPipe } from './multi-select-filter/pipes/no-results-found.pipe';
import { RangeFilterComponent } from './range-filter/range-filter.component';
import { RangeFilterValuePipe } from './range-filter/range-filter-value.pipe';
import { ReferenceTypesFiltersComponent } from './reference-types-filters.component';

@NgModule({
  declarations: [
    ReferenceTypesFiltersComponent,
    RangeFilterComponent,
    RangeFilterValuePipe,
    NoResultsFoundPipe,
  ],
  imports: [
    PushPipe,
    MatCardModule,
    SharedTranslocoModule,
    MultiSelectFilterComponentModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatCheckboxModule,
    MatTooltipModule,
    LoadingSpinnerModule,
    MaterialNumberModule,
  ],
  exports: [ReferenceTypesFiltersComponent],
})
export class ReferenceTypesFiltersModule {}
