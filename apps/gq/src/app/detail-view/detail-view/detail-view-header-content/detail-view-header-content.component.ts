import { Component, Input } from '@angular/core';

import { MaterialStock } from '../../../core/store/reducers/material-stock/models/material-stock.model';

@Component({
  selector: 'gq-detail-view-header-content',
  styleUrls: ['./detail-view-header-content.component.scss'],
  templateUrl: './detail-view-header-content.component.html',
})
export class DetailViewHeaderContentComponent {
  @Input() materialStock: MaterialStock;
  @Input() materialStockLoading: boolean;
}
