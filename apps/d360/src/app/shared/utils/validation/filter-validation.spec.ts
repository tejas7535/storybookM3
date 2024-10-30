import {
  validateCustomerNumber,
  validateMaterialNumber,
  validateSalesOrg,
} from './filter-validation';

describe('FilterHelpers', () => {
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
});
