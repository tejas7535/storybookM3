import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PumpItem } from '@mm/core/store/models/calculation-result-state.model';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'mm-report-pumps',
  templateUrl: './report-pumps.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, SharedTranslocoModule, ProductCardComponent],
})
export class ReportPumpsComponent {
  @Input() public pumps: PumpItem[] = [];
  @Input() public subTitle = '';
}
