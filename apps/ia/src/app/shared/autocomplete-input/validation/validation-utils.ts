import { FormControl } from '@angular/forms';

import { IdValue } from '../../models';

export const ValidationUtils = {
  isInputInvalid(items: IdValue[], control: FormControl): boolean {
    const inputExists =
      control.value === null ||
      (items && items.map((item) => item.value).includes(control.value));

    return !!(control && (control.dirty || control.touched) && !inputExists);
  },
};
