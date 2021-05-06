import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared';
import { InfoIconModule } from '../../../shared/info-icon/info-icon.module';
import { TransactionViewHeaderContentComponent } from './transaction-view-header-content.component';

@NgModule({
  declarations: [TransactionViewHeaderContentComponent],
  imports: [SharedModule, SharedTranslocoModule, InfoIconModule],
  exports: [TransactionViewHeaderContentComponent],
})
export class TransactionViewHeaderContentModule {}
