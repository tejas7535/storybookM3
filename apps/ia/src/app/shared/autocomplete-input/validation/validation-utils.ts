import { FormControl } from '@angular/forms';

import { IdValue } from '../../models';

export class ValidationUtils {
  public static isInputInvalid(
    items: IdValue[],
    control: FormControl
  ): boolean {
    const inputExists =
      (items && items.map((item) => item.value).includes(control.value)) ||
      !control.value;

    return !!(control && (control.dirty || control.touched) && !inputExists);
  }
}
