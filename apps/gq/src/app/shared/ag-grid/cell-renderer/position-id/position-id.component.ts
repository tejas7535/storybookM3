import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { RfqStatus } from '@gq/shared/models/quotation-detail/rfq-data/rfq-status.enum';
import { translate } from '@jsverse/transloco';
import { CellClassParams } from 'ag-grid-enterprise';

import { AppRoutePath } from '../../../../app-route-path.enum';

@Component({
  selector: 'gq-position-id',
  templateUrl: './position-id.component.html',
  styles: [],
  standalone: false,
})
export class PositionIdComponent {
  itemId: string;
  gqPositionId: string;
  isRfq = false;
  url: string;
  navigationExtras: NavigationExtras;
  imagePath: string;
  toolTipText: string;

  constructor(private readonly router: Router) {}
  agInit(params: CellClassParams): void {
    this.itemId = translate('shared.itemId', { id: params.value });
    this.gqPositionId = params.data.gqPositionId;
    if (params.data.rfqData) {
      this.isRfq = true;
      this.toolTipText =
        params.data.rfqData.status === RfqStatus.OPEN
          ? translate('shared.rfqOpen')
          : translate('shared.rfqClosed');

      this.imagePath =
        params.data.rfqData.status === RfqStatus.OPEN
          ? 'assets/png/rfq_open.png'
          : 'assets/png/rfq_closed.png';
    }
    this.navigationExtras = {
      queryParamsHandling: 'merge',
      queryParams: { gqPositionId: this.gqPositionId },
    };

    this.url = this.router
      .createUrlTree([AppRoutePath.DetailViewPath], this.navigationExtras)
      .toString();
  }
  navigate(event: MouseEvent): void {
    event.preventDefault();
    this.router.navigate([AppRoutePath.DetailViewPath], this.navigationExtras);
  }
}
