import { inject, Injectable } from '@angular/core';

import { SharedQuotationActions } from '@gq/core/store/shared-quotation/shared-quotation.actions';
import { sharedQuotationFeature } from '@gq/core/store/shared-quotation/shared-quotation.reducer';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class SharedQuotationFacade {
  readonly #store = inject(Store);

  sharedQuotation$ = this.#store.select(
    sharedQuotationFeature.selectSharedQuotation
  );

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
