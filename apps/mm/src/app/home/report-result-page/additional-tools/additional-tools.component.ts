import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ResultItem } from '@mm/core/store/models/calculation-result-state.model';

import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'mm-additional-tools',
  templateUrl: './additional-tools.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent],
})
export class AdditionalToolsComponent {
  @Input() public additionalTools: ResultItem[] = [];
}
