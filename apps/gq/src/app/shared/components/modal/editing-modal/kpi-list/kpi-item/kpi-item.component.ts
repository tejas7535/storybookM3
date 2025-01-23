import { Component, input, InputSignal } from '@angular/core';

import { KpiDisplayValue } from '../../models/kpi-value.model';

@Component({
  selector: 'gq-kpi-item',
  templateUrl: './kpi-item.component.html',
})
export class KpiItemComponent {
  field: InputSignal<string> = input<string>('');
  kpi: InputSignal<KpiDisplayValue> = input<KpiDisplayValue>(null);
  index: InputSignal<number> = input<number>(0);
  keyText: InputSignal<string> = input<string>('');
  previousText: InputSignal<string> = input<string>('');
  extraWideKeyText: InputSignal<boolean> = input<boolean>(false);
}
