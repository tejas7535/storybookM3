import { Component, inject } from '@angular/core';

import { combineLatest, map, tap } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import {
  getIsQuotationStatusActive,
  getQuotationCurrency,
} from '@gq/core/store/active-case/active-case.selectors';
import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { RolesFacade } from '@gq/core/store/facades';
import { UpdatePrice } from '@gq/shared/models/quotation-detail';
import { isFNumber } from '@gq/shared/utils/f-pricing.utils';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-filter-pricing',
  templateUrl: './filter-pricing.component.html',
})
export class FilterPricingComponent {
  #gqPositionId: string;
  readonly #store = inject(Store);
  readonly rolesFacade = inject(RolesFacade);

  quotationCurrency$ = this.#store.select(getQuotationCurrency);
  updateIsLoading$ = this.#store.select(activeCaseFeature.selectUpdateLoading);
  quotationIsActive$ = this.#store.select(getIsQuotationStatusActive);
  quotationDetail$ = this.#store
    .select(activeCaseFeature.getSelectedQuotationDetail)
    .pipe(
      tap((detail) => {
        this.#gqPositionId = detail?.gqPositionId;
      })
    );

  isDetailsLinkVisible$ = combineLatest([
    this.rolesFacade.userHasAccessToComparableTransactions$,
    this.quotationDetail$,
  ]).pipe(
    map(
      ([hasAccess, detail]) =>
        hasAccess && !isFNumber(detail) && !detail?.strategicPrice
    )
  );

  selectPrice(updatePrice: UpdatePrice): void {
    const { priceSource } = updatePrice;

    const updateQuotationDetailList: UpdateQuotationDetail[] = [
      {
        priceSource,
        gqPositionId: this.#gqPositionId,
        price: updatePrice.price,
      },
    ];
    this.#store.dispatch(
      ActiveCaseActions.updateQuotationDetails({ updateQuotationDetailList })
    );
  }
}
