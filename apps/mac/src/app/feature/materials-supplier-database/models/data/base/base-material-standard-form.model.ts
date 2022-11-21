import { FormControl } from '@angular/forms';

import { StringOption } from '@schaeffler/inputs';

export interface BaseMaterialStandardForm {
  id?: FormControl<number>;
  materialName: FormControl<StringOption>;
  standardDocument: FormControl<StringOption>;
}
