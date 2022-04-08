import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../../../shared/components/autocomplete-input/autocomplete-input.module';
import { DialogHeaderModule } from '../../../shared/components/header/dialog-header/dialog-header.module';
import { SelectSalesOrgModule } from '../../../shared/components/select-sales-org/select-sales-org.module';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { AdditionalFiltersComponent } from './additional-filters/additional-filters.component';
import { FilterSelectionComponent } from './additional-filters/filter-selection/filter-selection.component';
import { CreateCustomerCaseComponent } from './create-customer-case.component';
import { MaterialSelectionComponent } from './material-selection/material-selection.component';
import { StatusBarComponent } from './status-bar/status-bar.component';

@NgModule({
  declarations: [
    CreateCustomerCaseComponent,
    StatusBarComponent,
    MaterialSelectionComponent,
    AdditionalFiltersComponent,
    FilterSelectionComponent,
  ],
  imports: [
    CommonModule,
    DialogHeaderModule,
    SharedTranslocoModule,
    ReactiveComponentModule,
    AutocompleteInputModule,
    SelectSalesOrgModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    LoadingSpinnerModule,
    SharedPipesModule,
  ],
  exports: [CreateCustomerCaseComponent],
})
export class CreateCustomerCaseModule {}
