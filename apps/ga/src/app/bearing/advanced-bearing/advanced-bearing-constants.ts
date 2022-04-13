import { Validators } from '@angular/forms';

export const dimensionValidators = [
  Validators.min(1),
  // Validators.max(1_000_000), // TODO clarifiy if there should be a limit
];
