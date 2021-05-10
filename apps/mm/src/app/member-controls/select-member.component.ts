import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import {
  BearinxListValue,
  CONTROL_META,
  VariablePropertyMeta,
} from '@caeonline/dynamic-forms';

@Component({
  selector: 'mm-select-member',
  templateUrl: './select-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMemberComponent {
  @Input() options: (BearinxListValue & { value: string })[];

  constructor(
    @Inject(CONTROL_META) public readonly meta: VariablePropertyMeta
  ) {}

  public get control(): FormControl {
    return (
      (this.meta.control?.get('value') as FormControl) || new FormControl('')
    );
  }
}
