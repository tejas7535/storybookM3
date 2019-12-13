import { Observable } from 'rxjs';

import { CustomFormControl } from '../input.model';
import { SelectControlOption } from './select-control-option.model';

export class SelectControl extends CustomFormControl {
  options: SelectControlOption[];

  constructor(object: any) {
    super(object);
    this.options = object.options;
  }
}
