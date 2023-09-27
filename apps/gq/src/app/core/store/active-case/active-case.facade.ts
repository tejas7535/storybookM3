import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { QuotationAttachment } from '@gq/shared/models';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ActiveCaseActions } from './active-case.action';
import { activeCaseFeature } from './active-case.reducer';
import {
  getQuotationDetailIsFNumber,
  getQuotationHasFNumberMaterials,
} from './active-case.selectors';
import { QuotationIdentifier } from './models';

@Injectable({
  providedIn: 'root',
})
export class ActiveCaseFacade {
  quotationIdentifier$: Observable<QuotationIdentifier> = this.store.select(
    activeCaseFeature.selectQuotationIdentifier
  );

  costsUpdating$ = this.store.select(
    activeCaseFeature.selectUpdateCostsLoading
  );

  updateCostsSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ActiveCaseActions.updateCostsSuccess)
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

  quotationHasFNumberMaterials$: Observable<boolean> = this.store.select(
    getQuotationHasFNumberMaterials
  );

  quotationDetailIsFNumber$: Observable<boolean> = this.store.select(
    getQuotationDetailIsFNumber
  );

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions
  ) {}

  updateCosts(gqPosId: string): void {
    this.store.dispatch(ActiveCaseActions.updateCosts({ gqPosId }));
  }

  uploadAttachments(files: File[]) {
    this.store.dispatch(ActiveCaseActions.uploadAttachments({ files }));
  }

  getAllAttachments(): void {
    this.store.dispatch(ActiveCaseActions.getAllAttachments());
  }
}
