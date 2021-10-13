import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InfoIconModule } from '../../../shared/info-icon/info-icon.module';
import { ComparableTransactionsComponent } from './comparable-transactions.component';

@NgModule({
  declarations: [ComparableTransactionsComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    AgGridModule.withComponents({}),
    InfoIconModule,
  ],
  exports: [ComparableTransactionsComponent],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'transaction-view',
    },
  ],
})
export class ComparableTransactionsModule {}
