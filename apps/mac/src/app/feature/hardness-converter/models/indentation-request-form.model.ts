import { FormControl } from '@angular/forms';

import { IndentationMaterial } from './indentation-material.model';

export interface IndentationRequestForm {
  value: FormControl<number>;
  diameter: FormControl<number>;
  diameterBall: FormControl<number>;
  load: FormControl<number>;
  thickness: FormControl<number>;
  material: FormControl<IndentationMaterial>;
}
