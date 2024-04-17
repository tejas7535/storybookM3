import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { RolesFacade } from '@gq/core/store/facades';
import { DetailRoutePath } from '@gq/detail-view/detail-route-path.enum';
import { isFNumber } from '@gq/shared/utils/f-pricing.utils';
import { ICellRendererParams } from 'ag-grid-community';

import { AppRoutePath } from '../../../../../app/app-route-path.enum';
import { QuotationDetail } from '../../../models/quotation-detail';

@Component({
  selector: 'gq-gq-price-cell',
  templateUrl: './gq-price-cell.component.html',
})
export class GqPriceCellComponent {
  readonly #isFNumber: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  readonly #strategicPrice: BehaviorSubject<number> =
    new BehaviorSubject<number>(null);
  value: string;
  url: string;
  navigationExtras: NavigationExtras;
  isDetailsLinkVisible$: Observable<boolean> = combineLatest([
    this.rolesFacade.userHasAccessToComparableTransactions$,
    this.#isFNumber,
    this.#strategicPrice,
  ]).pipe(
    map(
      ([hasAccess, isFNumberValue, strategicPrice]) =>
        hasAccess && !isFNumberValue && !strategicPrice
    )
  );

  constructor(
    public readonly rolesFacade: RolesFacade,
    private readonly router: Router
  ) {}

  agInit(params: ICellRendererParams): void {
    this.value = params.valueFormatted;
    const quotationDetail: QuotationDetail = params.data;
    this.navigationExtras = {
      queryParamsHandling: 'merge',
      queryParams: {
        gqPositionId: quotationDetail.gqPositionId,
      },
    };

    this.url = this.router
      .createUrlTree(
        [`${AppRoutePath.DetailViewPath}/${DetailRoutePath.TransactionsPath}`],
        this.navigationExtras
      )
      .toString();

    this.#isFNumber.next(isFNumber(quotationDetail));
    this.#strategicPrice.next(quotationDetail?.strategicPrice);
  }

  navigate(event: MouseEvent): void {
    event.preventDefault();
    this.router.navigate(
      [`${AppRoutePath.DetailViewPath}/${DetailRoutePath.TransactionsPath}`],
      this.navigationExtras
    );
  }
}
