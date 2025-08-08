import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { CancellationReason } from '@gq/process-case-view/tabs/open-items-tab/open-items-table/modals/cancel-process/cancel-process.component';
import { ActiveDirectoryUser, QuotationDetail } from '@gq/shared/models';
import { QuotationDetailRfq4 } from '@gq/shared/models/quotation-detail/rfq/quotation-detail-rfq4.interface';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { getQuotationDetailRfq } from '../active-case/active-case.selectors';
import { Rfq4ProcessActions } from './rfq-4-process.actions';
import { ProcessLoading, rfq4ProcessFeature } from './rfq-4-process.reducer';

@Injectable({
  providedIn: 'root',
})
export class Rfq4ProcessFacade {
  private readonly store: Store = inject(Store);
  private readonly actions$: Actions = inject(Actions);
  private readonly featureToggleService: FeatureToggleConfigService = inject(
    FeatureToggleConfigService
  );

  isProcessLoading$: Observable<boolean> = this.store.select(
    rfq4ProcessFeature.isProcessLoading
  );

  processLoading$: Observable<ProcessLoading> = this.store.select(
    rfq4ProcessFeature.selectProcessLoading
  );

  calculators$: Observable<string[]> = this.store.select(
    rfq4ProcessFeature.selectFoundCalculators
  );
  sendRecalculateSqvSuccess$: Observable<void> = this.actions$.pipe(
    ofType(Rfq4ProcessActions.sendRecalculateSqvRequestSuccess)
  );
  sendReopenRecalculationSuccess$: Observable<void> = this.actions$.pipe(
    ofType(Rfq4ProcessActions.sendReopenRecalculationRequestSuccess)
  );
  getMaintainersLoading$: Observable<boolean> = this.store.select(
    rfq4ProcessFeature.selectSapMaintainersLoading
  );
  maintainers$: Observable<ActiveDirectoryUser[]> = this.store.select(
    rfq4ProcessFeature.getValidMaintainers
  );
  cancelProcessSuccess$: Observable<void> = this.actions$.pipe(
    ofType(Rfq4ProcessActions.sendCancelProcessSuccess)
  );

  // ########################################################
  // ###################  methods  ##########################
  // ########################################################

  getQuotationDetailRfq(gqPositionId: string): Observable<QuotationDetailRfq4> {
    return this.store.select(getQuotationDetailRfq(gqPositionId));
  }

  findCalculators(gqPositionId: string): void {
    this.store.dispatch(Rfq4ProcessActions.findCalculators({ gqPositionId }));
  }

  clearCalculators(): void {
    this.store.dispatch(Rfq4ProcessActions.clearCalculators());
  }

  sendRecalculateSqvRequest(gqPositionId: string, message: string): void {
    this.store.dispatch(
      Rfq4ProcessActions.sendRecalculateSqvRequest({
        gqPositionId,
        message,
      })
    );
  }
  getSapMaintainers(): void {
    if (this.featureToggleService.isEnabled('openItemsTab')) {
      this.store.dispatch(Rfq4ProcessActions.getSapMaintainerUserIds());
    }
  }

  sendEmailRequestToMaintainCalculators(
    quotationDetail: QuotationDetail
  ): void {
    this.store.dispatch(
      Rfq4ProcessActions.sendEmailRequestToMaintainCalculators({
        quotationDetail,
      })
    );
  }

  sendReopenRecalculationRequest(gqPositionId: string): void {
    this.store.dispatch(
      Rfq4ProcessActions.sendReopenRecalculationRequest({
        gqPositionId,
      })
    );
  }

  sendCancelProcessRequest(
    gqPositionId: string,
    reasonForCancellation: CancellationReason,
    comment: string
  ) {
    this.store.dispatch(
      Rfq4ProcessActions.sendCancelProcess({
        gqPositionId,
        reasonForCancellation,
        comment,
      })
    );
  }
}
