import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';

import { distinctUntilChanged, filter, map, Observable, take } from 'rxjs';

import { IdValue } from '../models/search';

export function quantityDeliveryUnitValidator(
  selectedAutocompleteMaterial$: Observable<IdValue>
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> =>
    selectedAutocompleteMaterial$.pipe(
      filter((selectedMaterial) => !!selectedMaterial),
      distinctUntilChanged(),
      map((selectedMaterial) =>
        control.value &&
        selectedMaterial.deliveryUnit &&
        control.value % selectedMaterial.deliveryUnit !== 0
          ? { invalidDeliveryUnit: true }
          : null
      ),
      take(1)
    );
}
