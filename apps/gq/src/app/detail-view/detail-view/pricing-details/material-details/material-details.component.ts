import { Component, Input } from '@angular/core';

import { MaterialDetails } from '../../../../shared/models/quotation-detail';

@Component({
  selector: 'gq-material-details',
  templateUrl: './material-details.component.html',
  styleUrls: ['./material-details.component.scss'],
})
export class MaterialDetailsComponent {
  @Input() materialDetails: MaterialDetails;
  @Input() customerMaterial: string;
}
