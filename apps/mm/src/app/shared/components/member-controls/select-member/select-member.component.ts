import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import {
  BearinxListValue,
  CONTROL_META,
  VariablePropertyMeta,
} from '@caeonline/dynamic-forms';

import { IDMM_MEASSURING_METHOD } from './../../../constants/dialog-constant';

@Component({
  selector: 'mm-select-member',
  templateUrl: './select-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMemberComponent {
  @Input() public options: (BearinxListValue & { value: string })[];
  @Input() public placeholder: string;

  public readonly IDMM_MEASSURING_METHOD = IDMM_MEASSURING_METHOD;

  public constructor(
    @Inject(CONTROL_META) public readonly meta: VariablePropertyMeta
  ) {}

  public get control(): UntypedFormControl {
    return (
      (this.meta.control?.get('value') as UntypedFormControl) ||
      new UntypedFormControl('')
    );
  }
}
