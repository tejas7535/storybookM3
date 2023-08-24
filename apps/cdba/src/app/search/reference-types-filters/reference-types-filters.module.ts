import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

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
    CommonModule,
    PushPipe,
    SharedTranslocoModule,
    MultiSelectFilterComponentModule,
    FormsModule.withConfig({
      callSetDisabledState: 'whenDisabledForLegacyCode',
    }),
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
