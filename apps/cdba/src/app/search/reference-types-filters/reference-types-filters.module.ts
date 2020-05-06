import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { MultiSelectFilterComponent } from './multi-select-filter/multi-select-filter.component';
import { RangeFilterComponent } from './range-filter/range-filter.component';
import { ReferenceTypesFiltersComponent } from './reference-types-filters.component';

@NgModule({
  declarations: [
    ReferenceTypesFiltersComponent,
    RangeFilterComponent,
    MultiSelectFilterComponent,
  ],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  exports: [ReferenceTypesFiltersComponent],
})
export class ReferenceTypesFiltersModule {}
