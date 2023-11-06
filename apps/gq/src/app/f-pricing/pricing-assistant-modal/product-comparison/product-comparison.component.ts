import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { MaterialInformationExtended } from '@gq/core/store/f-pricing/models/material-information-extended.interface';

@Component({
  selector: 'gq-product-comparison',
  templateUrl: './product-comparison.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComparisonModalComponent {
  @Input() referenceMaterialDescription: string;
  @Input() comparedMaterialDescription: string;
  @Input() materialInformation: MaterialInformationExtended[];
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
