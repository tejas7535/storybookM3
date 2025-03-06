import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { ResultItem } from '@mm/core/store/models/calculation-result-state.model';

import { MediasViewProductButtonComponent } from '../medias-view-product-button/medias-view-product-button.component';
@Component({
  selector: 'mm-sleeve-connector',
  templateUrl: './sleeve-connector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatDividerModule, MediasViewProductButtonComponent],
})
export class SleeveConnectorComponent {
  @Input() sleeveConnectors: ResultItem[] = [];
  @Input() title = '';
}
