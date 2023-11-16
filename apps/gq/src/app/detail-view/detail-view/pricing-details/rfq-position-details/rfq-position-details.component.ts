import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { RfqData } from '@gq/shared/models/quotation-detail/rfq-data.interface';

@Component({
  selector: 'gq-rfq-position-details',
  templateUrl: './rfq-position-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RfqPositionDetailsComponent {
  @Input() currency: string;
  @Input() rfqData: RfqData;
}
