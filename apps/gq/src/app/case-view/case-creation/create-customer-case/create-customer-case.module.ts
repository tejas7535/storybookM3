import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { AutocompleteInputModule } from '@gq/shared/components/autocomplete-input/autocomplete-input.module';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { SelectSalesOrgModule } from '@gq/shared/components/select-sales-org/select-sales-org.module';
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
