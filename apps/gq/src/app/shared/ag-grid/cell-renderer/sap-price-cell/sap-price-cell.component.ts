import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { ICellRendererParams } from 'ag-grid-community';

import { AppRoutePath } from '../../../../../app/app-route-path.enum';
import { DetailRoutePath } from '../../../../detail-view/detail-route-path.enum';
import { QuotationDetail } from '../../../models/quotation-detail';

@Component({
  selector: 'gq-sap-price-cell',
  templateUrl: './sap-price-cell.component.html',
})
export class SapPriceCellComponent {
  value: string;
  url: string;
  navigationExtras: NavigationExtras;

  constructor(private readonly router: Router) {}

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
  }

  navigate(event: MouseEvent): void {
    event.preventDefault();
    this.router.navigate(
      [`${AppRoutePath.DetailViewPath}/${DetailRoutePath.SapPath}`],
      this.navigationExtras
    );
  }
}
