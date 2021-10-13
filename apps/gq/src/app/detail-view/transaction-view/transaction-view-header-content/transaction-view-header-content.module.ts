import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { TransactionViewHeaderContentComponent } from './transaction-view-header-content.component';

@NgModule({
  declarations: [TransactionViewHeaderContentComponent],
  imports: [SharedModule, SharedTranslocoModule, SharedPipesModule],
  exports: [TransactionViewHeaderContentComponent],
})
export class TransactionViewHeaderContentModule {}
