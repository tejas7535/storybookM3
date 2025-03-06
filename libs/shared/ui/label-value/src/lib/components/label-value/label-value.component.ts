import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  TemplateRef,
} from '@angular/core';

import { LabelValue, Value } from '../../models';

@Component({
  selector: 'schaeffler-label-value',
  templateUrl: './label-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LabelValueComponent {
  @Input() public labelValues?: LabelValue[];
  @Input() public labelMinWidth = 0;
  @Input() public labelMaxWidth = 0;
  @Input() public showValue?: boolean = true;
  @ContentChild(TemplateRef) public custom!: TemplateRef<any>;

  public readonly valueIsArray = (value: string | Value[]): boolean =>
    Array.isArray(value);
}
