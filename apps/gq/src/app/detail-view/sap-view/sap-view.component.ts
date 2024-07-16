import { Component, inject } from '@angular/core';

import { map, Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { SapPriceConditionDetail } from '@gq/core/store/reducers/models';
import { Quotation } from '@gq/shared/models';
import { Customer } from '@gq/shared/models/customer';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { TranslocoService } from '@jsverse/transloco';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

@Component({
  selector: 'gq-sap-view',
  templateUrl: './sap-view.component.html',
})
export class SapViewComponent {
  private readonly breadCrumbsService: BreadcrumbsService =
    inject(BreadcrumbsService);
  private readonly translocoService: TranslocoService =
    inject(TranslocoService);
  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);

  customer$: Observable<Customer> = this.activeCaseFacade.quotationCustomer$;
  quotation$: Observable<Quotation> = this.activeCaseFacade.quotation$;
  quotationCurrency$: Observable<string> =
    this.activeCaseFacade.quotationCurrency$;
  quotationDetail$: Observable<QuotationDetail> =
    this.activeCaseFacade.selectedQuotationDetail$;
  quotationLoading$: Observable<boolean> =
    this.activeCaseFacade.quotationLoading$;
  translationsLoaded$: Observable<boolean> = this.translocoService
    .selectTranslateObject('sapView', {}, '')
    .pipe(map((value) => typeof value !== 'string'));
  sapPriceDetailsLoading$: Observable<boolean> =
    this.activeCaseFacade.sapPriceDetailsLoading$;
  breadcrumbs$: Observable<Breadcrumb[]> =
    this.activeCaseFacade.detailViewQueryParams$.pipe(
      map((res) =>
        this.breadCrumbsService.getPriceDetailBreadcrumbs(
          res.id,
          res.queryParams,
          false
        )
      )
    );
  rowData$: Observable<SapPriceConditionDetail[]> =
    this.activeCaseFacade.sapPriceDetails$;
  translation$: Observable<any> = this.translocoService.selectTranslateObject(
    'sapView',
    {},
    ''
  );
}
