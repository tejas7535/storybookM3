import { of } from 'rxjs';

import { marbles } from 'rxjs-marbles';

import { IdValue } from '../models/search';
import { quantityDeliveryUnitValidator } from './quantity-delivery-unit-validator';

describe('QuantityDeliveryUnitValidator', () => {
  test(
    'should return null if the control value is valid',
    marbles((m) => {
      const selectedMaterial$ = of({ deliveryUnit: 5 } as IdValue);
      const control = { value: 10 };
      const result$: any = quantityDeliveryUnitValidator(selectedMaterial$)(
        control as any
      );
      m.expect(result$).toBeObservable(m.cold('(a|)', { a: null }));
    })
  );
  test(
    'should return null if quantity is a multiple of deliveryUnit',
    marbles((m) => {
      const selectedMaterial$ = of({ deliveryUnit: 5 } as IdValue);
      const control = { value: 10 };
      const result$: any = quantityDeliveryUnitValidator(selectedMaterial$)(
        control as any
      );
      m.expect(result$).toBeObservable(m.cold('(a|)', { a: null }));
    })
  );
  test(
    'should return null when deliveryUnit of selectedMaterial is null',
    marbles((m) => {
      const selectedMaterial$ = of({ deliveryUnit: null } as IdValue);
      const control = { value: 10 };
      const result$: any = quantityDeliveryUnitValidator(selectedMaterial$)(
        control as any
      );
      m.expect(result$).toBeObservable(m.cold('(a|)', { a: null }));
    })
  );
  test(
    'should return the error when quantity is not a multiple of deliveryUnit',
    marbles((m) => {
      const selectedMaterial$ = of({ deliveryUnit: 5 } as IdValue);
      const control = { value: 11 };
      const result$: any = quantityDeliveryUnitValidator(selectedMaterial$)(
        control as any
      );
      m.expect(result$).toBeObservable(
        m.cold('(a|)', { a: { invalidDeliveryUnit: true } })
      );
    })
  );
});
