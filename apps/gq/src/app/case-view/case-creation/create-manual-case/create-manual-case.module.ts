import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ActiveCaseModule } from '@gq/core/store/active-case/active-case.module';
import { CurrencyModule } from '@gq/core/store/currency/currency.module';
import { AutocompleteInputComponent } from '@gq/shared/components/autocomplete-input/autocomplete-input.component';
import { AddEntryComponent } from '@gq/shared/components/case-material/add-entry/add-entry.component';
import { InputTableComponent } from '@gq/shared/components/case-material/input-table/input-table.component';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { OfferTypeSelectComponent } from '@gq/shared/components/offer-type-select/offer-type-select.component';
import { PurchaseOrderTypeSelectComponent } from '@gq/shared/components/purchase-order-type-select/purchase-order-type-select.component';
import { SectorGpsdSelectComponent } from '@gq/shared/components/sector-gpsd-select/sector-gpsd-select.component';
import { SelectSalesOrgComponent } from '@gq/shared/components/select-sales-org/select-sales-org.component';
import { LetDirective, PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CreateManualCaseComponent } from './create-manual-case.component';

@NgModule({
  declarations: [CreateManualCaseComponent],
  imports: [
    AddEntryComponent,
    CommonModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    MatIconModule,
    MatButtonModule,
    PushPipe,
    AutocompleteInputComponent,
    InputTableComponent,
    SelectSalesOrgComponent,
    DialogHeaderModule,
    PurchaseOrderTypeSelectComponent,
    SectorGpsdSelectComponent,
    OfferTypeSelectComponent,
    LetDirective,
    MatDialogModule,
    CurrencyModule,
    ActiveCaseModule,
  ],
  exports: [CreateManualCaseComponent],
})
export class CreateManualCaseModule {}
