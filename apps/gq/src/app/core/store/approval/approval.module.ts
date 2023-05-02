import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ApprovalEffects } from './approval.effects';
import { ApprovalFacade } from './approval.facade';
import { approvalFeature } from './approval.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(approvalFeature),
    EffectsModule.forFeature([ApprovalEffects]),
  ],
  providers: [ApprovalFacade],
})
export class ApprovalModule {}
