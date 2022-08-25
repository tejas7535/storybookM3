import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialNumberModule } from '@cdba/shared/pipes';

import { MultiSelectFilterComponent } from './multi-select-filter/multi-select-filter.component';
import { FormatValuePipe } from './multi-select-filter/pipes/format-value.pipe';
import { MultiSelectValuePipe } from './multi-select-filter/pipes/multi-select-value.pipe';
import { NoResultsFoundPipe } from './multi-select-filter/pipes/no-results-found.pipe';
import { RangeFilterComponent } from './range-filter/range-filter.component';
import { RangeFilterValuePipe } from './range-filter/range-filter-value.pipe';
import { ReferenceTypesFiltersComponent } from './reference-types-filters.component';

@NgModule({
  declarations: [
    ReferenceTypesFiltersComponent,
    RangeFilterComponent,
    MultiSelectFilterComponent,
    RangeFilterValuePipe,
    MultiSelectValuePipe,
    NoResultsFoundPipe,
    FormatValuePipe,
  ],
  imports: [
    CommonModule,
    PushModule,
    SharedTranslocoModule,
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
    MatProgressSpinnerModule,
    MaterialNumberModule,
  ],
  exports: [ReferenceTypesFiltersComponent],
})
export class ReferenceTypesFiltersModule {}
