import { Component, Input } from '@angular/core';

import { MaterialDetails } from '../../../core/store/models';

@Component({
  selector: 'gq-material-details',
  templateUrl: './material-details.component.html',
  styleUrls: ['./material-details.component.scss'],
})
export class MaterialDetailsComponent {
  @Input() materialDetails: MaterialDetails;
}
