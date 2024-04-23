import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InfoIconModule } from '@gq/shared/components/info-icon/info-icon.module';
import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ComparableTransactionsComponent } from './comparable-transactions.component';

@NgModule({
  declarations: [ComparableTransactionsComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    AgGridModule,
    InfoIconModule,
    PushPipe,
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
