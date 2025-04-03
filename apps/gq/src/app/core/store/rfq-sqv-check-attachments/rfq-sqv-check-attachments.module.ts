import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { RfqSqvCheckAttachmentsEffects } from './rfq-sqv-check-attachments.effects';
import { RfqSqvCheckAttachmentFacade } from './rfq-sqv-check-attachments.facade';
import { rfqSqvCheckAttachmentsFeature } from './rfq-sqv-check-attachments.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(rfqSqvCheckAttachmentsFeature),
    EffectsModule.forFeature([RfqSqvCheckAttachmentsEffects]),
  ],
  providers: [RfqSqvCheckAttachmentFacade],
})
export class RfqSqvCheckAttachmentModule {}
