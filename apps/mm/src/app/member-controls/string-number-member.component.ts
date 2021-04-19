import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CONTROL_META, VariablePropertyMeta } from '@caeonline/dynamic-forms';

@Component({
  templateUrl: 'string-number-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringNumberMemberComponent {
  constructor(
    @Inject(CONTROL_META) public readonly meta: VariablePropertyMeta
  ) {}

  public get control(): FormControl {
    return (
      (this.meta.control?.get('value') as FormControl) || new FormControl('')
    );
  }
}
