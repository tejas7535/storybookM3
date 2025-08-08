import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { map, Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { SapPriceConditionDetail } from '@gq/core/store/reducers/models';
import { MaterialPriceHeaderContentModule } from '@gq/shared/components/header/material-price-header-content/material-price-header-content.module';
import { StatusCustomerInfoHeaderModule } from '@gq/shared/components/header/status-customer-info-header/status-customer-info-header.module';
import { Quotation } from '@gq/shared/models';
import { Customer } from '@gq/shared/models/customer';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { TRANSLOCO_SCOPE, TranslocoService } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { Breadcrumb } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SapPriceDetailsTableComponent } from './sap-price-details-table/sap-price-details-table.component';

@Component({
  selector: 'gq-sap-view',
  imports: [
    CommonModule,
    MatCardModule,
    SharedTranslocoModule,
    SubheaderModule,
    PushPipe,
    ShareButtonModule,
    MaterialPriceHeaderContentModule,
    LoadingSpinnerModule,
    StatusCustomerInfoHeaderModule,
    SapPriceDetailsTableComponent,
  ],
  templateUrl: './sap-view.component.html',
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'sap-view',
    },
  ],
  standalone: true,
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
