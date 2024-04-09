import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { QuotationAttachment, QuotationDetail } from '@gq/shared/models';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ActiveCaseActions } from './active-case.action';
import { activeCaseFeature } from './active-case.reducer';
import {
  getQuotationCurrency,
  getQuotationDetailIsFNumber,
  getQuotationHasFNumberMaterials,
  getQuotationHasRfqMaterials,
  getSapId,
  getSelectedQuotationDetail,
} from './active-case.selectors';
import { QuotationIdentifier, UpdateQuotationDetail } from './models';

@Injectable({
  providedIn: 'root',
})
export class ActiveCaseFacade {
  quotationIdentifier$: Observable<QuotationIdentifier> = this.store.select(
    activeCaseFeature.selectQuotationIdentifier
  );

  selectedQuotationDetail$: Observable<QuotationDetail> = this.store.select(
    getSelectedQuotationDetail
  );

  quotationSapId$: Observable<string> = this.store.select(getSapId);

  quotationCurrency$: Observable<string> =
    this.store.select(getQuotationCurrency);

  quotationDetailUpdating$ = this.store.select(
    activeCaseFeature.selectUpdateLoading
  );

  quotationDetailUpdateSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ActiveCaseActions.updateQuotationDetailsSuccess)
  );

  costsUpdating$ = this.store.select(
    activeCaseFeature.selectUpdateCostsLoading
  );

  updateCostsSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ActiveCaseActions.updateCostsSuccess)
  );

  rfqInformationUpdating$ = this.store.select(
    activeCaseFeature.selectUpdateRfqInformationLoading
  );

  updateRfqInformationSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ActiveCaseActions.updateRFQInformationSuccess)
  );

  attachmentsUploading$ = this.store.select(
    activeCaseFeature.selectAttachmentsUploading
  );

  uploadAttachmentsSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ActiveCaseActions.uploadAttachmentsSuccess)
  );

  quotationAttachments$: Observable<QuotationAttachment[]> = this.store.select(
    activeCaseFeature.selectAttachments
  );

  attachmentsGetting$: Observable<boolean> = this.store.select(
    activeCaseFeature.selectAttachmentsGetting
  );

  attachmentsGettingSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ActiveCaseActions.getAllAttachmentsSuccess)
  );

  quotationHasRfqMaterials$: Observable<boolean> = this.store.select(
    getQuotationHasRfqMaterials
  );

  quotationHasFNumberMaterials$: Observable<boolean> = this.store.select(
    getQuotationHasFNumberMaterials
  );

  quotationDetailIsFNumber$: Observable<boolean> = this.store.select(
    getQuotationDetailIsFNumber
  );

  deleteAttachmentSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ActiveCaseActions.deleteAttachmentSuccess)
  );

  deletionAttachmentInProgress$ = this.store.select(
    activeCaseFeature.selectAttachmentDeletionInProgress
  );

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions
  ) {}

  updateCosts(gqPosId: string): void {
    this.store.dispatch(ActiveCaseActions.updateCosts({ gqPosId }));
  }

  updateRfqInformation(gqPosId: string): void {
    this.store.dispatch(ActiveCaseActions.updateRFQInformation({ gqPosId }));
  }

  uploadAttachments(files: File[]) {
    this.store.dispatch(ActiveCaseActions.uploadAttachments({ files }));
  }

  getAllAttachments(): void {
    this.store.dispatch(ActiveCaseActions.getAllAttachments());
  }

  downloadAttachment(attachment: QuotationAttachment): void {
    this.store.dispatch(ActiveCaseActions.downloadAttachment({ attachment }));
  }

  deleteAttachment(attachment: QuotationAttachment): void {
    this.store.dispatch(ActiveCaseActions.deleteAttachment({ attachment }));
  }

  updateQuotationDetails(
    updateQuotationDetailList: UpdateQuotationDetail[]
  ): void {
    this.store.dispatch(
      ActiveCaseActions.updateQuotationDetails({ updateQuotationDetailList })
    );
  }
}
