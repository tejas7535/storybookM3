import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../../../shared/autocomplete-input/autocomplete-input.module';
import { DialogHeaderModule } from '../../../shared/header/dialog-header/dialog-header.module';
import { SelectSalesOrgModule } from '../../../shared/select-sales-org/select-sales-org.module';
import { AdditionalFiltersComponent } from './additional-filters/additional-filters.component';
import { CreateCustomerCaseComponent } from './create-customer-case.component';
import { MaterialSelectionComponent } from './material-selection/material-selection.component';
import { StatusBarComponent } from './status-bar/status-bar.component';

@NgModule({
  declarations: [
    CreateCustomerCaseComponent,
    StatusBarComponent,
    MaterialSelectionComponent,
    AdditionalFiltersComponent,
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
    UnderConstructionModule,
    MatCheckboxModule,
  ],
  exports: [CreateCustomerCaseComponent],
})
export class CreateCustomerCaseModule {}
