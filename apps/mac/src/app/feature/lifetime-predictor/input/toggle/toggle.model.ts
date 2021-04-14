import { CustomFormControl } from '../input.model';

export class ToggleControl extends CustomFormControl {
  default: boolean;

  constructor(object: any) {
    super(object);
    this.default = object.default;
  }
}
