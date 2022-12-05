import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../../pipes/shared-pipes.module';
import { SyncStatusCustomerInfoHeaderComponent } from './sync-status-customer-info-header.component';
@NgModule({
  imports: [CommonModule, SharedTranslocoModule, SharedPipesModule, PushModule],
  declarations: [SyncStatusCustomerInfoHeaderComponent],
  exports: [SyncStatusCustomerInfoHeaderComponent],
})
export class SyncStatusCustomerInfoHeaderModule {}
