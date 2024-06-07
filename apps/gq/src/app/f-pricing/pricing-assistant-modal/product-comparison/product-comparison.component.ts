import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { MaterialInformationExtended } from '@gq/core/store/f-pricing/models/material-information-extended.interface';
import { MaterialDetails } from '@gq/shared/models';
import { MaterialToCompare } from '@gq/shared/models/f-pricing/material-to-compare.interface';

@Component({
  selector: 'gq-product-comparison',
  templateUrl: './product-comparison.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComparisonModalComponent {
  @Input() referenceMaterial: MaterialDetails;
  @Input() comparedMaterial: MaterialToCompare;
  @Input() materialInformation: MaterialInformationExtended[];
  @Input() materialComparisonLoading = true;
  @Output() closeView: EventEmitter<void> = new EventEmitter<void>();

  showDelta = true;
  showDeltasByKey: Map<string, boolean> = new Map<string, boolean>();

  toggleIconVisibility(): void {
    this.showDelta = !this.showDelta;
  }

  onTogglePanelExpanded(informationKey: string, isOpen: boolean): void {
    this.showDeltasByKey.set(informationKey, isOpen);
  }
}
