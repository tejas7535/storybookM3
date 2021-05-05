import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InfoIconModule } from '../../../shared/info-icon/info-icon.module';
import { ComparableTransactionsComponent } from './comparable-transactions.component';

@NgModule({
  declarations: [ComparableTransactionsComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    InfoIconModule,
    AgGridModule.withComponents({}),
  ],
  exports: [ComparableTransactionsComponent],
})
export class ComparableTransactionsModule {}
