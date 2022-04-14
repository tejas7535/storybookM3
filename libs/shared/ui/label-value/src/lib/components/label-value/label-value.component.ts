import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { LabelValue, Value } from '../../models';

@Component({
  selector: 'schaeffler-label-value',
  templateUrl: './label-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelValueComponent {
  @Input() public labelValues?: LabelValue[];
  @Input() public labelMaxWidth = 0;

  public readonly valueIsArray = (value: string | Value[]): boolean =>
    Array.isArray(value);
}
