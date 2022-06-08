import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

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

  public get control(): UntypedFormControl {
    return (
      (this.meta.control?.get('value') as UntypedFormControl) ||
      new UntypedFormControl('')
    );
  }
}
