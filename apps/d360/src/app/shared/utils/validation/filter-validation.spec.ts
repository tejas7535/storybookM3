import { Stub } from '../../test/stub.class';
import {
  validateAlertTypes,
  validateCustomerNumber,
  validateFor2Characters,
  validateForText,
  validateGkamNumber,
  validateMaterialNumber,
  validateProductionPlants,
  validateProductionSegment,
  validateSalesOrg,
  validateSectors,
} from './filter-validation';

describe('FilterHelpers', () => {
  beforeEach(() => {
    Stub.initValidationHelper();
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
      ${'1V23'}   | ${false}
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

  test.each`
    input        | isValid
    ${'123456'}  | ${true}
    ${'6'}       | ${true}
    ${'1234567'} | ${false}
    ${'ABC'}     | ${false}
    ${'123 45'}  | ${false}
    ${'123.45'}  | ${false}
  `(
    'validates GKAM number: $input (validates $isValid)',
    ({ input, isValid }) => {
      const result = validateGkamNumber(input);
      const resultValid = result == null;
      expect(resultValid).toBe(isValid);
    }
  );

  test.each`
    input        | isValid
    ${'123456'}  | ${true}
    ${'6'}       | ${true}
    ${'1234567'} | ${false}
    ${'ABC'}     | ${false}
    ${'123 45'}  | ${false}
    ${'123.45'}  | ${false}
  `(
    'validates production segment: $input (validates $isValid)',
    ({ input, isValid }) => {
      const result = validateProductionSegment(input);
      const resultValid = result == null;
      expect(resultValid).toBe(isValid);
    }
  );

  test.each`
    input      | isValid
    ${'1234'}  | ${true}
    ${'6'}     | ${true}
    ${'12345'} | ${false}
    ${'ABC'}   | ${false}
    ${'12 3'}  | ${false}
    ${'12.3'}  | ${false}
  `(
    'validates production plants: $input (validates $isValid)',
    ({ input, isValid }) => {
      const result = validateProductionPlants(input);
      const resultValid = result == null;
      expect(resultValid).toBe(isValid);
    }
  );

  test.each`
    input        | isValid
    ${'ABCDEF'}  | ${true}
    ${'XYZABC'}  | ${true}
    ${'ABC'}     | ${false}
    ${'ABCDEFG'} | ${false}
    ${'ABC123'}  | ${false}
    ${'ABC DEF'} | ${false}
  `(
    'validates alert types: $input (validates $isValid)',
    ({ input, isValid }) => {
      const result = validateAlertTypes(input);
      const resultValid = result == null;
      expect(resultValid).toBe(isValid);
    }
  );

  test.each`
    input    | isValid
    ${'AB'}  | ${true}
    ${'XY'}  | ${true}
    ${'A'}   | ${false}
    ${'ABC'} | ${false}
    ${'A1'}  | ${false}
    ${'A B'} | ${false}
  `(
    'validates for 2 characters: $input (validates $isValid)',
    ({ input, isValid }) => {
      const result = validateFor2Characters(input);
      const resultValid = result == null;
      expect(resultValid).toBe(isValid);
    }
  );

  test.each`
    input       | isValid
    ${'ABC'}    | ${true}
    ${'Text'}   | ${true}
    ${'ABC123'} | ${false}
    ${'123'}    | ${false}
    ${'AB 12'}  | ${false}
    ${'A.B'}    | ${false}
  `('validates for text: $input (validates $isValid)', ({ input, isValid }) => {
    const result = validateForText(input);
    const resultValid = result == null;
    expect(resultValid).toBe(isValid);
  });
});
