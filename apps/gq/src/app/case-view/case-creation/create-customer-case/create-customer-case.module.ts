import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { AutocompleteInputComponent } from '@gq/shared/components/autocomplete-input/autocomplete-input.component';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { SelectSalesOrgComponent } from '@gq/shared/components/select-sales-org/select-sales-org.component';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

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
    PushPipe,
    AutocompleteInputComponent,
    SelectSalesOrgComponent,
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
