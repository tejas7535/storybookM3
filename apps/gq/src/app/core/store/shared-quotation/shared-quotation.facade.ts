import { inject, Injectable } from '@angular/core';

import { SharedQuotationActions } from '@gq/core/store/shared-quotation/shared-quotation.actions';
import { sharedQuotationFeature } from '@gq/core/store/shared-quotation/shared-quotation.reducer';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class SharedQuotationFacade {
  #store = inject(Store);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  sharedQuotation$ = this.#store.select(
    sharedQuotationFeature.selectSharedQuotation
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  sharedQuotationLoading$ = this.#store.select(
    sharedQuotationFeature.selectSharedQuotationLoading
  );

  getSharedQuotation(gqId: number) {
    this.#store.dispatch(
      SharedQuotationActions.getSharedQuotation({
        gqId,
      })
    );
  }

  saveSharedQuotation(gqId: number) {
    this.#store.dispatch(
      SharedQuotationActions.saveSharedQuotation({
        gqId,
      })
    );
  }

  deleteSharedQuotation(sharedQuotationId: string) {
    this.#store.dispatch(
      SharedQuotationActions.deleteSharedQuotation({
        id: sharedQuotationId,
      })
    );
  }
}
