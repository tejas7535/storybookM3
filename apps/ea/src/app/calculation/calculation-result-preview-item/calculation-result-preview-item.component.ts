import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CalculationResultPreviewItem } from '@ea/core/store/models';
import { InfoButtonComponent } from '@ea/shared/info-button/info-button.component';
import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationResultPreviewEmissionsTooltipComponent } from '../calculation-result-preview-emissions-tooltip/calculation-result-preview-emissions-tooltip.component';

@Component({
  selector: 'ea-calculation-result-preview-item',
  templateUrl: './calculation-result-preview-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatIconModule,
    InfoButtonComponent,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MeaningfulRoundPipe,
    CalculationResultPreviewEmissionsTooltipComponent,
  ],
})
export class CalculationResultPreviewItemComponent {
  @Input() styleClass: string | undefined;

  public _item: CalculationResultPreviewItem;
  public isSingleItem = false;
  public readonly yearlyEmissionUsageInHours = 8766;

  @Input() set item(item: CalculationResultPreviewItem) {
    this._item = item;
    this.isSingleItem = item.values.length === 1;
  }
}
