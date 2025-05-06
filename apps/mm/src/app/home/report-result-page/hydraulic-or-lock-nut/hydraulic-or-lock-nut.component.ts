import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ResultItem } from '@mm/core/store/models/calculation-result-state.model';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'mm-hydraulic-or-lock-nut',
  templateUrl: './hydraulic-or-lock-nut.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, SharedTranslocoModule, ProductCardComponent],
})
export class HydraulicOrLockNutComponent {
  @Input() public hydraulicOrLockNut: ResultItem[] = [];
  @Input() public title: string;
}
