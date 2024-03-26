import { FormControl } from '@angular/forms';

import { StringOption } from '@schaeffler/inputs';

import { IndentationMaterial } from './indentation-material.model';

export interface IndentationRequestForm {
  enabled: FormControl<boolean>;
  value: FormControl<number>;
  diameter: FormControl<number>;
  diameterBall: FormControl<{ diameter: number; load: number }>;
  load: FormControl<StringOption>;
  thickness: FormControl<number>;
  material: FormControl<IndentationMaterial>;
}
