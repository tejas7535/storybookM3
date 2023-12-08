import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { RfqModalData } from '@gq/detail-view/detail-view/pricing-details/rfq-position-details/models/rfq-modal-data.model';
import { UpdateRfqPositionDetailsComponent } from '@gq/detail-view/detail-view/pricing-details/rfq-position-details/update-rfq-position-details/update-rfq-position-details.component';
import { QuotationRfqData } from '@gq/shared/models/quotation-detail/quotation-rfq-data.interface';

@Component({
  selector: 'gq-rfq-position-details',
  templateUrl: './rfq-position-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RfqPositionDetailsComponent {
  @Input() rfqData: QuotationRfqData;
  @Input() currency: string;
  @Input() rfqDataUpdateAvl: boolean;

  private readonly matDialog = inject(MatDialog);

  updateRfqData(): void {
    this.matDialog.open(UpdateRfqPositionDetailsComponent, {
      width: '550px',
      autoFocus: false,
      data: {
        gqPositionId: this.rfqData.gqPositionId,
      } as RfqModalData,
    });
  }
}
