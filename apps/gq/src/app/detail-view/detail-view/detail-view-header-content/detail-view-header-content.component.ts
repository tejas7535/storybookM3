import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MaterialStock } from '@gq/core/store/reducers/models';

import { TagComponent } from '@schaeffler/tag';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-detail-view-header-content',
  templateUrl: './detail-view-header-content.component.html',
  imports: [CommonModule, SharedTranslocoModule, TagComponent],
})
export class DetailViewHeaderContentComponent {
  @Input() materialStock: MaterialStock;
  @Input() materialStockLoading: boolean;
}
