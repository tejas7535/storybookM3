import { Component } from '@angular/core';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import {
  validateCustomerNumber,
  validateMaterialNumber,
  validateSalesOrg,
  validateSectors,
} from './filter-validation';
import { ValidationHelper } from './validation-helper';
@Component({
  selector: 'd360-dummy',
  template: '',
})
class DummyComponent {}

describe('FilterHelpers', () => {
  let spectator: Spectator<DummyComponent>;

  const createComponent = createComponentFactory({
    component: DummyComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    ValidationHelper.localeService = spectator.query(TranslocoLocaleService);
  });

  test.each`
    input       | isValid
    ${'0615'}   | ${true}
    ${'6'}      | ${true}
    ${'06153'}  | ${false}
    ${'V123'}   | ${false}
    ${'06 123'} | ${false}
    ${'06.'}    | ${false}
  `(
    'validates sales org: $input (validates $isValid)',
    ({ input, isValid }) => {
      const result = validateSalesOrg(input);
      const resultValid = result == null;
      expect(resultValid).toBe(isValid);
    }
  );

  test.each`
    input                | isValid
    ${'0000051707'}      | ${true}
    ${'51707'}           | ${true}
    ${'00000 51707'}     | ${false}
    ${'V123'}            | ${false}
    ${'DACH'}            | ${false}
    ${'000005170777777'} | ${false}
  `(
    'validates customer number: $input (validates $isValid)',
    ({ input, isValid }) => {
      const result = validateCustomerNumber(input);
      const resultValid = result == null;
      expect(resultValid).toBe(isValid);
    }
  );

  test.each`
    input                   | isValid
    ${'004429478000011'}    | ${true}
    ${'004429478-0000-11'}  | ${true}
    ${'4429478000011'}      | ${false}
    ${'*000011'}            | ${false}
    ${'004429478000011000'} | ${false}
    ${'V123'}               | ${false}
    ${'4429478 000011'}     | ${false}
    ${'DACH'}               | ${false}
  `(
    'validates material number: $input (validates $isValid)',
    ({ input, isValid }) => {
      const result = validateMaterialNumber(input);
      const resultValid = result == null;
      expect(resultValid).toBe(isValid);
    }
  );

  describe('validateSectors', () => {
    test.each`
      input       | isValid
      ${''}       | ${false}
      ${'V'}      | ${false}
      ${'VVV'}    | ${false}
      ${'123'}    | ${false}
      ${'V1'}     | ${true}
      ${'V123'}   | ${true}
      ${'V12345'} | ${false}
      ${'I123'}   | ${false}
    `(
      'validates sector number: $input (validates $isValid)',
      ({ input, isValid }) => {
        const result = validateSectors(input);
        const resultValid = result == null;
        expect(resultValid).toBe(isValid);
      }
    );

    it('should return the custom validation message', () => {
      const result = validateSectors('VVV');

      expect(result.includes('error.onlyValuesWithNumbers')).toBe(true);
    });
  });
});
