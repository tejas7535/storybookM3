import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { RfqModalData } from '@gq/detail-view/detail-view/pricing-details/rfq-position-details/models/rfq-modal-data.model';
import { UpdateRfqPositionDetailsComponent } from '@gq/detail-view/detail-view/pricing-details/rfq-position-details/update-rfq-position-details/update-rfq-position-details.component';
import { SqvCheckSource } from '@gq/shared/models/quotation-detail/cost';
import { QuotationRfqData } from '@gq/shared/models/quotation-detail/rfq-data';

@Component({
  selector: 'gq-rfq-position-details',
  templateUrl: './rfq-position-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class RfqPositionDetailsComponent {
  @Input() rfqData: QuotationRfqData;
  @Input() currency: string;
  @Input() rfqDataUpdateAvl: boolean;
  @Input() refreshEnabled: boolean;
  @Input() refreshButtonTooltipText: string;

  private readonly matDialog = inject(MatDialog);
  sqvCheckSourceEnum = SqvCheckSource;

  updateRfqData(): void {
    if (!this.refreshEnabled) {
      return;
    }

    this.matDialog.open(UpdateRfqPositionDetailsComponent, {
      width: '550px',
      data: {
        gqPositionId: this.rfqData.gqPositionId,
      } as RfqModalData,
    });
  }
}
