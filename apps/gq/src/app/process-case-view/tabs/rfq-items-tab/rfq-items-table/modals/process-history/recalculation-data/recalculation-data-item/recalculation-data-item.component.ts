import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

import { UndefinedToDashPipe } from '@gq/shared/pipes/undefined-to-dash/undefined-to-dash.pipe';

@Component({
  selector: 'gq-recalculation-data-item',
  templateUrl: './recalculation-data-item.component.html',
  imports: [CommonModule, UndefinedToDashPipe],
})
export class RecalculationDataItemComponent {
  caption: InputSignal<string> = input(null);
  value: InputSignal<string> = input(null);
}
