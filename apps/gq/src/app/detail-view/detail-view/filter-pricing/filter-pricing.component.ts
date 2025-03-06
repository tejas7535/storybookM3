import { Component, inject } from '@angular/core';

import { combineLatest, map, Observable, tap } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { RolesFacade } from '@gq/core/store/facades';
import { UpdatePrice } from '@gq/shared/models/quotation-detail';
import { isFNumber } from '@gq/shared/utils/f-pricing.utils';

@Component({
  selector: 'gq-filter-pricing',
  templateUrl: './filter-pricing.component.html',
  standalone: false,
})
export class FilterPricingComponent {
  private readonly rolesFacade: RolesFacade = inject(RolesFacade);
  private readonly activeCaseFacade = inject(ActiveCaseFacade);

  private gqPositionId: string;

  quotationCurrency$: Observable<string> =
    this.activeCaseFacade.quotationCurrency$;
  updateIsLoading$: Observable<boolean> =
    this.activeCaseFacade.quotationDetailUpdating$;
  quotationIsEditable$: Observable<boolean> =
    this.activeCaseFacade.canEditQuotation$;
  quotationDetail$: Observable<any> =
    this.activeCaseFacade.selectedQuotationDetail$.pipe(
      tap((detail) => {
        this.gqPositionId = detail?.gqPositionId;
      })
    );
  isDetailsLinkVisible$: Observable<boolean> = combineLatest([
    this.rolesFacade.userHasAccessToComparableTransactions$,
    this.quotationDetail$,
  ]).pipe(
    map(
      ([hasAccess, detail]) =>
        hasAccess && !isFNumber(detail) && !detail?.strategicPrice
    )
  );
  userHasManualPriceRole$: Observable<boolean> =
    this.rolesFacade.userHasManualPriceRole$;
  userHasGPCRole$: Observable<boolean> = this.rolesFacade.userHasGPCRole$;
  userHasSQVRole$: Observable<boolean> = this.rolesFacade.userHasSQVRole$;
  userHasEditPriceSourceRole$: Observable<boolean> =
    this.rolesFacade.userHasEditPriceSourceRole$;

  selectPrice(updatePrice: UpdatePrice): void {
    const { priceSource } = updatePrice;

    const updateQuotationDetailList: UpdateQuotationDetail[] = [
      {
        priceSource,
        gqPositionId: this.gqPositionId,
        price: updatePrice.price,
      },
    ];
    this.activeCaseFacade.updateQuotationDetails(updateQuotationDetailList);
  }
}
