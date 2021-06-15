import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';

import {
  BearinxPageNumberVariableMember,
  CONTROL_META,
  VariablePropertyMeta,
} from '@caeonline/dynamic-forms';

@Component({
  templateUrl: 'string-number-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringNumberMemberComponent {
  member: BearinxPageNumberVariableMember<any>;

  constructor(
    @Inject(CONTROL_META) public readonly meta: VariablePropertyMeta
  ) {
    this.member = this.meta.member as BearinxPageNumberVariableMember<any>;
  }

  public get control(): FormControl {
    return (
      (this.meta.control?.get('value') as FormControl) || new FormControl('')
    );
  }
}
