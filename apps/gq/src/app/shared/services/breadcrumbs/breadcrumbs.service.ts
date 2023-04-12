import { Injectable } from '@angular/core';

import {
  DetailViewQueryParams,
  ProcessCaseViewQueryParams,
} from '@gq/shared/models';
import { translate } from '@ngneat/transloco';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { AppRoutePath } from '../../../app-route-path.enum';
import { Customer } from '../../models/customer';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  caseViewBreadcrumb: Breadcrumb = {
    label: translate('shared.breadcrumbs.caseView'),
    url: `/${AppRoutePath.CaseViewPath}`,
  };

  getCaseViewBreadcrumb(): Breadcrumb {
    return this.caseViewBreadcrumb;
  }

  private getQuotationBreadcrumbs(
    queryParams: ProcessCaseViewQueryParams
  ): Breadcrumb[] {
    const quotationBreadCrumb: Breadcrumb = {
      queryParams,
      label: `GQ${queryParams.quotation_number}`,
      url: `/${AppRoutePath.ProcessCaseViewPath}`,
    };

    return [this.getCaseViewBreadcrumb(), quotationBreadCrumb];
  }
  public getQuotationBreadcrumbsForProcessCaseView(gqId: number): Breadcrumb[] {
    const quotationBreadCrumb: Breadcrumb = {
      label: `GQ${gqId}`,
    };

    return [this.getCaseViewBreadcrumb(), quotationBreadCrumb];
  }

  getDetailViewBreadcrumbs(
    itemId: number,
    queryParams: DetailViewQueryParams,
    includeLink: boolean
  ): Breadcrumb[] {
    const detailBreadcrumb: Breadcrumb = {
      label: `${translate('shared.breadcrumbs.position')} ${itemId}`,
    };
    if (includeLink) {
      detailBreadcrumb.url = `/${AppRoutePath.DetailViewPath}`;
      detailBreadcrumb.queryParams = queryParams;
    }

    const processCaseViewParams: DetailViewQueryParams = {
      ...queryParams,
      gqPositionId: undefined,
    };

    return [
      ...this.getQuotationBreadcrumbs(processCaseViewParams),
      detailBreadcrumb,
    ];
  }

  getPriceDetailBreadcrumbs(
    itemId: number,
    queryParams: DetailViewQueryParams,
    gqPrice: boolean
  ): Breadcrumb[] {
    const sapViewBreadcrumb: Breadcrumb = {
      label: translate(
        `shared.breadcrumbs.${gqPrice ? 'transactionView' : 'sapView'}`
      ),
    };

    return [
      ...this.getDetailViewBreadcrumbs(itemId, queryParams, true),
      sapViewBreadcrumb,
    ];
  }

  getCustomerBreadCrumbs(
    queryParams: DetailViewQueryParams,
    customer: Customer,
    itemId?: number
  ): Breadcrumb[] {
    const customerBreadCrumbs: Breadcrumb = {
      label: customer?.name,
    };
    if (queryParams.gqPositionId && itemId) {
      return [
        ...this.getDetailViewBreadcrumbs(itemId, queryParams, true),
        customerBreadCrumbs,
      ];
    }

    return [...this.getQuotationBreadcrumbs(queryParams), customerBreadCrumbs];
  }
}
