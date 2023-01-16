import { FormControl } from '@angular/forms';

export interface AQMCompositionForm {
  c: FormControl<number>;
  si: FormControl<number>;
  mn: FormControl<number>;
  cr: FormControl<number>;
  mo: FormControl<number>;
  ni: FormControl<number>;
}
