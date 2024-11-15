import { Component, inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { SapConditionType } from '@gq/core/store/reducers/sap-price-details/models';
import { DetailRoutePath } from '@gq/detail-view/detail-route-path.enum';
import { ICellRendererParams } from 'ag-grid-community';

import { AppRoutePath } from '../../../../../app/app-route-path.enum';
import { QuotationDetail } from '../../../models/quotation-detail';

@Component({
  selector: 'gq-sap-price-cell',
  templateUrl: './sap-price-cell.component.html',
})
export class SapPriceCellComponent {
  private readonly router = inject(Router);
  value: string;
  url: string;
  navigationExtras: NavigationExtras;
  isDetailLinkVisible = true;

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
        [`${AppRoutePath.DetailViewPath}/${DetailRoutePath.SapPath}`],
        this.navigationExtras
      )
      .toString();

    // Hide the detail link if the leading sap condition type is ZKI1 (GQUOTE-4837)
    this.isDetailLinkVisible =
      quotationDetail.leadingSapConditionType !== SapConditionType.ZKI1;
  }

  navigate(event: MouseEvent): void {
    event.preventDefault();
    this.router.navigate(
      [`${AppRoutePath.DetailViewPath}/${DetailRoutePath.SapPath}`],
      this.navigationExtras
    );
  }
}
