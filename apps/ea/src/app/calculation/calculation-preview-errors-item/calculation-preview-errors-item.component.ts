import { Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import { CalculationResultPreviewItem } from '@ea/core/store/models';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-calculation-preview-errors-item',
  templateUrl: './calculation-preview-errors-item.component.html',
  standalone: true,
  imports: [MatDividerModule, SharedTranslocoModule],
})
export class CalculationPreviewErrorsItemComponent {
  previewItems = input.required<CalculationResultPreviewItem[]>();
  errors = input.required<string[]>();
}
