import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ResultItem } from '@mm/core/store/models/calculation-result-state.model';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'mm-additional-tools',
  templateUrl: './additional-tools.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedTranslocoModule, ProductCardComponent],
})
export class AdditionalToolsComponent {
  @Input() public additionalTools: ResultItem[] = [];
  public imagePath = 'https://cdn.schaeffler-ecommerce.com/cdn/00168CD8_d.png'; // todo make dynamic
}
