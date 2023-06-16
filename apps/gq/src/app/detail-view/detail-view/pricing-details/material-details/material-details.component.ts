import { Component, Input } from '@angular/core';

import { MaterialDetails } from '@gq/shared/models/quotation-detail';

@Component({
  selector: 'gq-material-details',
  templateUrl: './material-details.component.html',
})
export class MaterialDetailsComponent {
  @Input() materialDetails: MaterialDetails;
  @Input() customerMaterial: string;
  @Input() materialClassificationSOP: string;
  @Input() deliveryUnit: number;
  @Input() usageRestriction: string;
}
