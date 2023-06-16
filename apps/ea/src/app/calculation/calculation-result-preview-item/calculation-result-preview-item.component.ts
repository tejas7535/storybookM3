import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { CalculationResultPreviewItem } from '@ea/core/store/models';
import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-calculation-result-preview-item',
  templateUrl: './calculation-result-preview-item.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MeaningfulRoundPipe,
  ],
})
export class CalculationResultPreviewItemComponent {
  @Input() styleClass: string | undefined;

  public _item: CalculationResultPreviewItem;
  public isSingleItem = false;

  @Input() set item(item: CalculationResultPreviewItem) {
    this._item = item;
    this.isSingleItem = item.values.length === 1;
  }
}
