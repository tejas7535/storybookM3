import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InfoIconModule } from '../../../shared/components/info-icon/info-icon.module';
import { ComparableTransactionsComponent } from './comparable-transactions.component';

@NgModule({
  declarations: [ComparableTransactionsComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    AgGridModule.withComponents({}),
    InfoIconModule,
    PushModule,
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
